// next
import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/server'

// utils
import { RankUser } from '@/utils/discord'


let poppinsFont = fetch(process.env.BASE_URL + '/fonts/poppins.ttf').then((res) => res.arrayBuffer())

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {

    let searchParams = request.nextUrl.searchParams
    let userID = searchParams.get('user')
    let guildID = searchParams.get('guild')

    let poppinsFontData = await poppinsFont
    let userRes = await fetch(process.env.BASE_URL+`/api/gen/rank?user=${userID || 0}&guild=${guildID || 0}`, { cache: 'no-store' })

    let userData: RankUser | undefined
    if(userRes.ok) userData = await userRes.json() as RankUser
    else return new ImageResponse(
        (
            <div tw='w-[850px] h-[210px] flex flex-col items-center justify-center bg-[#171717] text-white' style={{ fontFamily: 'Poppins' }}>
                <span tw='text-red-400 text-4xl font-bold'>Error 400</span>
                <span tw='text-2xl font-bold'>Client Sent Malformed Request</span>
            </div>
        ),
        {
            width: 850,
            height: 210,
            fonts: [
                {
                    name: 'Poppins',
                    weight: 700,
                    style: 'normal',
                    data: poppinsFontData
                }
            ],
            status: 400,
        }
    )


    function getOrdinal(number: number): string {
        if(number >= 11 && number <= 13) return number + 'th'
        return number + (['th', 'st', 'nd', 'rd'][number % 10] || ['th', 'st', 'nd', 'rd'][0])
    }
    

    return new ImageResponse(
        (
            <div tw='w-[850px] h-[210px] flex justify-between p-6 bg-[#171717] text-white' style={{ fontFamily: 'Poppins' }}>
                <img
                    src={userData.avatar.link}
                    alt='User Avatar'
                    tw='w-[162px] h-[162px] rounded-full border-8 border-[#353535]'
                />
                <div tw='w-[616px] flex flex-col justify-between'>
                    <div tw='w-full flex justify-between'>
                        <div tw='flex flex-col font-bold text-3xl items-start'>
                            <span><span tw='text-[#797979] mr-2'>#</span>{getOrdinal(userData.rank)}</span>
                            <span><span tw='text-[#797979] mr-2'>@</span>{userData.username}</span>
                        </div>
                        <div tw='flex flex-col font-bold text-3xl items-end'>
                            <span><span tw='text-[#797979] mr-2'>Level</span>{userData.level}</span>
                            <span><span tw='text-[#797979] mr-2'>XP</span>{userData.xp}/{userData.target}</span>
                        </div>
                    </div>
                    <div tw='w-full flex h-16 rounded-full bg-black relative'>
                        <div tw='w-full h-16 flex rounded-full border-8 border-[#353535] absolute overflow-hidden'>
                            <div tw='h-16 bg-[#797979]' style={{ width: `${(userData.xp / userData.target) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 850,
            height: 210,
            fonts: [
                {
                    name: 'Poppins',
                    weight: 700,
                    style: 'normal',
                    data: poppinsFontData
                }
            ],
        }
    )

}