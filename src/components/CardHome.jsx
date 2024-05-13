import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const CardHome = ({ museum }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between bg-white shadow-2xl shadow-black">
      <Image
        alt={museum.nombre}
        className="w-full min-h-[300px] object-cover"
        width={500}
        height={300}
        src={museum.imagenURL}
      />
      <div className="h-full flex flex-col justify-between p-4">
        <h4 className="mb-2 text-lg font-semibold text-black">
          {museum.nombre}
        </h4>
        <p className="mb-4 text-sm leading-6 text-gray">
          {museum.descripcion.substring(0, 200)}...
        </p>
        <Button
          color="default"
          radius="none"
          variant="shadow"
          className="font-medium"
          onPress={() => router.push(`/museums/${museum.id}`)}
        >
          Ver
        </Button>
      </div>
    </div>
  );
};

export default CardHome;
