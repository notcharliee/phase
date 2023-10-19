import { NextResponse, NextRequest } from 'next/server'

export function GET (request: NextRequest) {
    if(process.env.NODE_ENV == 'development') {
        return NextResponse.redirect('https://discord.com/oauth2/authorize?client_id=1078305837245796483&response_type=code&scope=guilds%20identify%20bot%20applications.commands&redirect_uri=http://localhost:3000/api/login&permissions=486911216')
    } else {
        return NextResponse.redirect('https://discord.com/oauth2/authorize?client_id=1078305837245796483&response_type=code&scope=guilds%20identify%20bot%20applications.commands&redirect_uri=https://phasebot.xyz/api/login&permissions=486911216')
    }
}