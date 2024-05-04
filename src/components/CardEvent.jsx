import { Card, Image } from "@nextui-org/react";

const CardEvent = ({ events }) => {
  return (
    <Card
      isPressable
      className="col-span-1 cursor-pointer transition hover:scale-105"
    >
      <div className="flex flex-col bg-background/50 border border-primary-50 rounded-lg shadow-large">
        <div className="flex-1 overflow-hidden relative w-full rounded-s-lg">
          <Image
            shadow="sm"
            radius="lg"
            src={events.imagenURL}
            alt={events.nombre}
            className="w-full h-[240px] object-cover"
          />
        </div>
        <div className="p-1 py-2 text-sm">
          <h3 className="font-semibold text-xl">{events.nombre}</h3>
          <div className="flex justify-between text-xs font-light">
            <p>Entrada:</p>
            <span>$ {events.precio}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardEvent;
