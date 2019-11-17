import React, { useState } from 'react'
import { SchemaForm, SchemaFormState } from '../src'
import { render } from 'react-dom'
// import antdComponents from '../components/antd'
import {
    TextField,
    Select,
    Switch,
    NumberInput,
    TagsField
} from '../src/components/blueprint'
import './reset.css'
import { Box } from 'hybrid-components'
import { Form } from 'react-final-form'
import { Card, Button } from '@blueprintjs/core'

const App = () => {
    const onSubmit = (data) => {
        alert(data)
    }
    const [state, set] = useState({ values: {} } as SchemaFormState)
    console.log(state)
    return (
        <Box p='20px'>
            <Card elevation={3}>
                <SchemaForm
                    onChange={set}
                    schema={require('./schema.json')}
                    skipValidation={false}
                />
            </Card>
            <Box>
                <pre>{JSON.stringify(state.values, null, 4)}</pre>
            </Box>
            <Button disabled={state.invalid} onClick={() => alert(state)}>
                Submit
            </Button>
        </Box>
    )
}

const opts = [{ value: 'a1' }, { value: 'a2' }, { value: 'a3' }]

const cosa = (
    <Form
        onSubmit={alert}
        render={({ values }) => {
            return (
                <>
                    <TextField label='caio' name='ciao' />
                    <Select label='caio' name='sdfciao' options={opts} />
                    <Switch label='caio' name='dfòkgjdklfg' />
                    <NumberInput label='caio' name='dsfdsfdsf99' />
                    {/* <TagsField /> */}
                    <pre>{JSON.stringify(values, null, 4)}</pre>
                </>
            )
        }}
    />
)

render(<App />, document.getElementById('root'))
// @ts-ignore
module.hot.accept()
