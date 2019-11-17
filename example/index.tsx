import React from 'react'
import { SchemaForm } from '../src'
import { render } from 'react-dom'
// import antdComponents from '../components/antd'
import { TextField, Select, Switch, NumberInput } from '../components/blueprint'
import './reset.css'
import { Box } from 'hybrid-components'
import { Form } from 'react-final-form'

const App = () => {
    const onSubmit = (data) => {
        alert(data)
    }
    return (
        // <SchemaForm
        //     components={bpComponents}
        //     onSubmit={onSubmit}
        //     schema={require('./schema.json')}
        //     skipValidation={true}
        // />
        <Box>
            <Form
                onSubmit={alert}
                render={({values}) => {
                    return (
                        <>
                            <TextField label='caio' name='ciao' />
                            <Select label='caio' name='sdfciao' options={opts} />
                            <Switch label='caio' name='dfòkgjdklfg'  />
                            <NumberInput label='caio' name='dsfdsfdsf99'  />
                            <pre>{JSON.stringify(values, null, 4)}</pre>
                        </>
                    )
                }}
            />
        </Box>
    )
}

const opts = [
    {value: 'a1'},
    {value: 'a2'},
    {value: 'a3'},
]

render(<App />, document.getElementById('root'))
// @ts-ignore
module.hot.accept()
