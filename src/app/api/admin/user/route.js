import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [users] = await connection.query('SELECT * FROM Usuario');

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Error al consultar los usuarios", error: error.message });
    }
}

export async function PUT(req) {
    try {
        const { id, name, phone, admin } = await req.json();
        console.log(admin)

        if (admin !== null) {
            const [verifidUnique] = await connection.query(`SELECT * FROM Usuario WHERE telefono = ?`, [phone]);

            if (verifidUnique[0]) {
                const idBufferHex = verifidUnique[0].id.toString('hex');

                const validatePhone = idBufferHex === id;

                if (!validatePhone) return NextResponse.json({ message: "El telefono esta registrado" });
            }

            const values = [name, phone, admin, id];

            await connection.query('UPDATE Usuario SET nombre = ?, telefono = ?, usuario_admin = ? WHERE id = UUID_TO_BIN(?)', values);
        } else {
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
        }

        return NextResponse.json({ message: 'Datos actualizados' });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: "Error al actualizar el usuario", error: error.message });
    }
}