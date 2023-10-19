'use client'

// next
import { useRouter } from 'next/navigation'

// packages
import Select, { StylesConfig, ActionMeta } from 'react-select'
import { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/rest/v10'


export default function GuildSelect({ guild, guilds, disabled = false }: { guild?: RESTAPIPartialCurrentUserGuild, guilds: RESTAPIPartialCurrentUserGuild[], disabled?: boolean }) {

    let router = useRouter()

    let options = guilds.map(guild => { return { value: guild.id, label: `${guild.name.length > 20 ? guild.name.substring(0, 18) + '...' : guild.name}`, icon: guild.icon } })

    let icon = (image = '/discord.png') => ({
        alignItems: 'center',
        display: 'flex',
        ':before': {
            background: `url(${image}) center center/cover no-repeat`,
            borderRadius: 20,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 20,
            width: 20,
        },
    })

    let colorStyles: StylesConfig = {
        control: (styles) => ({
            ...styles,
            backgroundColor: 'rgb(38 38 38)',
            borderWidth: '1px',
            borderColor: 'rgb(82 82 82)',
            padding: '0.5rem',
            '::placeholder': { color: 'white' }
        }),
        menuList: (styles) => ({
            ...styles,
            backgroundColor: 'rgb(38 38 38)',
            maxHeight: '12rem',
            borderWidth: '1px',
            borderColor: 'rgb(82 82 82)',
            marginTop: '6px',
            boxShadow: '0px 0px 10px black'
        }),
        option: (styles, { data }) => ({
            ...styles, // @ts-ignore
            ...icon(data.icon ? `https://cdn.discordapp.com/icons/${data.value}/${data.icon}` : undefined),
            padding: '0.5rem',
            ':hover': { backgroundColor: 'rgb(64 64 64)' }
        }),
        singleValue: (styles, { data }) => ({
            ...styles, // @ts-ignore
            ...icon(data.icon ? `https://cdn.discordapp.com/icons/${data.value}/${data.icon}` : undefined),
        }),
        placeholder: (styles) => ({
            ...styles, // @ts-ignore
            ...icon(guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : undefined),
        })
    }

    function handleChange(newValue: unknown, actionMeta: ActionMeta<unknown>) { 
        console.log(newValue) // @ts-ignore
        router.push(`/modules?guild=${newValue.value}`)
    }

    return <Select 
        className={`text-sm sm:text-base font-semibold ${disabled ? 'brightness-75 pointer-events-none' : ''}`}
        styles={colorStyles}
        placeholder={guild ? `${guild.name.length > 20 ? guild.name.substring(0, 18) + '...' : guild.name}` : 'Select a Server...'}
        defaultValue={guild?.id || '0'}
        unstyled
        options={options}
        onChange={handleChange}
        isDisabled={disabled}
    ></Select>

}