import ModalEvent from "./ModalEvent";
import { useState } from "react";
import { Card, Image, useDisclosure } from "@nextui-org/react";

const CardEvent = ({ events }) => {
  const [openModalEvent, setOpenModalEvent] = useState(false);

  const { onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        isPressable
        className="col-span-1 cursor-pointer transition hover:scale-105"
        onPress={() => setOpenModalEvent(!openModalEvent)}
      >
        <div className="flex flex-col bg-background/50 border border-primary-50 rounded-lg shadow-large">
          <div className="flex justify-center overflow-hidden relative w-full rounded-s-lg">
            <Image
              shadow="sm"
              radius="lg"
              src={events.imagenURL}
              alt={events.nombre}
              className="w-full h-[240px] object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bg-white p-2 z-10">
              <p
                className={
                  events.estado === "Pendiente"
                    ? "font-semibold text-black"
                    : "font-semibold text-green-500"
                }
              >
                {events.estado === "Pendiente" ? events.fecha : events.estado}
              </p>
            </div>
          </div>
          <div className="p-1 py-2 text-sm">
            <h3 className="font-semibold text-xl">{events.nombre}</h3>
            <div className="flex justify-between text-xs font-light">
              <p>Ticket:</p>
              <span>$ {events.precio}</span>
            </div>
          </div>
        </div>
      </Card>

      {openModalEvent && (
        <ModalEvent
          isOpen={openModalEvent}
          onOpenChange={onOpenChange}
          events={events}
          setOpenModalEvent={setOpenModalEvent}
        />
      )}
    </>
  );
};

export default CardEvent;
