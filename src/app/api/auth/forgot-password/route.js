import { connection } from '@/utils/museodb';
import { randomBytes } from 'crypto';
import { transporter } from "@/utils/nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email } = await req.json();

        const [user] = await connection.query('SELECT * FROM Usuario WHERE email = ?', [email]);

        if (user.length === 0) {
            return NextResponse.json({ message: 'El correo no existe.' });
        }

        const token = randomBytes(20).toString('hex');

        const now = Date.now();

        const timezoneDifference = 5 * 60 * 60 * 1000;

        const adjustedTimestamp = now + timezoneDifference;

        const expirationTimestamp = adjustedTimestamp + 60 * 60 * 1000;

        const expirationDate = new Date(expirationTimestamp);

        await connection.query("INSERT INTO PasswordResets (user_id, token, expires_at) VALUES (?,?,?)",
            [user[0].id, token, expirationDate]);

        const resetPasswordLink = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_ADMIN, // Dirección de correo electrónico del remitente
            to: email, // Dirección de correo electrónico del destinatario
            subject: 'Restablecimiento de Contraseña en Museomatic',
            text: `
            Hola,

            Te escribimos desde Museomatic sobre una solicitud de restablecimiento de contraseña.

            Para completar el proceso de restablecimiento, haz clic en el siguiente enlace:

            ${resetPasswordLink}

            Si no solicitaste este restablecimiento, por favor ignora este mensaje.

            Atentamente,
            Equipo de Museomatic`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Correo enviado para restablecer contraseña" });

    } catch (error) {
        return NextResponse.json({ message: "Error al recuperar contraseña" + error.message });
    }
}