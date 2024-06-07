import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { user_id, museo_id, comentario } = await req.json();

        const idUserBinary = Buffer.from(user_id, 'hex');

        const idMuseumBinary = Buffer.from(museo_id, 'hex');

        await connection.query(`
            INSERT INTO Foro (
                user_id, museo_id, comentario
            ) VALUES (?,?,?)
        `, [idUserBinary, idMuseumBinary, comentario]);

        return NextResponse.json({ message: 'Comentario enviado' });
    } catch (error) {
        return NextResponse.json({ message: `Error al agregar el comentario` + error.message });
    }
}