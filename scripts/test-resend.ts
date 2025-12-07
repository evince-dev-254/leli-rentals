
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testSend() {
    console.log('Testing Resend with key:', process.env.RESEND_API_KEY?.slice(0, 5) + '...');

    const email = '1junemukami@gmail.com'; // From the manual verification file

    try {
        const data = await resend.emails.send({
            from: 'Leli Rentals <onboarding@updates.leli.rentals>',
            to: email,
            subject: 'Test Email from CLI',
            html: '<p>If you see this, Resend is working!</p>'
        });

        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testSend();
