'use client'

// packages
import Select, { StylesConfig } from 'react-select'
import { APIGuildChannelResolvable } from 'discord-api-types/rest/v10'


export default function ChannelDropdown({ channels, name, required, channelName, channelId }: { channels: APIGuildChannelResolvable[], name: string, required: boolean, channelName?: string, channelId?: string }) {

    let options = channels.map(channel => { return { value: channel.id, label: `${channel.name}` } })

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
        option: (styles) => ({
            ...styles,
            padding: '0.5rem',
            transitionDuration: '300ms',
            ':hover': {
                backgroundColor: 'rgb(64 64 64)'
            }
        }),
    }

    return <Select 
        className='bg-neutral-800 rounded-md font-semibold'
        styles={colorStyles}
        placeholder='Select a Channel...'
        defaultValue={channelId && channelName ? { value: channelId, label: channelName } : undefined}
        unstyled={true}
        options={options}
        name={name}
        required={required}
    ></Select>

}