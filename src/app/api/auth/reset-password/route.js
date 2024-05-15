import bcrypt from "bcrypt";
import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { token, newPassword } = await req.json();

        const [userPassword] = await connection.query('SELECT * FROM PasswordResets WHERE token = ? AND expires_at > NOW()', [token]);

        if (userPassword.length === 0) {
            return NextResponse.json({ message: 'Token inválido o ha expirado' });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        const userId = userPassword[0].user_id;

        await connection.query("UPDATE Usuario SET contrasena = ? WHERE id = ?", [hashPassword, userId]);

        await connection.query("DELETE FROM PasswordResets WHERE token = ?", [token]);

        return NextResponse.json({ message: 'Tu contraseña ha sido restablecida' });
    } catch (error) {
        return NextResponse.json({ message: "Error al recuperar contraseña" + error.message });
    }
}