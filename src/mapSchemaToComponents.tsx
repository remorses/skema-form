import * as React from 'react'
import clonedeep from 'lodash.clonedeep'
import { Form, Field, FormRenderProps, useField } from 'react-final-form'
import styled from 'styled-components'
import { FieldArray } from 'react-final-form-arrays'
import { Components } from './types'
import { Row, Hidden } from 'hybrid-components'

const mapSchemaToComponents = (
    schema,
    components: Components,
    previousKey = 'root',
    formProps = {} as FormRenderProps
) => {
    const {
        Input,
        InputNumber,
        Checkbox,
        Range,
        Label,
        ErrorMessage,
        SingleSelect,
        MultiSelect,
        RadioOption,
        Button,

        RootContainer,
        ObjectContainer,
        PropertyContainer
    } = components
    const errorMessage = ({ meta }) => (
        <>
            {/* {console.log(JSON.stringify(meta, null, '\t'))} */}
            {meta.error && meta.touched ? (
                <ErrorMessage>{meta.error}</ErrorMessage>
            ) : (
                <Hidden>
                    <ErrorMessage>{'_'}</ErrorMessage>
                </Hidden>
            )}
        </>
    )

    // console.log('"' + schema.title + '"')
    const prettyKey = humanize(
        previousKey
            .split('.')
            .pop()
            .replace(/\[\d\]/, '')
    )
    const title = humanize(schema.title || '')
    const desc = humanize(schema.description || title || '')
    if (schema.anyOf) {
        const items: string[] = schema.anyOf.map((x) => x.title)
        const choiceKey = previousKey + 'Choice'
        return (
            <>
                {desc && <Label>{desc}</Label>}
                {items.map((value) => {
                    return (
                        <Field
                            type='radio'
                            key={value + choiceKey}
                            name={choiceKey}
                            value={value}
                        >
                            {({ input, meta }) => {
                                return (
                                    <>
                                        <RadioOption
                                            key={'radio' + value}
                                            {...input}
                                        >
                                            {value}
                                        </RadioOption>
                                    </>
                                )
                            }}
                        </Field>
                    )
                })}
                <Field name={choiceKey} component={errorMessage} />
                <Field name={choiceKey}>
                    {({ input: {value} }) => {
                        // console.log(value)
                        if (!value) {
                            return null
                        }
                        const subset = schema.anyOf.find(x => x.title == value)
                        // console.log(subset)
                        // console.log(previousKey)
                        return (
                            <>
                                {mapSchemaToComponents(
                                    subset,
                                    components,
                                    previousKey,
                                    formProps
                                )}
                            </>
                        )
                    }}
                </Field>
            </>
        )
    }
    if (schema.enum) {
        const transformer = transform(schema)
        const items = schema.enum.map(transformer)

        if (items.length < 5) {
            return (
                <>
                    {desc && <Label>{desc}</Label>}
                    {items.map((value) => {
                        return (
                            <Field
                                type='radio'
                                key={previousKey + value}
                                name={previousKey}
                                value={value}
                            >
                                {({ input, meta }) => {
                                    const { onChange } = input
                                    input.onChange = (e) => {
                                        const value = getEventValue(e)
                                        return onChange(transformer(value))
                                    }
                                    return (
                                        <>
                                            <RadioOption
                                                key={'radio' + value}
                                                {...input}
                                            >
                                                {value}
                                            </RadioOption>
                                        </>
                                    )
                                }}
                            </Field>
                        )
                    })}
                    <Field name={previousKey} component={errorMessage} />
                </>
            )
        } else {
            return (
                <Field key={previousKey + schema.title} name={previousKey}>
                    {({ input, meta }) => {
                        return (
                            <>
                                {desc && <Label>{desc}</Label>}
                                <SingleSelect
                                    items={items}
                                    {...input}
                                    placeholder={prettyKey}
                                />
                                <Field
                                    name={previousKey}
                                    component={errorMessage}
                                />
                            </>
                        )
                    }}
                </Field>
            )
        }
    }

    switch (schema.type) {
        case 'object':
            const { properties = [] } = schema
            const Container =
                previousKey === 'root' ? RootContainer : ObjectContainer
            return (
                <Container
                    currentKey={previousKey}
                    title={title}
                    description={schema.description}
                >
                    {Object.entries(properties).map(([name, subset]) => (
                        <PropertyContainer key={previousKey + name}>
                            {mapSchemaToComponents(
                                subset,
                                components,
                                `${previousKey}.${name}`,
                                formProps
                            )}
                        </PropertyContainer>
                    ))}
                </Container>
            )
        case 'array':
            const { items: subset = {} } = schema
            if (subset.enum) {
                const items = subset.enum
                return (
                    <Field key={previousKey + schema.title} name={previousKey}>
                        {({ input, meta }) => {
                            const { onChange } = input
                            input.value = input.value || []
                            input.onChange = (e) => {
                                // console.log(e)
                                const value = getEventValue(e) || []
                                // console.log('value', value)
                                return onChange(value.map(transform(subset)))
                            }
                            return (
                                <>
                                    {desc && <Label>{desc}</Label>}
                                    <MultiSelect
                                        items={items}
                                        {...input}
                                        placeholder={prettyKey}
                                    />
                                    <Field
                                        name={previousKey}
                                        component={errorMessage}
                                    />
                                </>
                            )
                        }}
                    </Field>
                )
            } else if (subset.type === 'string' || subset.type === 'number') {
                const defaultValue = subset.type === 'string' ? '' : null
                return (
                    // <ObjectContainer key={previousKey + schema.title} currentKey={previousKey}>
                    <>
                        {desc && <Label>{desc}</Label>}
                        <FieldArray name={previousKey}>
                            {(
                                { fields } // TODO style array
                            ) => (
                                <>
                                    {fields.map((name, index) => {
                                        return (
                                            // <PropertyContainer key={name}>
                                                <Row>
                                                    {mapSchemaToComponents(
                                                        {
                                                            ...subset,
                                                            description: '',
                                                            title: ''
                                                        },
                                                        components,
                                                        name,
                                                        formProps
                                                    )}
                                                    <Button
                                                        onClick={() =>
                                                            fields.remove(index)
                                                        }
                                                    >
                                                        x
                                                    </Button>
                                                </Row>
                                            // </PropertyContainer>
                                        )
                                    })}
                                    
                                        <Button
                                            onClick={() => {
                                                const values =
                                                    fields.value || []
                                                if (
                                                    values.filter(
                                                        (x) =>
                                                            x === defaultValue
                                                    ).length
                                                ) {
                                                    return
                                                }
                                                formProps.form.mutators.push(
                                                    previousKey,
                                                    ''
                                                )
                                            }}
                                        >
                                            Add Item
                                        </Button>
                                        <Field
                                            name={previousKey}
                                            component={errorMessage}
                                        />
                                    </>

                            )}
                        </FieldArray>
                        {/* </ObjectContainer> */}
                    </>
                )
            }

        case 'string':
            return (
                <Field key={previousKey + schema.title} name={previousKey}>
                    {({ input, meta }) => (
                        <>
                            {desc && <Label>{desc}</Label>}
                            <Input
                                type='text'
                                {...input}
                                placeholder={prettyKey}
                            />
                            <Field
                                name={previousKey}
                                component={errorMessage}
                            />
                        </>
                    )}
                </Field>
            )
        case 'number':
            const {
                minimum: min = null,
                exclusiveMaximum: max = null,
                multipleOf: step = 0.1
            } = schema
            const transformer = transform(schema)
            return (
                <Field key={previousKey + schema.title} name={previousKey}>
                    {({ input, meta }) => {
                        const { onChange } = input
                        input.value = input.value || min
                        delete input.type // bug with atlaskit
                        input.onChange = (e) => {
                            const value = getEventValue(e)
                            return onChange(transformer(value))
                        }
                        return (
                            <>
                                {/* {console.log(input)} */}
                                {desc && <Label>{desc}</Label>}
                                {min !== null &&
                                max !== null &&
                                max - min < 1000 ? (
                                    <Range
                                        min={min}
                                        max={max}
                                        step={step}
                                        {...input}
                                    />
                                ) : (
                                    <InputNumber
                                        type='number'
                                        {...input}
                                        placeholder={prettyKey}
                                    />
                                )}
                                <Field
                                    name={previousKey}
                                    component={errorMessage}
                                />
                            </>
                        )
                    }}
                </Field>
            )
        case 'boolean': {
            return (
                <Field
                    type='checkbox'
                    key={previousKey + schema.title}
                    name={previousKey}
                >
                    {({ input, meta }) => (
                        <>
                            {desc && <Label>{desc}</Label>}
                            <Checkbox {...input} label={prettyKey} />
                            <Field
                                name={previousKey}
                                component={errorMessage}
                            />
                        </>
                    )}
                </Field>
            )
        }
        default:
            throw Error('not implemented')
    }
}

const transform = (schema) => (v) => {
    const { type = 'string' } = schema
    switch (type) {
        case 'string':
            return String(v).toString()
        case 'number':
            return Number(v)
        default:
            return String(v).toString()
    }
}

const getEventValue = (e) => {
    let value
    try {
        value = e.target.value
    } catch (err) {
        // console.log('catched', err)
        value = e
    }
    return value
}

const humanize = (value: string) => {
    value = value.replace(/_/g, ' ')
    value = value.charAt(0).toUpperCase() + value.slice(1)
    value = value.replace(/([A-Z])/g, ' $1')
    value = value.replace(/^./, (str) => str.toUpperCase())
    return value
}

// const Row = styled.div`
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
// `


export default mapSchemaToComponents
