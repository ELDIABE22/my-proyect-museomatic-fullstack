"use client";

import axios from "axios";
import Link from "next/link";
import PlusIcon from "@/components/icons/PlusIcon";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getEvents = async () => {
    try {
      const resEvent = await axios.get("/api/admin/event");
      const { data: event } = resEvent;

      const resMuseum = await axios.get("/api/admin/museum");
      const { data: museum } = resMuseum;

      // Mapear IDs de museos a un objeto
      const museumIdMap = {};

      museum.forEach((mu) => {
        const idBufferMuseum = Buffer.from(mu.id.data);
        const idStringMuseum = idBufferMuseum.toString("hex");
        museumIdMap[idStringMuseum] = { id: idStringMuseum, nombre: mu.nombre };
      });

      const updatedData = event.map((ev) => {
        const idBufferEvent = Buffer.from(ev.id.data);
        const idStringEvent = idBufferEvent.toString("hex");

        const idBufferMuseum = Buffer.from(ev.museo_id.data);
        const idStringMuseum = idBufferMuseum.toString("hex");

        const { id, nombre } = museumIdMap[idStringMuseum];

        return {
          ...ev,
          id: idStringEvent,
          museo_id: { id, nombre },
        };
      });

      setEvents(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Error, intenta más tarde: ", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getEvents();
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
      <div className="mb-5">
        <Button
          radius="none"
          variant="ghost"
          className="text-white bg-black w-full"
          startContent={<PlusIcon />}
          onPress={() => router.push("/admin/dashboard/events/new")}
        >
          Agregar evento
        </Button>
      </div>

      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <>
          {events.length > 0 ? (
            <div className="flex gap-5">
              {events.map((ev) => (
                <Card
                  key={ev.id}
                  shadow="sm"
                  isPressable
                  className="transition hover:scale-105"
                >
                  <Link href={`/admin/dashboard/events/update/${ev.id}`}>
                    <CardHeader className="flex flex-col font-bold text-lg text-center">
                      {ev.nombre}
                      <p className="text-xs text-gray font-normal">
                        {ev.museo_id.nombre}
                      </p>
                    </CardHeader>
                    <CardBody className="flex items-center">
                      <Image
                        shadow="sm"
                        radius="none"
                        alt={ev.nombre}
                        className="object-cover h-[200px] w-[300px]"
                        src={ev.imagenURL}
                      />
                    </CardBody>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center font-bold text-2xl">No hay eventos.</p>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default EventsPage;
