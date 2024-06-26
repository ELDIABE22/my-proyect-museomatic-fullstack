import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";
import { deleteImageFromFirebase, uploadFile } from "@/firebase/config";

export async function POST(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const dataElemnet = JSON.parse(data.get("data"));

        // CONSULTA SENCILLA
        const [validateExistenceName] = await connection.query('SELECT * FROM Museo WHERE LOWER(nombre) = LOWER(?)', [dataElemnet.name]);

        if (validateExistenceName[0]) {
            return NextResponse.json({ message: "El nombre del museo ya existe!" });
        }

        if (image !== "null") {
            const imageSave = await uploadFile(image, 'museos');
            dataElemnet.imageURL = imageSave.url;
        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        // Formatea la fecha en el formato 'YYYY-MM-DD'
        const formattedDate = `${dataElemnet.foundingDate.year}-${dataElemnet.foundingDate.month.toString().padStart(2, '0')}-${dataElemnet.foundingDate.day.toString().padStart(2, '0')}`;

        // Formatea los tiempos en el formato 'HH:MM'
        const formattedOpeningTime = `${dataElemnet.openingTime.hour.toString().padStart(2, '0')}:${dataElemnet.openingTime.minute.toString().padStart(2, '0')}`;
        const formattedClosingTime = `${dataElemnet.closingTime.hour.toString().padStart(2, '0')}:${dataElemnet.closingTime.minute.toString().padStart(2, '0')}`;

        const values = [
            dataElemnet.name,
            dataElemnet.address,
            dataElemnet.description,
            dataElemnet.imageURL,
            formattedOpeningTime,
            formattedClosingTime,
            dataElemnet.website,
            formattedDate,
            dataElemnet.city,
            dataElemnet.entryPrice,
        ];

        // CONSULTA SENCILLA
        await connection.query('INSERT INTO Museo (nombre, direccion, descripcion, imagenURL, hora_apertura, hora_cierre, sitio_web, fecha_fundacion, ciudad, precio_entrada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values);

        return NextResponse.json({ message: "Museo agregado" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function GET() {
    try {
        // CONSULTA SENCILLA
        const [getMuseum] = await connection.query('SELECT * FROM Museo');

        return NextResponse.json(getMuseum);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function PUT(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const imageUrlRemove = data.get("imageUrlRemove");
        const id = data.get("id");
        const dataElemnet = JSON.parse(data.get("data"));

        const [validateExistenceName] = await connection.query('SELECT * FROM Museo WHERE LOWER(nombre) = LOWER(?)', [dataElemnet.name]);

        if (validateExistenceName[0]) {
            const idBuffer = Buffer.from(validateExistenceName[0].id);
            const idString = idBuffer.toString("hex");

            const validateName = idString == id;
            if (!validateName) return NextResponse.json({ message: "El nombre del museo ya existe!" });
        }

        if (image) {
            let imageUrl;

            if (typeof image === 'string') {
                imageUrl = image;
            } else {
                const imageSave = await uploadFile(image, 'museos');
                imageUrl = imageSave.url;
            }

            dataElemnet.imageURL = imageUrl;

        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        if (imageUrlRemove && typeof image !== 'string') {
            await deleteImageFromFirebase(imageUrlRemove);
        }

        // Formatea la fecha en el formato 'YYYY-MM-DD'
        const formattedDate = `${dataElemnet.foundingDate.year}-${dataElemnet.foundingDate.month.toString().padStart(2, '0')}-${dataElemnet.foundingDate.day.toString().padStart(2, '0')}`;

        // Formatea los tiempos en el formato 'HH:MM'
        const formattedOpeningTime = `${dataElemnet.openingTime.hour.toString().padStart(2, '0')}:${dataElemnet.openingTime.minute.toString().padStart(2, '0')}`;
        const formattedClosingTime = `${dataElemnet.closingTime.hour.toString().padStart(2, '0')}:${dataElemnet.closingTime.minute.toString().padStart(2, '0')}`;

        const values = [
            dataElemnet.name,
            dataElemnet.address,
            dataElemnet.description,
            dataElemnet.imageURL,
            formattedOpeningTime,
            formattedClosingTime,
            dataElemnet.state,
            dataElemnet.website,
            formattedDate,
            dataElemnet.city,
            dataElemnet.entryPrice,
            id
        ];

        await connection.query('UPDATE Museo SET nombre = ?, direccion = ?, descripcion = ?, imagenURL = ?, hora_apertura = ?, hora_cierre = ?, estado = ?, sitio_web = ?, fecha_fundacion = ?, ciudad = ?, precio_entrada = ? WHERE id = UUID_TO_BIN(?)', values);

        return NextResponse.json({ message: "Museo actualizado" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function DELETE(req) {
    try {
        const data = await req.formData();
        const id = data.get("id");
        const imageUrlRemove = data.get("imageUrlRemove");

        // Convertir el ID a Buffer para usarlo en la consulta SQL
        const idBuffer = Buffer.from(id, 'hex');

        // Eliminar registros relacionados en la tabla Ticket
        await connection.query('DELETE FROM Ticket WHERE evento_id IN (SELECT id FROM Evento WHERE museo_id = ?)', [idBuffer]);

        // Eliminar registros relacionados en la tabla Coleccion
        await connection.query('DELETE FROM Coleccion WHERE museo_id = ?', [idBuffer]);

        // Eliminar registros relacionados en la tabla Eventos
        await connection.query('DELETE FROM Evento WHERE museo_id = ?', [idBuffer]);

        // Eliminar registros relacionados en la tabla Foro
        await connection.query('DELETE FROM Foro WHERE museo_id = ?', [idBuffer]);

        // Ahora que no hay referencias desde otras tablas, podemos eliminar el museo
        await connection.query('DELETE FROM Museo WHERE id = ?', [idBuffer]);

        if (imageUrlRemove) {
            await deleteImageFromFirebase(imageUrlRemove);
        }

        return NextResponse.json({ message: 'Museo eliminado' });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: 'Error al eliminar el museo', error: error.message });
    }
}
