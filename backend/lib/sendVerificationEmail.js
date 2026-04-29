import { sendEmail } from "./sendEmail.js";


export const sendVerificationEmail = async (email, otp, type) => {
    const message = 'Your OTP for ' + (type === "registration" ? "registration" : "password reset") + ' is: ' + otp + '. It will expire in 15 minutes.';

    await sendEmail({
        to: email,
        subject: type === "registration" ? "Verify your Account" : "Password Reset Code",
        text: message,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hello user,</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Thanks,<br>${process.env.APP_NAME || ""}</p>
        </div>`
    })
}