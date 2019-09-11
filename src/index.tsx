import * as React from 'react'
import clonedeep from 'lodash.clonedeep'
import { Form, Field, FormRenderProps } from 'react-final-form'
// import * as jsonschema from 'jsonschema'

import Ajv from 'ajv'
import * as pointer from 'json-pointer'
import arrayMutators from 'final-form-arrays'
import { Components } from './types'
import mapSchemaToComponents from './mapSchemaToComponents'

const ajv = new Ajv({ jsonPointers: true, allErrors: true })


export const SchemaForm = ({
    onSubmit,
    schema,
    components = {} as Components,
    submitButton = null, // <button type='submit'>go</button>,
    onChange = ({value}) => null,
    value={} as any,
}) => {
    components = { ...components }
    const validateSchema = React.useMemo(() => ajv.compile(schema), [schema])
    const validate = (data) => {
        console.log('validating')
        // console.log(JSON.stringify(ajv.errors, null, '\t'))
        const valid = validateSchema(data.root || {})
        // console.log(JSON.stringify(ajv.errors, null, '\t'))
        if (!valid) {
            const error = validateSchema.errors.reduce(
                (acc, { dataPath, message, keyword, ...rest }) => {
                    let parts = pointer.parse(dataPath)

                    const params: any = rest.params
                    if (params && params.missingProperty) {
                        if (params.missingProperty) {
                            parts = [...parts, params.missingProperty]
                        }
                    }
                    parts = ['root', ...parts]
                    // console.log(parts)
                    acc = nestProperty(acc, parts, message)
                    // console.log('acc ', acc)
                    return {
                        ...acc
                    }
                },
                {}
            )
            // console.log('err', JSON.stringify(error, null, '\t'))
            return error
        } else {
            return { root: {} }
        }
    }

    // console.log(makeInitialValues(schema))
    return (
        <>
            <Form
                initialValues={value || { root: makeInitialValues(schema) }}
                // validateOnBlur={true}
                onSubmit={onSubmit}
                validate={validate}
                mutators={{
                    ...arrayMutators
                }}
                render={({
                    handleSubmit,
                    values,
                    ...rest
                }: FormRenderProps) => (
                    <>
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            {mapSchemaToComponents(schema, components, 'root', {
                                ...rest,
                                values,
                                handleSubmit
                            })}
                            {submitButton}
                        </form>
                        {onChange({ value: values, ...rest })}
                    </>
                )}
            />
        </>
    )
}

export default SchemaForm

const nestProperty = (acc, parts, property) => {
    acc = clonedeep(acc)
    let obj = acc
    for (let part of parts.slice(0, parts.length - 1)) {
        obj[part] = obj[part] || {}
        obj = obj[part]
    }
    obj[parts[parts.length - 1]] = property
    return acc
}

const defaultValue = ({ type, ...rest }: any) => {
    switch (type) {
        // case 'string':
        //     return ''
        // case 'number':
        //     return 1
        case 'array':
            return []
        case 'object':
            return makeInitialValues(rest)
        default:
            return undefined
    }
}

const makeInitialValues = (schema) => {
    const initialValues = Object.entries(schema.properties || {}).reduce(
        (acc, [k, v]) => {
            return {
                ...acc,
                [k]: defaultValue(v)
            }
        },
        {}
    )
    return initialValues
}