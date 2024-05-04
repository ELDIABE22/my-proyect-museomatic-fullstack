import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const idBuffer = Buffer.from(params.id, 'hex');

        const [getCollection] = await connection.query('SELECT c.* FROM Museo m INNER JOIN Coleccion c ON m.id = c.museo_id WHERE m.id = ?', [idBuffer]);

        const [getEvents] = await connection.query('SELECT e.* FROM Museo m INNER JOIN Evento e ON m.id = e.museo_id WHERE m.id = ?', [idBuffer]);

        return NextResponse.json({
            dataCollection: getCollection,
            dataEvents: getEvents,
        });
    } catch (error) {
        return NextResponse.json({ message: `Error al consultar las colecciones y los eventos del museo con ID: ${params.id}` + error.message })
    }
}