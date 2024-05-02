import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const idString = params.id;

        // Convierte la cadena de texto del ID a un Buffer
        const idBuffer = Buffer.from(idString, 'hex');

        const [collection] = await connection.query('SELECT * FROM Coleccion WHERE id = ?', [idBuffer]);

        return NextResponse.json(collection[0]);
    } catch (error) {
        return NextResponse.json({ message: `Error al obtener la colección con el id ${params.id}`, error: error.message });
    }
}