import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Trae 3 museos aleatorios 
        const [museums] = await connection.query(`
            SELECT id, nombre, descripcion, imagenURL
            FROM Museo
            ORDER BY RAND()
            LIMIT 3
        `);

        return NextResponse.json(museums);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar los museos: ' + error.message });
    }
}
