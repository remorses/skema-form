import * as React from 'react'
import clonedeep from 'lodash.clonedeep'
import { Form, Field, FormRenderProps, useField } from 'react-final-form'
import styled from 'styled-components'
import { FieldArray } from 'react-final-form-arrays'
import { Components } from './types'
import { Row, Hidden } from 'hybrid-components'
import {
    Select,
    RootContainer,
    PropertyContainer,
    ObjectContainer,
    TextField,
    NumberInput,
    Switch
} from '../components/blueprint'

const mapSchemaToComponents = ({
    schema,
    components,
    previousKey = 'root',
    skipValidation,
    formProps = {} as FormRenderProps
}) => {
    // console.log('"' + schema.title + '"')
    const prettyKey = humanize(
        previousKey
            .split('.')
            .pop()
            .replace(/\[\d\]/, '')
    )
    const title = humanize(schema.title || '')
    const desc = humanize(schema.description || title || prettyKey || '')
    const label = desc
    const placeholder = title || prettyKey

    if (schema.enum) {
        const transformer = transform(schema)
        const items = schema.enum.map(transformer)
        const options = items.map((value) => ({
            value,
            label: humanize(value)
        }))
        return (
            <Select
                key={previousKey + schema.title}
                name={previousKey}
                label={label}
                options={options}
            />
        )
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
                            {mapSchemaToComponents({
                                schema: subset,
                                components,
                                skipValidation,
                                previousKey: `${previousKey}.${name}`,
                                formProps
                            })}
                        </PropertyContainer>
                    ))}
                </Container>
            )
        case 'array':
            const { items: subset = {} } = schema
            if (subset.enum) {
                const items = subset.enum
                throw Error('not implemented')
            } else if (subset.type === 'string' || subset.type === 'number') {
                throw Error('not implemented')
            }

        case 'string':
            return <TextField placeholder={placeholder} name={previousKey} label={label} />
        case 'number':
            const {
                minimum: min = null,
                exclusiveMaximum: max = null,
                multipleOf: step = 0.1
            } = schema
            const transformer = transform(schema)
            return <NumberInput name={previousKey} label={label} />
        case 'boolean': {
            return <Switch name={previousKey} label={label} />
        }
        default:
            throw Error(
                JSON.stringify(schema, null, '    ') + ' not implemented '
            )
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
