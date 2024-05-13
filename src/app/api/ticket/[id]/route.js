import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const [eventStatus] = await connection.query(`
            SELECT 
                CASE 
                    WHEN e.fecha > CURDATE() THEN 'pendiente'
                    WHEN e.fecha = CURDATE() AND e.hora_inicio <= TIME(NOW()) AND e.hora_fin > TIME(NOW()) THEN 'en curso'
                    ELSE 'finalizado'
                END AS estado_evento
            FROM Evento e
            WHERE e.estado != "Finalizado" AND e.id = UUID_TO_BIN(?)
        `, [params.id]);

        if (eventStatus[0].estado_evento !== "pendiente") {
            return NextResponse.json({ message: `Evento ${eventStatus[0].estado_evento}` });
        }

        const [ticketAvailable] = await connection.query(`
            SELECT E.capacidad AS CapacidadDelEvento,
            E.precio AS PrecioDelEvento, 
            SUM(T.cantidad_tickets) AS NumeroDeTicketsVendidos
            FROM Ticket T
            INNER JOIN 
            Evento E ON T.evento_id = E.id
            WHERE T.evento_id = UUID_TO_BIN(?)
            GROUP BY E.id
        `, [params.id]);

        if (eventStatus[0].estado_evento === "pendiente" && ticketAvailable.length > 0) {
            if (ticketAvailable[0].CapacidadDelEvento <= ticketAvailable[0].NumeroDeTicketsVendidos) {
                return NextResponse.json({ message: 'Agotado', ticket: ticketAvailable[0] });
            }
        }

        return NextResponse.json({ message: 'Disponible', ticket: ticketAvailable[0] });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: `Error al consultar el evento con ID: ${params.id}`, error: error.message });
    }
}