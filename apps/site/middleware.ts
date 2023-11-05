import { NextResponse, NextRequest } from 'next/server'

import { redisClient } from 'utils/redis'
 

export async function middleware(request: NextRequest) {

  const authCookie = request.cookies.get('auth_session')
  const authId = request.cookies.get('auth_id')

  const redis = redisClient(process.env.UPSTASH_URL!, process.env.UPSTASH_TOKEN!)

  if (!authCookie || !authId) return NextResponse.redirect(new URL('/api/auth', request.url))

  const validAuth = !!(await redis.get(`auth:${authCookie.value}`))

  if (!validAuth) return NextResponse.redirect(new URL('/api/auth', request.url))

  return NextResponse.next()
  
}


export const config = {
  matcher: '/dashboard/:path*',
}