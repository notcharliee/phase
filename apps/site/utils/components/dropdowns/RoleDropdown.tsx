'use client'

// packages
import Select, { StylesConfig } from 'react-select'
import { RESTGetAPIGuildRolesResult } from 'discord-api-types/rest/v10'


export default function RoleDropdown({ roles, name, required, roleName, roleId }: { roles: RESTGetAPIGuildRolesResult, name: string, required: boolean, roleName?: string, roleId?: string }) {

    let options = roles.map(role => { return { value: role.id, label: role.name, color: `#${role.color.toString(16)}` } })

    let colorStyles: StylesConfig = {
        control: (styles) => ({
            ...styles,
            backgroundColor: 'rgb(38 38 38)',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            borderRadius: '6px',
        }),
        menuList: (styles) => ({
            ...styles,
            backgroundColor: 'rgb(38 38 38)',
            maxHeight: '12rem',
            borderRadius: '6px',
            marginTop: '6px',
            boxShadow: '0px 0px 10px black'
        }),
        option: (styles, { data }) => ({
            ...styles,
            padding: '0.5rem',
            transitionDuration: '300ms', // @ts-ignore
            color: data.color,
            ':hover': {
                backgroundColor: 'rgb(64 64 64)'
        }}),
        singleValue: (styles, { data }) => ({
            ...styles, // @ts-ignore
            color: data.color,
        }),
        placeholder: (styles) => ({
            ...styles, // @ts-ignore
            color: roles.find(role => role.id == roleId) ? `#${roles.find(role => role.id == roleId)!.color.toString(16)}` : 'white',
        })
    }

    return <Select 
        className='w-full bg-neutral-800 rounded-md font-semibold Role'
        styles={colorStyles}
        placeholder='Select a Role...'
        defaultValue={roleId && roleName ? { value: roleId, label: roleName, color: roles.find(role => role.id == roleId) ? `#${roles.find(role => role.id == roleId)!.color.toString(16)}` : 'white' } : undefined}
        unstyled={true}
        options={options}
        name={name}
        required={required}
    ></Select>

}


