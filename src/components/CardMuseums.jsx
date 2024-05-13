import { Card, Image } from "@nextui-org/react";
import ArrowTrendingDown from "./icons/ArrowTrendingDown";
import Link from "next/link";

const CardMuseums = ({ museums }) => {
  return (
    <Link href={`/museums/${museums.id}`}>
      <Card
        isPressable
        className="col-span-1 cursor-pointer transition hover:scale-105 w-full"
      >
        <div className="flex md:gap-2 bg-background/50 border border-primary-50 rounded-lg shadow-large w-full">
          <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
            <Image
              shadow="sm"
              radius="lg"
              src={museums.imagenURL}
              alt={museums.nombre}
              className="w-full h-[210px] object-cover"
            />
            <div className="absolute top-0 left-0 rounded-br-lg bg-white p-2 z-10">
              <p
                className={
                  museums.timeStatus === "Abierto"
                    ? "font-semibold text-green-500"
                    : "font-semibold text-red-500"
                }
              >
                {museums.timeStatus}
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
            <h3 className="font-semibold text-xl sm:text-left md:text-center">
              {museums.nombre}
            </h3>
            <div>
              <div className="flex gap-1 text-xs text-left text-black">
                <ArrowTrendingDown />
                <p>{museums.direccion.substring(0, 45)}...</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center font-semibold">
                $ {museums.precio_entrada}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CardMuseums;
