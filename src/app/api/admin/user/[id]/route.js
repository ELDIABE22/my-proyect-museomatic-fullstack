import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const [user] = await connection.query('SELECT * FROM Usuario WHERE id = UUID_TO_BIN(?)', [params.id]);

        return NextResponse.json(user[0]);
    } catch (error) {
        return NextResponse.json({ message: `Error al consultar el usuario con el id: ${params.id}`, error: error.message });
    }
}