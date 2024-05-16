import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        // CONSULTA DE CRUCE DE TABLA
        const [getCollection] = await connection.query('SELECT c.* FROM Museo m INNER JOIN Coleccion c ON m.id = c.museo_id WHERE m.id = UUID_TO_BIN(?)', [params.id]);

        // CONSULTA DE CRUCE DE TABLA
        const [getEvents] = await connection.query(`
            SELECT e.*, 
            IF(SUM(t.cantidad_tickets) >= e.capacidad, 'Agotado', 'Disponible') AS estado_tickets,
            CASE 
                WHEN e.fecha > CURDATE() THEN 'Pendiente'
                WHEN e.fecha = CURDATE() AND e.hora_inicio <= TIME(NOW()) AND e.hora_fin > TIME(NOW()) THEN 'En curso'
                ELSE 'Finalizado'
            END AS estado_evento
            FROM Museo m
            INNER JOIN Evento e ON m.id = e.museo_id
            LEFT JOIN Ticket t ON e.id = t.evento_id
            WHERE m.id = UUID_TO_BIN(?) AND e.estado!= "Finalizado"
            GROUP BY e.id
            ORDER BY e.fecha DESC;
        `, [params.id]);

        return NextResponse.json({
            dataCollection: getCollection,
            dataEvents: getEvents,
        });
    } catch (error) {
        return NextResponse.json({ message: `Error al consultar las colecciones y los eventos del museo con ID: ${params.id}` + error.message })
    }
}