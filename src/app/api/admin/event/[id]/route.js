import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const idString = params.id;

        // Convierte la cadena de texto del ID a un Buffer
        const idBuffer = Buffer.from(idString, 'hex');

        // CONSULTA SENCILLA
        const [detailsResult] = await connection.query(`
            SELECT * FROM Evento WHERE id = ?
        `, [idBuffer]);

        const [totalsResult] = await connection.query(`
            SELECT SUM(total) AS suma_ventas_entradas
            FROM Ticket
            WHERE evento_id = ?
        `, [idBuffer]);

        const [usersResult] = await connection.query(`
            SELECT u.nombre AS nombre_usuario, 
                t.numero_tickets, 
                t.cantidad_tickets, 
                t.total,
                t.fecha_compra
            FROM Evento e
            INNER JOIN Ticket t ON e.id = t.evento_id
            INNER JOIN Usuario u ON t.user_id = u.id
            WHERE e.id = ?
        `, [idBuffer]);

        return NextResponse.json({ infoEvent: detailsResult[0], total_ventas: totalsResult[0], userTickets: usersResult });
    } catch (error) {
        return NextResponse.json({ message: `Error al obtener el evento con el id ${params.id}`, error: error.message });
    }
}