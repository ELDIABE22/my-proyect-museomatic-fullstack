import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const [tickets] = await connection.query(`
            SELECT
                m.nombre AS Museo,
                SUM(t.cantidad_tickets) AS total_cantidad_tickets,
                SUM(t.total) AS total_ventas
            FROM Museo m
            INNER JOIN Evento e ON m.id = e.museo_id
            INNER JOIN Ticket t ON e.id = t.evento_id          
            WHERE e.museo_id = UUID_TO_BIN(?);
        `, [params.id]);

        return NextResponse.json(tickets[0]);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener las ventas' + error.message });
    }
}
