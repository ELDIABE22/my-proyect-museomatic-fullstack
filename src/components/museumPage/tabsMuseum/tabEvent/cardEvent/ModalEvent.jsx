import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  ModalFooter,
  Button,
  Divider,
  Chip,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

const ModalEvent = ({ isOpen, onOpenChange, events, setOpenModalEvent }) => {
  const [creatingPayment, setCreatingPayment] = useState(false);

  const { status } = useSession();

  const router = useRouter();

  const handlePayTicket = async () => {
    setCreatingPayment(true);

    if (status !== "authenticated") {
      setCreatingPayment(false);
      toast.error("Registrate o inicia sesión para comprar", {
        style: {
          backgroundColor: "#FF0000",
          color: "#FFFFFF",
          border: "1px solid #FF0000",
          padding: "16px",
        },
        iconTheme: {
          primary: "#FF0000",
          secondary: "#FFFFFF",
        },
      });
      return;
    }

    try {
      const res = await axios.get(`/api/create-payment-intent/${events.id}`);
      const { message } = res.data;

      if (message === "Disponible") {
        router.push(`/ticket/payment/${events.id}`);
      } else {
        toast.error(message, {
          style: {
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            border: "1px solid #FF0000",
            padding: "16px",
          },
          iconTheme: {
            primary: "#FF0000",
            secondary: "#FFFFFF",
          },
        });
      }

      setCreatingPayment(false);
    } catch (error) {
      console.log("Error, intenta más tarde: ", error.message);
      setCreatingPayment(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpenModalEvent(!isOpen)}
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
            <ModalHeader className="p-0 flex justify-center">
              <Image
                shadow="sm"
                radius="lg"
                src={events.imagenURL}
                alt={events.nombre}
                className="w-screen h-full object-cover"
              />
            </ModalHeader>
            <ModalBody>
              <h2 className="text-center font-bold text-2xl">
                {events.nombre}
              </h2>
              <div>
                <p>{events.descripcion}</p>
              </div>
              <div>
                <p className="font-bold text-lg">Tipo de evento</p>
                <span>{events.tipo_evento}</span>
              </div>
              <div>
                <div>
                  <p className="font-bold text-lg">Fecha del evento</p>
                  <span>{events.fecha}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row justify-between">
                <div>
                  <p className="font-bold text-lg">Hora Inicio</p>
                  <span>{events.hora_inicio}</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Hora Fin</p>
                  <span>{events.hora_fin}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row justify-between">
                {events.estado_evento === "Pendiente" && (
                  <div>
                    <p className="font-bold text-lg">Boletería</p>
                    <Chip
                      color={
                        events.estado_tickets === "Disponible"
                          ? "success"
                          : "danger"
                      }
                      variant="dot"
                    >
                      {events.estado_tickets}
                    </Chip>
                  </div>
                )}
                {events.estado_evento !== "Pendiente" && (
                  <div>
                    <p className="font-bold text-lg">Evento</p>
                    <Chip
                      color={
                        events.estado_tickets === "En curso"
                          ? "warning"
                          : "success"
                      }
                      variant="dot"
                    >
                      {events.estado_evento}
                    </Chip>
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-lg">Precio del Ticket</p>
                <span>
                  {parseFloat(events.precio).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              {events.estado_tickets === "Disponible" &&
                events.estado_evento === "Pendiente" && (
                  <Button
                    isLoading={creatingPayment}
                    onPress={handlePayTicket}
                    color="success"
                    variant="shadow"
                  >
                    Comprar
                  </Button>
                )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalEvent;
