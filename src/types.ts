import React, { FC, ComponentType } from 'react'


export type Components = {
    Checkbox?: ComponentType<any>
    Button?: ComponentType<any>
    Input?: ComponentType<any>
    InputNumber?: ComponentType<any>
    RadioOption?: ComponentType<any>
    Range?: ComponentType<any>
    SingleSelect?: ComponentType<any>
    MultiSelect?: ComponentType<any>
    RootContainer?: ComponentType<any>
    ObjectContainer?: ComponentType<any>
    Label?: ComponentType<any>
    Title?: ComponentType<any>
    ErrorMessage?: React.ComponentType<any>
    PropertyContainer?: ComponentType<any>
}