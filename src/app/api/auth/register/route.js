import bcrypt from "bcrypt";
import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, email, phone, password } = await req.json();

        const [verifidUnique] = await connection.query(`SELECT * FROM Usuario WHERE email = ? OR telefono = ?`, [email, phone]);

        if (verifidUnique[0]) {
            if (verifidUnique[0].email === email) {
                return NextResponse.json({ message: "El correo ya esta registrado" });
            } else if (verifidUnique[0].telefono === phone) {
                return NextResponse.json({ message: "El telefono esta registrado" });
            }
        }

        const validPassword = await bcrypt.hash(password, 10);

        const values = [name, email, phone, validPassword];

        await connection.query(`INSERT INTO Usuario (nombre, email, telefono, contrasena) VALUES (?, ?, ?, ?)`, values);

        return NextResponse.json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el usuario! ' + error });
    }
}