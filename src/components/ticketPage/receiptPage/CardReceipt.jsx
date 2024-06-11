import CircleCheckIcon from "../../icons/CircleCheckIcon";
import { useRouter } from "next/navigation";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalRefundPolicies from "./ModalRefundPolicies";

const CardReceipt = ({ ticket }) => {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-large rounded-lg w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          <CircleCheckIcon className="text-green-500 w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pago confirmado</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
            Gracias por tu pago. Su transacción ha sido exitosamente procesada.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-full mb-1">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Número ticket:</p>
              <p className="font-medium text-sm">{ticket.numero_tickets}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Nombre:</p>
              <p className="font-medium text-sm">{ticket.nombre_usuario}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Evento:</p>
              <p className="font-medium text-sm">{ticket.nombre_evento}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Cantidad:</p>
              <p className="font-medium text-sm">{ticket.cantidad_tickets}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Total:</p>
              <p className="font-medium text-sm">
                {parseFloat(ticket.total).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">
                Fecha de compra:
              </p>
              <p className="font-medium text-sm">{ticket.fecha_compra}</p>
            </div>
          </div>
          <div className="mb-3">
            <p
              onClick={onOpen}
              className="text-primary-500 hover:text-primary-600 text-sm cursor-pointer transition hover:scale-105"
            >
              Políticas de reembolso
            </p>
          </div>
          <div className="flex gap-4">
            <Button>Descargar</Button>
            <Button onPress={() => router.push("/museums")} variant="ghost">
              Volver
            </Button>
          </div>
        </div>
      </div>

      <ModalRefundPolicies isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};
export default CardReceipt;
