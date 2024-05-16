import { connection } from "@/utils/museodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from "next-auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        const { evento_id, total, cantidad_tickets } = await req.json();

        const idUserBinary = Buffer.from(session.user.id.data, 'hex');

        const idEventBinary = Buffer.from(evento_id, 'hex');

        // CONSULTA ANIDADA
        const [eventStatus] = await connection.query(`
            SELECT 
                CASE 
                    WHEN e.fecha > CURDATE() THEN 'pendiente'
                    WHEN e.fecha = CURDATE() AND e.hora_inicio <= TIME(NOW()) AND e.hora_fin > TIME(NOW()) THEN 'en curso'
                    ELSE 'finalizado'
                END AS estado_evento
            FROM Evento e
            WHERE e.estado != "Finalizado" AND e.id = UUID_TO_BIN(?)
        `, [evento_id]);

        if (eventStatus[0].estado_evento !== "pendiente") {
            return NextResponse.json({ message: `Evento ${eventStatus[0].estado_evento}` });
        }

        // CONSULTA DE GRUPO
        const [ticketsAvailable] = await connection.query(`
            SELECT 
            E.capacidad, 
            SUM(T.cantidad_tickets) AS total_tickets_vendidos,
            IF(SUM(T.cantidad_tickets) >= E.capacidad, 0, E.capacidad - SUM(T.cantidad_tickets)) AS tickets_disponibles,
            IF(SUM(T.cantidad_tickets) >= E.capacidad, 'Agotado', 'Disponibles') AS estado_tickets
            FROM 
                Ticket T
            INNER JOIN 
                Evento E ON T.evento_id = E.id
            WHERE 
                T.evento_id = UUID_TO_BIN(?)
            GROUP BY
                E.id;
        `, [evento_id]);

        if (eventStatus[0].estado_evento === "pendiente" && ticketsAvailable.length > 0) {
            if (parseInt(ticketsAvailable[0].tickets_disponibles) <= 0 && ticketsAvailable[0].estado_tickets === "Agotado") return NextResponse.json({ message: 'Tickets agotados' });

            if (cantidad_tickets > parseInt(ticketsAvailable[0].tickets_disponibles)) {
                if (parseInt(ticketsAvailable[0].tickets_disponibles) === 1) return NextResponse.json({ message: `Solo queda ${ticketsAvailable[0].tickets_disponibles} ticket disponible` });
                else return NextResponse.json({ message: `Solo quedan ${ticketsAvailable[0].tickets_disponibles} tickets disponibles` });
            }
        }

        // Generar número de ticket
        const uuid = uuidv4();
        const ticketNumberBuffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');
        const ticketNumberString = ticketNumberBuffer.toString('hex');

        const values = [ticketNumberBuffer, idUserBinary, idEventBinary, total, cantidad_tickets];

        await connection.query('INSERT INTO Ticket (numero_tickets, user_id, evento_id, total, cantidad_tickets) VALUES (?,?,?,?,?)', values);

        return NextResponse.json({ message: 'Compra realizada', idTicket: ticketNumberString });
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ message: "Error al crear el metodo de pago: " + error.message });
    }
}