// next
import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// utils
import { API } from '@/utils/discord'
import * as db from '@/utils/database'


export async function GET(request: NextRequest) {

    let url = new URL(request.url)
    let discordApi = new API()

    try {

        cookies().delete('session')

        let user = await discordApi.getUser(url.searchParams.get('code') || '', 'authorization_code', { identity: true, guilds: true })

        cookies().set({
            name: 'session',
            value: user.session_id!,
            maxAge: 3 * 60 * 60,
            secure: true,
            sameSite: true,
            path: '/'
        })

        return NextResponse.redirect(process.env.url + '')

    } catch(err) {
        return NextResponse.json({ err: err }, { status: 500 }),console.log(err)
    }

}

export async function DELETE(request: NextRequest) {

    let session_id = request.headers.get('session')

    let schema = await db.logins.findOne({ session_id })
    if(!schema) return NextResponse.json({ err: 'Error! Please login to use this endpoint.' }, { status: 401 })

    cookies().delete('session')
    await schema.deleteOne()

    return NextResponse.json({ message: 'User login has been successfully deleted.' }, { status: 200 })

}