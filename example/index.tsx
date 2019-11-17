import React from 'react'
import { SchemaForm } from '../src'
import { render } from 'react-dom'
// import antdComponents from '../components/antd'
import {
    TextField,
    Select,
    Switch,
    NumberInput,
    TagsField
} from '../components/blueprint'
import './reset.css'
import { Box } from 'hybrid-components'
import { Form } from 'react-final-form'

const App = () => {
    const onSubmit = (data) => {
        alert(data)
    }
    return (
        <Box>
            <SchemaForm
                components={null as any}
                onSubmit={onSubmit}
                schema={require('./schema.json')}
                skipValidation={true}
            />
            <Box></Box>
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
