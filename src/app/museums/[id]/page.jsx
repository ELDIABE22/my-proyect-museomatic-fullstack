"use client";

import Clock from "@/components/icons/Clock";
import axios from "axios";
import Image from "next/image";
import MapIcon from "@/components/icons/MapIcon";
import TabsMuseum from "@/components/TabsMuseum";
import { Divider, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { formatearFecha, formatearHora } from "@/utils/formateDate";

const MuseumPage = ({ params }) => {
  const [museum, setMuseum] = useState({});
  const [events, setEvents] = useState([]);
  const [collections, setCollections] = useState([]);
  const [foro, setForo] = useState([]);
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

      const { dataCollection, dataEvents, dataForo } = eventsAndCollectionsData;

      const collections = dataCollection.map((coll) => {
        const idBuffer = Buffer.from(coll.id.data);
        const idString = idBuffer.toString("hex");

        return { ...coll, id: idString };
      });

      const events = dataEvents.map((ev) => {
        const idBuffer = Buffer.from(ev.id.data);
        const idString = idBuffer.toString("hex");

        // Formatea las fechas y horas
        const fecha = formatearFecha(ev.fecha);
        const horaInit = formatearHora(ev.hora_inicio);
        const horaFinally = formatearHora(ev.hora_fin);

        return {
          ...ev,
          id: idString,
          fecha,
          hora_inicio: horaInit,
          hora_fin: horaFinally,
        };
      });

      const foro = dataForo.map((fo) => {
        const idBuffer = Buffer.from(fo.id.data);
        const idString = idBuffer.toString("hex");

        return {
          ...fo,
          id: idString,
        };
      });

      setCollections(collections);
      setEvents(events);
      setForo(foro);

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
    <section>
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
          <div className="container px-2 mx-auto flex flex-col gap-4 mb-5">
            <div className="flex gap-2">
              <MapIcon />
              <p className="font-semibold">{museum.ciudad}</p>
            </div>
            <div>
              <p className="font-bold text-base sm:text-lg">
                Detalles de ubicación
              </p>
              <span>{museum.direccion}</span>
            </div>
            <div>
              <p className="font-bold text-base sm:text-lg">
                Fecha de fundación
              </p>
              <span>{museum.fecha_fundacion}</span>
            </div>
            <div>
              <p className="font-bold  text-base sm:text-lg">
                Acerca de este museo
              </p>
              <span>{museum.descripcion}</span>
            </div>
            <div>
              <p className="font-bold  text-base sm:text-lg">
                Hora de apertura y cierre
              </p>
              <div className="flex items-center gap-2">
                <Clock />
                <span>{museum.hora_apertura}</span>
                {"-"}
                <span>{museum.hora_cierre}</span>
              </div>
            </div>
            <div>
              <p className="font-bold  text-base sm:text-lg">
                Precio de entrada
              </p>
              <span>$ {museum.precio_entrada}</span>
            </div>
            <div>
              <p className="font-bold text-base sm:text-lg">
                Sitio web oficial
              </p>
              <Link
                href={museum.sitio_web}
                className="block overflow-hidden whitespace-normal"
              >
                {museum.sitio_web}
              </Link>
            </div>
          </div>

          <Divider />

          <TabsMuseum
            events={events}
            collections={collections}
            foro={foro}
            getMuseumDetails={getMuseumDetails}
          />
        </>
      )}
    </section>
  );
};

export default MuseumPage;
