import { connection } from "@/utils/museodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(res, { params }) {
    try {
        const { user } = await getServerSession(authOptions);

        const idUserBinary = Buffer.from(user.id.data, 'hex');

        // CONSULTA CRUCE DE TABLA
        const [result] = await connection.query(`
            SELECT 
                Ticket.numero_tickets, 
                Ticket.cantidad_tickets, 
                Ticket.total, 
                Ticket.fecha_compra, 
                Usuario.nombre AS nombre_usuario, 
                Evento.nombre AS nombre_evento
            FROM 
                Ticket
            JOIN 
                Usuario ON Ticket.user_id = Usuario.id
            JOIN 
                Evento ON Ticket.evento_id = Evento.id
            WHERE 
                Ticket.numero_tickets = UUID_TO_BIN(?)
                AND Usuario.id = ?
        `, [params.id, idUserBinary]);

        if (result === null || result.length === 0) {
            return NextResponse.json({ message: 'Petición denegada' });
        }

        return NextResponse.json({ message: 'Petición autorizada', infoTicket: result[0] });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: `Error al consultar el ticket con ID: ${params.id}`, error: error.message });
    }
}