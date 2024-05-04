import { Card, Image } from "@nextui-org/react";

const CardCollection = ({ collections }) => {
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
            src={collections.imageURL}
            alt={collections.nombre}
            className="w-full h-[240px] object-cover"
          />
        </div>
        <div className="p-1 py-2 text-sm">
          <h3 className="font-semibold text-xl">{collections.nombre}</h3>
        </div>
      </div>
    </Card>
  );
};

export default CardCollection;
