import { NextResponse } from 'next/server'
import { sendInactivityReminders, sendVerificationReminders } from '@/lib/actions/reminder-actions'

export async function GET(request: Request) {
    // secure with secret if needed, e.g. using Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'inactivity' or 'verification' or 'all'

    try {
        let result = {}

        if (type === 'inactivity') {
            result = await sendInactivityReminders()
        } else if (type === 'verification') {
            result = await sendVerificationReminders()
        } else {
            const [inactivity, verification] = await Promise.all([
                sendInactivityReminders(),
                sendVerificationReminders()
            ])
            result = { inactivity, verification }
        }

        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
