import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { id, name, phone } = await req.json();

        const [verifidUnique] = await connection.query(`SELECT * FROM Usuario WHERE telefono = ?`, [phone]);

        const idBuffer = Buffer.from(id.data);
        const idString = idBuffer.toString('hex');

        if (verifidUnique[0]) {
            const idBufferHex = verifidUnique[0].id.toString('hex');

            const validatePhone = idBufferHex === idString;

            if (!validatePhone) return NextResponse.json({ message: "El telefono esta registrado" });
        }

        const values = [name, phone, idString];

        await connection.query('UPDATE Usuario SET nombre = ?, telefono = ? WHERE id = UUID_TO_BIN(?)', values);

        return NextResponse.json({ message: 'Datos actualizados' });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: "Error al actualizar el usuario", error: error.message });
    }
}