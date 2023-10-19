export type RankUser = {
    level: number
    xp: number
    target: number
    rank: number
    id: string
    global_name: string
    username: string
    badges: string[]
    avatar: {
        id: string
        link: string
    }
    banner: {
        id: string
        link: string
        color: string | null
    },
}