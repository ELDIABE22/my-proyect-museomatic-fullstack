import { deleteImageFromFirebase, uploadFile } from "@/firebase/config";
import { connection } from "@/utils/museodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const dataElemnet = JSON.parse(data.get("data"));

        const [validateExistenceName] = await connection.query('SELECT * FROM Coleccion WHERE LOWER(nombre) = LOWER(?)', [dataElemnet.name]);

        if (validateExistenceName[0]) {
            return NextResponse.json({ message: "El nombre de la colección ya existe!" });
        }

        if (image !== "null") {
            const imageSave = await uploadFile(image, 'colecciones');
            dataElemnet.imageURL = imageSave.url;
        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        const idMuseumBinary = Buffer.from(dataElemnet.idMuseum, 'hex');

        const values = [idMuseumBinary, dataElemnet.name, dataElemnet.description, dataElemnet.typeCollection, dataElemnet.imageURL, dataElemnet.website];

        await connection.query('INSERT INTO Coleccion (museo_id, nombre, descripcion, tipo_articulo, imageURL, sitio_web) VALUES (?, ?, ?, ?, ?, ?)', values);

        return NextResponse.json({ message: "Colección agregado" });
    } catch (error) {
        return NextResponse.json({ message: "Error al crear una coleccion", error: error.message });
    }
}

export async function GET() {
    try {
        const [getCollection] = await connection.query('SELECT * FROM Coleccion');

        return NextResponse.json(getCollection);
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener las colecciones", error: error.message });
    }
}

export async function PUT(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const imageUrlRemove = data.get("imageUrlRemove");
        const id = data.get("id");
        const dataElemnet = JSON.parse(data.get("data"));

        const [validateExistenceName] = await connection.query('SELECT * FROM Coleccion WHERE LOWER(nombre) = LOWER(?)', [dataElemnet.name]);

        if (validateExistenceName[0]) {
            const idBuffer = Buffer.from(validateExistenceName[0].id);
            const idString = idBuffer.toString("hex");

            const validateName = idString == id;
            if (!validateName) return NextResponse.json({ message: "El nombre de la colección ya existe!" });
        }

        if (image) {
            let imageUrl;

            if (typeof image === 'string') {
                imageUrl = image;
            } else {
                const imageSave = await uploadFile(image, 'colecciones');
                imageUrl = imageSave.url;
            }

            dataElemnet.imageURL = imageUrl;

        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        if (imageUrlRemove && typeof image !== 'string') {
            await deleteImageFromFirebase(imageUrlRemove);
        }

        const idMuseumBinary = Buffer.from(dataElemnet.idMuseum, 'hex');

        const values = [idMuseumBinary, dataElemnet.name, dataElemnet.description, dataElemnet.typeCollection, dataElemnet.imageURL, dataElemnet.website, id];

        await connection.query('UPDATE Coleccion SET museo_id = ?, nombre = ?, descripcion = ?, tipo_articulo = ?, imageURL = ?, sitio_web = ? WHERE id = UUID_TO_BIN(?)', values);

        return NextResponse.json({ message: "Colección actualizada" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error al actualizar la colección", error: error.message });
    }
}