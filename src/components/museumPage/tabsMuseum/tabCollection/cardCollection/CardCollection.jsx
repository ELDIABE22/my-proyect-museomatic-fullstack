import { useState } from "react";
import { Card, Image, useDisclosure } from "@nextui-org/react";
import ModalCollection from "./ModalCollection";

const CardCollection = ({ collections }) => {
  const [openModalCollection, setOpenModalCollection] = useState(false);

  const { onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        isPressable
        className="col-span-1 cursor-pointer transition hover:scale-105"
        onPress={() => setOpenModalCollection(!openModalCollection)}
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

      {openModalCollection && (
        <ModalCollection
          isOpen={openModalCollection}
          onOpenChange={onOpenChange}
          collections={collections}
          setOpenModalCollection={setOpenModalCollection}
        />
      )}
    </>
  );
};

export default CardCollection;
