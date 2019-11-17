import React, { useState, useEffect } from 'react'
import * as bp from '@blueprintjs/core'
import { useField } from 'react-final-form'
import { Box, Row, Text } from 'hybrid-components'
import { BoxProps } from 'hybrid-components/src/types'
import { ISliderProps } from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
// import { FilePond, File, registerPlugin, FilePondProps } from 'react-filepond'

// // Import FilePond styles
// import 'filepond/dist/filepond.min.css'

interface BaseProps {
    name: string
    label?: string
}

const styles: { [key: string]: React.CSSProperties } = {
    table: {
        width: '100%',
        minHeight: '130px'
    },
    addButton: {
        minWidth: '60px'
    }
}

const ErrorMessage = ({ meta }) => {
    return (
        <Text color='red' fontSize='13px'>
            {meta.error || ' '}
        </Text>
    )
}

export const TextField = ({
    name,
    label = '',
    ...rest
}: BaseProps & bp.IInputGroupProps) => {
    const { input, meta } = useField(name)
    return (
        <bp.FormGroup label={label} helperText={<ErrorMessage meta={meta}/>}>
            <bp.InputGroup {...input} {...rest} />
        </bp.FormGroup>
    )
}

export const Select = ({
    name,
    label = '',
    options=[],
    ...rest
}: BaseProps & bp.IInputGroupProps & any) => {
    const { input, meta } = useField(name)
    return (
        <bp.FormGroup label={label} helperText={<ErrorMessage meta={meta}/>}>
            <bp.HTMLSelect fill={true} options={options} {...input} {...rest} />
        </bp.FormGroup>
    )
}


export const TagsField = ({
    name,
    label = '',
    ...rest
}: BaseProps & Omit<bp.ITagInputProps, 'values'>) => {
    const { input, meta } = useField(name)
    useEffect(() => input.onChange([]), [])
    return (
        <bp.FormGroup
            label={label}
            helperText={
                <Text color='red' fontSize='13px'>
                    {meta.error || ' '}
                </Text>
            }
        >
            <bp.TagInput
                large
                fill
                values={input.value || []}
                onChange={input.onChange}
                {...rest}
            />
        </bp.FormGroup>
    )
}

export const SliderField = ({
    name,
    label = '',
    ...rest
}: BaseProps & ISliderProps) => {
    const { input, meta } = useField(name)
    useEffect(() => input.onChange(rest.min || 0), [])
    return (
        <bp.FormGroup
            label={label}
            helperText={
                <Text color='red' fontSize='13px'>
                    {meta.error || ' '}
                </Text>
            }
        >
            <bp.Slider
                {...input}
                value={input.value || rest.min || 0}
                {...rest}
            />
        </bp.FormGroup>
    )
}

export const AddableListField = ({
    name,
    title = 'Things',
    icon = 'th-list',
    ...rest
}) => {
    const { input, meta } = useField(name)
    const [things, setThings] = useState<string[]>([])
    const [newThing, setNewThing] = useState('')
    useEffect(() => input.onChange([]), [])
    const addThing = () => {
        if (!things.filter((x) => x === newThing).length) {
            setThings((arr) => {
                arr = [...arr, newThing]
                input.onChange(arr)
                return arr
            })
            setNewThing('')
        }
    }
    const removeThing = (text) => {
        setThings((arr) => {
            arr = arr.filter((x) => x !== text)
            input.onChange(arr)
            return arr
        })
    }

    return (
        <Box {...rest}>
            <bp.Card>
                <bp.H4>{title}</bp.H4>
                <Box style={styles.table}>
                    {!things.length && (
                        <Box>
                            <bp.NonIdealState
                                description='no elements'
                                // icon='unresolve'
                                icon='th-list'
                            />
                        </Box>
                    )}
                    {Boolean(things.length) &&
                        things.map((text) => {
                            return (
                                <div key={text}>
                                    <Row alignItems='center'>
                                        <bp.Button
                                            minimal
                                            small
                                            onClick={() => removeThing(text)}
                                        >
                                            x
                                        </bp.Button>
                                        {text}
                                    </Row>
                                    <bp.Divider />
                                </div>
                            )
                        })}
                    <Box my='10px' />
                </Box>
                <bp.InputGroup
                    placeholder='Add new element'
                    onChange={(e) => {
                        setNewThing(e.target.value)
                    }}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            addThing()
                        }
                    }}
                    value={newThing}
                    rightElement={
                        <bp.Button
                            intent='primary'
                            style={styles.addButton}
                            onClick={addThing}
                        >
                            {/* <bp.Icon icon='add'/> */}
                            Add
                        </bp.Button>
                    }
                />
            </bp.Card>
        </Box>
    )
}
