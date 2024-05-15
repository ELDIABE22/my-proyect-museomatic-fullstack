import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const [token] = await connection.query('SELECT * FROM PasswordResets WHERE token = ? AND expires_at > NOW()', [params.id]);

        if (token.length === 0) {
            return NextResponse.json({ message: 'El token no es válido o ha expirado' });
        }

        return NextResponse.json({ message: 'Token válido' });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: `Error al consultar el token con ID: ${params.id}`, error: error.message });
    }
}