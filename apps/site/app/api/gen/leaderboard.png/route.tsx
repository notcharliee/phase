// next
import { NextResponse, NextRequest } from 'next/server'
import { ImageResponse } from 'next/server'

// utils
import { RankUser } from '@/utils/discord'


let poppinsFont = fetch(process.env.url + '/fonts/poppins.ttf').then((res) => res.arrayBuffer())

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {

    let searchParams = request.nextUrl.searchParams
    let startIndex = searchParams.get('start')
    let endIndex = searchParams.get('end')
    let guildID = searchParams.get('guild')

    let poppinsFontData = await poppinsFont
    let leaderboardRes = await fetch(process.env.url+`/api/gen/leaderboard?start=${startIndex || 0}&end=${endIndex || 0}&guild=${guildID || 0}`, { cache: 'no-store' })

    let leaderboardData: RankUser[] | undefined
    if(leaderboardRes.ok) leaderboardData = await leaderboardRes.json() as RankUser[]
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
    
    if(!leaderboardData.length) return new ImageResponse(
        (
            <div tw='w-[850px] h-[210px] flex flex-col items-center justify-center bg-[#171717] text-white' style={{ fontFamily: 'Poppins' }}>
                <span tw='text-red-400 text-4xl font-bold'>Error 404</span>
                <span tw='text-2xl font-bold'>No Data For Indexes {startIndex}-{endIndex}</span>
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
    
    return new ImageResponse(
        (
            <div tw='w-[650px] flex flex-col p-6 pt-[13px] pb-[13px] bg-[#171717] text-white font-bold' style={{ fontFamily: 'Poppins', gap: '0.5rem' }}>
                {leaderboardData.map((user, index) => { return (
                    <div tw='w-full h-[65px] flex flex-col' style={{ gap: '0.5rem', marginTop:  index == 0 ? '0.5rem' : '0' }} key={index}>
                        <div tw='w-full h-[56px] flex justify-between'>
                            <div tw='flex items-center'>
                                <div tw='w-[35px] h-[35px] flex items-center justify-center mr-3 rounded-full text-lg bg-[#353535]'>{user.rank}</div>
                                <img src={user.avatar.link} alt='User Avatar' width={50} height={50} tw='mr-3 rounded-full bg-[#353535]'></img>
                                <span tw='text-xl'>{user.username}</span>
                            </div>
                            <div tw='flex items-center' style={{ gap: '0.5rem' }}>
                                <div tw='flex flex-col text-lg leading-none items-end'>
                                    <span><span tw='text-[#797979] mr-2'>Level</span>{user.level}</span>
                                    <span><span tw='text-[#797979] mr-2'>XP</span>{user.xp}/{user.target}</span>
                                </div>
                                <svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} viewBox='-1 -1 34 34'>
                                    <g transform='rotate(-90 16 16)'>
                                        <circle cx='16' cy='16' r='15.9155' stroke='#A400FF' stroke-width='2' fill='none'/>
                                        <circle cx='16' cy='16' r='15.9155' stroke='#353535' stroke-width='2' stroke-dasharray='100 100' stroke-dashoffset={-((user.xp / user.target) * 100)} fill='none'/>
                                    </g>
                                    <span tw='text-xl m-auto'>{user.level}</span>
                                </svg>
                            </div>
                        </div>
                        {index !== leaderboardData!.length-1
                            ? <span tw='w-full h-px bg-[#353535]'></span>
                            : <></>
                        }
                    </div>
                ) })}
            </div>
        ),
        {
            width: 650,
            height: (leaderboardData.length * 72) + (leaderboardData.length-1) + 26,
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

    // 24px padding (48px top and bottom)
    // 75px for userData.length
    // 9px for userData.length-1

    

    // return new ImageResponse(
    //     (
    //         <div tw='w-[850px] h-[210px] flex justify-between p-6 bg-[#171717] text-white' style={{ fontFamily: 'Poppins' }}>
    //             <img
    //                 src={userData.avatar.link}
    //                 alt='User Avatar'
    //                 tw='w-[162px] h-[162px] rounded-full border-8 border-[#353535]'
    //             />
    //             <div tw='w-[616px] flex flex-col justify-between'>
    //                 <div tw='w-full flex justify-between'>
    //                     <div tw='flex flex-col font-bold text-3xl items-start'>
    //                         <span><span tw='text-[#797979] mr-2'>#</span>{getOrdinal(userData.rank+1)}</span>
    //                         <span><span tw='text-[#797979] mr-2'>@</span>{userData.global_name}</span>
    //                     </div>
    //                     <div tw='flex flex-col font-bold text-3xl items-end'>
    //                         <span><span tw='text-[#797979] mr-2'>Level</span>{userData.level}</span>
    //                         <span><span tw='text-[#797979] mr-2'>XP</span>{userData.xp}/{userData.target}</span>
    //                     </div>
    //                 </div>
    //                 <div tw='w-full flex h-16 rounded-full bg-black relative'>
    //                     <div tw='w-full h-16 flex rounded-full border-8 border-[#353535] absolute overflow-hidden'>
    //                         <div tw='h-16 bg-[#797979]' style={{ width: `${(userData.xp / userData.target) * 100}%` }}></div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     ),
    //     {
    //         width: 850,
    //         height: 210,
    //         fonts: [
    //             {
    //                 name: 'Poppins',
    //                 weight: 700,
    //                 style: 'normal',
    //                 data: poppinsFontData
    //             }
    //         ]
    //     }
    // )

}