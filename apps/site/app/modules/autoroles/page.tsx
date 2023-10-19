// next
import { cookies } from 'next/headers'
import { redirect, useRouter } from 'next/navigation'

// utils
import { API } from '@/utils/discord'
import * as db from '@/utils/database'
import isAuthorised from '@/utils/authorised'

// components
import { ElementList, RoleDropdown } from '@/utils/components'
import UpdateModuleData from '../_components/UpdateModuleData'

// packages
import { Routes, RESTGetAPIGuildRolesResult, RESTGetAPIGuildMemberResult } from 'discord-api-types/rest/v10'


export const metadata = { title: 'Auto Roles' }
export const dynamic = 'force-dynamic'

export default async function page({ searchParams }: { searchParams: { guild: string } }) {

    // check if user is authorised
    let authorised = await isAuthorised(cookies().get('session')?.value, searchParams.guild)
    if(!authorised) return redirect(process.env.url + '/redirect/login')

    // initialise the api
    let discordApi = new API()

    // fetch and filter roles
    let roles = await discordApi.fetch<RESTGetAPIGuildRolesResult>(Routes.guildRoles(searchParams.guild))

    let botMember = await discordApi.fetch<RESTGetAPIGuildMemberResult>(Routes.guildMember(searchParams.guild, process.env.clientID))
    let botRoles = roles.filter(role => botMember.roles.includes(role.id)).sort((a, b) => { return b.position - a.position })

    let filteredRoles = roles.filter((role) => { return role.name != '@everyone' && !role.managed && botRoles[0].position > role.position }).sort((a, b) => { return b.position - a.position })


    // action forms

    async function saveData(formData: FormData) {
        'use server'

        let roles = formData.getAll('role') as string[]
        let autorolesDB = await db.autoroles.findOne({ guild: searchParams.guild })

        if(autorolesDB) {
            autorolesDB.roles = roles
            autorolesDB.save()
        } else {
            new db.autoroles({
                guild: searchParams.guild,
                roles: roles
            }).save()
        }
    }

    async function deleteData(formData: FormData) {
        'use server'

        let autorolesDB = await db.autoroles.findOne({ guild: searchParams.guild })
        if(autorolesDB) autorolesDB.deleteOne().then(() => {
            redirect(`/modules/autoroles?guild=${searchParams.guild}&refresh=true`)
        })
    }


    let autorolesDB = await db.autoroles.findOne({ guild: searchParams.guild })

    return (
        <form className='flex flex-col gap-8 items-start justify-start self-center min-h-[calc(100vh-12rem)] max-w-4xl w-full' action={saveData}>
            <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>
                Modules/<span className='gradient-text'>{metadata.title}</span>
            </h2>

            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Select a Role</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Set which roles will be assigned when a user joins your server.</p>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>If your server has Rules Screening enabled, these roles will be applied once the user is verified.</p>
                <ElementList
                    element={<RoleDropdown roles={filteredRoles} name='role' required={false}></RoleDropdown>}
                    defaultValues={autorolesDB?.roles.map((role) => { return <RoleDropdown roles={filteredRoles} name='role' required={false} roleId={role} roleName={roles.find((apirole) => apirole.id == role)?.name}></RoleDropdown>})}
                    name='Role'
                    maxCount={3}
                ></ElementList>
            </div>

            <UpdateModuleData deleteData={deleteData}></UpdateModuleData>
        </form>
    )
}
