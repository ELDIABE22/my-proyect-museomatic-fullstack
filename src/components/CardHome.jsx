import { Button } from "@nextui-org/react";
import Image from "next/image";

const CardHome = () => {
  return (
    <div className="h-[600x] bg-white shadow-2xl shadow-black">
      <Image
        alt="destination-1"
        className="w-full"
        width={140}
        height={140}
        src="/destination-1.jpg"
      />
      <div className="p-4">
        <h4 className="mb-2 text-lg font-semibold text-black">Museo del Oro</h4>
        <p className="mb-4 text-sm leading-6 text-gray">
          El Museo del Oro es uno de los museos más importantes de América
          Latina y el mundo, dedicado a la historia y cultura de la civilización
          Muisca. El museo alberga una de las colecciones más grandes y valiosas
          de arte precolombino, incluyendo oro, cerámica, textiles y objetos de
          oro.
        </p>
        <Button
          color="default"
          radius="none"
          variant="shadow"
          className="font-medium"
        >
          Ver
        </Button>
      </div>
    </div>
  );
};

export default CardHome;
