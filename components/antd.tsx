import * as React from 'react';
import styled from 'styled-components'
import 'antd/dist/antd.css' // TODO remove

import {
    Input, 
    InputNumber, 
    Slider as Range,  
    Checkbox, 
    Select,
    Radio, 
    Layout,
    Alert,
    Button,
    Card, 
    // @ts-ignore
} from 'antd'
import {Components} from '../src/types'



const PropertyContainer = styled.div`
// border: 1px solid purple;
padding: 5px 0;
width: 100%;
`

const Container = ({ children, title, description }) => {
    return (
        <div>
            <h1>{title}</h1>
            {description}
            <Card >
            {children}
            </Card>
        </div>
    )
}

// const Radio_ = ({ items, onChange, value }) => {
//     const radioStyle = {
//         display: 'block',
//         height: '30px',
//         lineHeight: '30px',
//       };
//     return (
//         <Radio.Group onChange={onChange} value={value}>
//             {items.map((value) => (
//                 <Radio key={'radio' + value} value={value} style={radioStyle}>{value}</Radio>
//             ))}
//         </Radio.Group>
//     );
// }

const MultiSelect = props => {
    const {items=[]} = props
    return (
        <Select  mode="tags" style={{ width: '100%' }} {...props}>
            {items.map(value => <Select.Option value={value} key={'select'+value}>{value}</Select.Option>)}
        </Select>
    )
}

const SingleSelect = props => {
    const {items=[]} = props
    return (
        <Select mode="default" style={{ width: '100%' }} {...props}>
            {items.map(value => <Select.Option value={value} key={'selsct' + value}>{value}</Select.Option>)}
        </Select>
    )
}

const RadioOption = ({children, ...props}) => {
    return (
        <Radio style={{display: 'block', margin: '5px 0'}}{...props}>{children}</Radio>
    )
}

const Label = ({children}) => (<div>{children}</div>)

const ErrorMessage = ({children}) => (
    <Alert style={{margin: '20px 0', padding: '2px 6px'}} message={children} type="error"/>
)

export default {
    Checkbox,
    Button,
    Input,
    InputNumber, //({onChange, ...props}) => <InputNumber {...props} onChange={v => onChange({current: {value: v}})}/>,
    RadioOption,
    Range,
    SingleSelect,
    MultiSelect,
    RootContainer: Container,
    ObjectContainer: Container,
    Label,
    ErrorMessage,
    PropertyContainer,
} as Components