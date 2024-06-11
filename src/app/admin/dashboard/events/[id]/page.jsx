"use client";

import axios from "axios";
import TabsEvent from "@/components/admin/eventsPage/tabsEvent/TabsEvent";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { parseDate, Time } from "@internationalized/date";
import { useEffect, useState } from "react";

const EventPage = ({ params }) => {
  const [event, setEvent] = useState({});
  const [museum, setMuseum] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const getMuseumAndEvent = async () => {
    try {
      const resMuseums = await axios.get("/api/admin/museum");
      const { data: museums } = resMuseums;

      const filterMuseumActived = museums
        .filter((museum) => museum.estado === "activo")
        .map((museum) => {
          const idBuffer = Buffer.from(museum.id.data);
          const idString = idBuffer.toString("hex");
          return { ...museum, id: idString };
        });

      const resEvent = await axios.get(`/api/admin/event/${params.id}`);
      const { data: event } = resEvent;

      const fecha = new Date(event.infoEvent.fecha);

      const idEventBuffer = Buffer.from(event.infoEvent.id.data);
      const idEventString = idEventBuffer.toString("hex");

      const idMuseumBuffer = Buffer.from(event.infoEvent.museo_id.data);
      const idMuseumString = idMuseumBuffer.toString("hex");

      // Formatea la fecha en el formato "YYYY-MM-DD"
      const fechaFormateada = fecha.toISOString().split("T")[0];

      const [hoursInit, minutesInit] = event.infoEvent.hora_inicio.split(":");
      const [hoursFinally, minutesFinally] =
        event.infoEvent.hora_fin.split(":");

      const eventUpdate = {
        ...event.infoEvent,
        id: idEventString,
        museo_id: idMuseumString,
        fecha: parseDate(fechaFormateada),
        hora_inicio: new Time(hoursInit, minutesInit),
        hora_fin: new Time(hoursFinally, minutesFinally),
        total_ventas: event.total_ventas.suma_ventas_entradas,
        usuarios_tickets: event.userTickets,
      };

      setMuseum(filterMuseumActived);

      setEvent(eventUpdate);
    } catch (error) {
      console.error("Error, intenta más tarde: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getMuseumAndEvent();
      } else {
        return router.push("/admin");
      }
    } else if (status === "unauthenticated") {
      return router.push("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <div className="flex flex-col gap-5 items-center">
          <h2 className="text-center font-bold text-2xl">{event.nombre}</h2>
          <TabsEvent
            event={event}
            museum={museum}
            getMuseumAndEvent={getMuseumAndEvent}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default EventPage;
