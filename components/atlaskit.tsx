import * as React from 'react'
import styled from 'styled-components'
// @ts-ignore
import Textfield from '@atlaskit/textfield'
// @ts-ignore
import Select from '@atlaskit/select'
// @ts-ignore
import Button from '@atlaskit/button'
// @ts-ignore
import { Checkbox } from '@atlaskit/checkbox'

import { Box, Row, Text, H2, Card } from 'hybrid-components'
// @ts-ignore
import Range_ from '@atlaskit/range'
// import Banner from '@atlaskit/banner'
// import Flag from '@atlaskit/flag'
// @ts-ignore
import InlineMessage from '@atlaskit/inline-message'
// @ts-ignore
import { RadioGroup, Radio } from '@atlaskit/radio'

import { Components } from '../src/types'
import { useForm } from 'react-final-form';

const PropertyContainer = styled.div`
    // border: 1px solid purple;
    padding: 5px 0;
    width: 100%;
`

// const Card = styled.div`
//     // border: 1px solid purple;
//     padding: 5px 0;
//     width: 100%;
// `

const Container = ({ children, title, description }) => {
    return (
        <div>
            <H2 >{title}</H2>
            <Text variants={[ 'text', 'label',]}>{description}</Text>
            <Box>{children}</Box>
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

const SingleSelect = (props) => {
    const { items = [] } = props
    return (
        <div>'not implementes'</div>
        // <Select style={{ width: '100%' }} {...props} options={items} isMulti={false}/>
    )
}

const makeItems = (a, b) => {
    return [
        ...a,
        {
            label: b,
            value: b
        }
    ]
}

const MultiSelect = (props) => {
    const { items = [], value = [] } = props
    const options = items.reduce(makeItems, [])
    const valueAsItems = value.reduce(makeItems, [])
    const onChange = (items) => {
        items = items || []
        return props.onChange( // TODO this gets null
            items.map((x) => x.value).filter((x) => x != undefined)
        )
    }
    return (
        <Select
            style={{ width: '100%' }}
            {...props}
            onChange={onChange}
            value={valueAsItems}
            options={options}
            isMulti={true}
        />
    )
}

const RadioOption = ({ children, checked, ...props }) => {
    const isChecked = checked
    return <Radio {...props as any} isChecked={isChecked} label={children} />
}

const Label = ({ children }) => <Text variants={[ 'text', 'label',]}>{children}</Text>

const ErrorMessage = ({ children }) => (
    <>
        {/* <div>{children}</div> */}
        {/* <Flag
            actions={[]}
            icon={''}// {<SuccessIcon primaryColor={colors.G300} label='Info' />}
            // description='We got fun an games. We got everything you want honey, we know the names.'
            appearance='error'
            id='1'
            key='1'
            title={children}
        /> */}
        <InlineMessage title={children} type='error' />
    </>
)

const Range = (props) => {
    return (
        <Row justifyContent='space-between' alignItems='center' width='auto'>
            <Box mr='8px' width='auto'>{props.value}</Box>
            <Range_ {...props} />
        </Row>
    )
}

export default {
    Checkbox,
    Button,
    Input: Textfield,
    InputNumber: Textfield, //({onChange, ...props}) => <InputNumber {...props} onChange={v => onChange({current: {value: v}})}/>,
    RadioOption,
    Range,
    SingleSelect,
    MultiSelect,
    RootContainer: Container,
    ObjectContainer: Container,
    Label,
    ErrorMessage,
    PropertyContainer
} as Components
