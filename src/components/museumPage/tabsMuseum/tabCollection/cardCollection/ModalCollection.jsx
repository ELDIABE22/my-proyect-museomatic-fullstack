import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  ModalFooter,
  Button,
  Divider,
  Link,
} from "@nextui-org/react";

const ModalCollection = ({
  isOpen,
  onOpenChange,
  collections,
  setOpenModalCollection,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpenModalCollection(!isOpen)}
      onOpenChange={onOpenChange}
      placement="center"
      size="3xl"
      backdrop="blur"
      scrollBehavior="outside"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="p-0">
              <Image
                shadow="sm"
                radius="lg"
                src={collections.imageURL}
                alt={collections.nombre}
                className="w-full h-full object-cover"
              />
            </ModalHeader>
            <ModalBody>
              <h2 className="text-center font-bold text-2xl">
                {collections.nombre}
              </h2>
              <div>
                <p>{collections.descripcion}</p>
              </div>
              <div>
                <p className="font-bold text-lg">Tipo de artículo</p>
                <span>{collections.tipo_articulo}</span>
              </div>
              <div>
                <p className="font-bold text-lg">
                  Para más información visita el sitio web
                </p>
                <Link href={collections.sitio_web}>
                  {collections.sitio_web}
                </Link>
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCollection;
