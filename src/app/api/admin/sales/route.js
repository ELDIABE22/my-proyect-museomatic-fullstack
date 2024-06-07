import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [tickets] = await connection.query(`
            SELECT
                SUM(cantidad_tickets) AS total_cantidad_tickets,
                SUM(total) AS total_ventas
            FROM Ticket;      
        `);

        return NextResponse.json(tickets[0]);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener las ventas' + error.message });
    }
}