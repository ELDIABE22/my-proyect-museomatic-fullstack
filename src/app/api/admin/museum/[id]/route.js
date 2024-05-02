import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const idString = params.id;

        // Convierte la cadena de texto del ID a un Buffer
        const idBuffer = Buffer.from(idString, 'hex');

        const [museum] = await connection.query('SELECT * FROM Museo WHERE id = ?', [idBuffer]);

        return NextResponse.json(museum[0]);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}