import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";
import { deleteImageFromFirebase, uploadFile } from "@/firebase/config";

export async function POST(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const dataElemnet = JSON.parse(data.get("data"));

        if (image !== "null") {
            const imageSave = await uploadFile(image, 'eventos');
            dataElemnet.imagenURL = imageSave.url;
        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        const idMuseumBinary = Buffer.from(dataElemnet.idMuseum, 'hex');

        // Formatea la fecha en el formato 'YYYY-MM-DD'
        const formattedEventDate = `${dataElemnet.eventDate.year}-${dataElemnet.eventDate.month.toString().padStart(2, '0')}-${dataElemnet.eventDate.day.toString().padStart(2, '0')}`;

        // Formatea el tiempo en el formato 'HH:MM'
        const formattedEventTime = `${dataElemnet.eventTime.hour.toString().padStart(2, '0')}:${dataElemnet.eventTime.minute.toString().padStart(2, '0')}`;

        const values = [idMuseumBinary, dataElemnet.name, dataElemnet.description, formattedEventDate, formattedEventTime, dataElemnet.price, dataElemnet.typeEvent, dataElemnet.capacity, dataElemnet.imagenURL];

        await connection.query('INSERT INTO Evento (museo_id, nombre, descripcion, fecha, hora, precio, tipo_evento, capacidad, imagenURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', values);

        return NextResponse.json({ message: "Evento creado" });
    } catch (error) {
        return NextResponse.json({ message: "Error al crear una coleccion", error: error.message });
    }
}

export async function GET() {
    try {
        const [getEvents] = await connection.query('SELECT * FROM Evento');

        return NextResponse.json(getEvents);
    } catch (error) {
        return NextResponse.json({ message: "Error al consultar los eventos", error: error.message });
    }
}

export async function PUT(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const imageUrlRemove = data.get("imageUrlRemove");
        const id = data.get("id");
        const dataElemnet = JSON.parse(data.get("data"));

        if (image) {
            let imageUrl;

            if (typeof image === 'string') {
                imageUrl = image;
            } else {
                const imageSave = await uploadFile(image, 'eventos');
                imageUrl = imageSave.url;
            }

            dataElemnet.imagenURL = imageUrl;

        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        if (imageUrlRemove && typeof image !== 'string') {
            await deleteImageFromFirebase(imageUrlRemove);
        }

        const idMuseumBinary = Buffer.from(dataElemnet.idMuseum, 'hex');

        // Formatea la fecha en el formato 'YYYY-MM-DD'
        const formattedEventDate = `${dataElemnet.eventDate.year}-${dataElemnet.eventDate.month.toString().padStart(2, '0')}-${dataElemnet.eventDate.day.toString().padStart(2, '0')}`;

        // Formatea el tiempo en el formato 'HH:MM'
        const formattedEventTime = `${dataElemnet.eventTime.hour.toString().padStart(2, '0')}:${dataElemnet.eventTime.minute.toString().padStart(2, '0')}`;

        const values = [idMuseumBinary, dataElemnet.name, dataElemnet.description, formattedEventDate, formattedEventTime, dataElemnet.price, dataElemnet.typeEvent, dataElemnet.capacity, dataElemnet.state, dataElemnet.imagenURL, id];

        await connection.query('UPDATE Evento SET museo_id = ?, nombre = ?, descripcion = ?, fecha = ?, hora = ?, precio = ?, tipo_evento = ?, capacidad = ?, estado = ?, imagenURL = ? WHERE id = UUID_TO_BIN(?)', values);

        return NextResponse.json({ message: "Evento actualizado" });
    } catch (error) {
        return NextResponse.json({ message: "Error al actualizar el evento", error: error.message });
    }
}

export async function DELETE(req) {
    try {
        const data = await req.formData();
        const id = data.get("id");
        const imageUrlRemove = data.get("imageUrlRemove");

        const idBuffer = Buffer.from(id, 'hex');

        await connection.query('DELETE FROM Evento WHERE id = ?', [idBuffer]);

        if (imageUrlRemove) {
            await deleteImageFromFirebase(imageUrlRemove);
        }

        return NextResponse.json({ message: 'Evento eliminado' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error al eliminar el evento', error: error.message });
    }
}