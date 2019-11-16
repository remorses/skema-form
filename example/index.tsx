import React from 'react'
import { SchemaForm } from '../src'
import { render } from 'react-dom'
import antdComponents from '../components/antd'

const App = () => {
    const onSubmit = (data) => {
        alert(data)
    }
    return (
        <SchemaForm
            components={antdComponents}
            onSubmit={onSubmit}
            schema={require('./schema.json')}
        />
    )
}

render(<App />, document.getElementById('root'))
// @ts-ignore
module.hot.accept()
