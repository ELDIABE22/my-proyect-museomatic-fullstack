import { connection } from "@/utils/museodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        const { evento_id, total, cantidad_tickets } = await req.json();

        const idUserBinary = Buffer.from(session.user.id.data, 'hex');

        const idEventBinary = Buffer.from(evento_id, 'hex');

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

        const values = [idUserBinary, idEventBinary, total, cantidad_tickets];

        const [result] = await connection.query('INSERT INTO Ticket (user_id, evento_id, total, cantidad_tickets) VALUES (?,?,?,?)', values);

        const insertedId = result.insertId;

        const [createTicket] = await connection.execute('SELECT * FROM Ticket WHERE numero_tickets = ?', [insertedId]);

        const filterData = createTicket.map(ti => {
            const idStringUser = ti.user_id.toString('hex');
            const idStringSessionUser = idUserBinary.toString('hex');

            const idStringTicket = ti.numero_tickets.toString('hex');

            const date = new Date(ti.fecha_compra);

            if (date >= new Date() && idStringUser === idStringSessionUser) {
                return idStringTicket;
            }
            return null;
        }).filter(id => id !== null);

        return NextResponse.json({ message: 'Compra realizada', idTicket: filterData[0] });
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ message: "Error al crear el metodo de pago: " + error.message });
    }
}