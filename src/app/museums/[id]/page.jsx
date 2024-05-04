"use client";

import Clock from "@/components/icons/Clock";
import axios from "axios";
import Image from "next/image";
import MapIcon from "@/components/icons/MapIcon";
import TabsMuseum from "@/components/TabsMuseum";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { formatearFecha, formatearHora } from "@/utils/formateDate";

const MuseumPage = ({ params }) => {
  const [museum, setMuseum] = useState({});
  const [events, setEvents] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMuseumDetails = async () => {
    try {
      // Obtener los detalles del museo
      const museumRes = await axios.get(`/api/admin/museum/${params.id}`);
      const { data: museumData } = museumRes;

      // Formatea las fechas y horas
      const fecha_fundacion = formatearFecha(museumData.fecha_fundacion);
      const hora_apertura = formatearHora(museumData.hora_apertura);
      const hora_cierre = formatearHora(museumData.hora_cierre);

      // Actualiza los datos del museo con las fechas y horas formateadas
      const updateDate = {
        ...museumData,
        fecha_fundacion,
        hora_apertura,
        hora_cierre,
      };

      // Actualiza el estado del museo con los nuevos datos
      setMuseum(updateDate);

      // Intenta obtener los eventos y colecciones del museo
      const eventsAndCollectionsRes = await axios.get(
        `/api/museum/${params.id}`
      );
      const { data: eventsAndCollectionsData } = eventsAndCollectionsRes;

      const { dataCollection, dataEvents } = eventsAndCollectionsData;

      const collections = dataCollection.map((coll) => {
        const idBuffer = Buffer.from(coll.id.data);
        const idString = idBuffer.toString("hex");

        return { ...coll, id: idString };
      });

      const events = dataEvents.map((ev) => {
        const idBuffer = Buffer.from(ev.id.data);
        const idString = idBuffer.toString("hex");

        return { ...ev, id: idString };
      });

      setCollections(collections);
      setEvents(events);

      setLoading(false);
    } catch (error) {
      console.log("Error, intenta más tarde: ", error);
    }
  };

  useEffect(() => {
    getMuseumDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-platinum min-h-screen">
      {loading ? (
        <p className="text-2xl font-bold text-center">Cargando...</p>
      ) : (
        <>
          <div className="h-[300px] w-full relative flex items-center justify-center shadow-large mb-5">
            <Image
              fill
              alt={museum.nombre}
              className="absolute object-cover w-full h-full bg-black filter blur-sm"
              src={museum.imagenURL}
            />
            <h2 className="absolute text-center font-bold text-5xl text-black">
              {museum.nombre}
            </h2>
          </div>

          {/* Info del museo */}
          <div className="container mx-auto flex flex-col gap-4 mb-5">
            <div className="flex gap-2">
              <MapIcon />
              <p className="font-semibold">{museum.ciudad}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Detalles de ubicación</p>
              <span>{museum.direccion}</span>
            </div>
            <div>
              <p className="font-bold text-lg">Fecha de fundación</p>
              <span>{museum.fecha_fundacion}</span>
            </div>
            <div>
              <p className="font-bold text-lg">Acerca de este museo</p>
              <span>{museum.descripcion}</span>
            </div>
            <div>
              <p className="font-bold text-lg">Hora de apertura y cierre</p>
              <div className="flex gap-2">
                <Clock />
                <span>{museum.hora_apertura}</span>
                {"-"}
                <span>{museum.hora_cierre}</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-lg">Precio de entrada</p>
              <span>$ 5.000,00</span>
            </div>
            <div>
              <p className="font-bold text-lg">Sitio web oficial</p>
              <span>{museum.sitio_web}</span>
            </div>
          </div>

          <Divider />

          <TabsMuseum events={events} collections={collections} />
        </>
      )}
    </section>
  );
};

export default MuseumPage;
