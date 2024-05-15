import CircleCheckIcon from "./icons/CircleCheckIcon";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const CardReceipt = ({ ticket }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-large rounded-lg w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          <CircleCheckIcon className="text-green-500 w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pago confirmado</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
            Gracias por tu pago. Su transacción ha sido exitosamente procesada.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Número ticket:</p>
              <p className="font-medium text-sm">{ticket.numero_tickets}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Nombre:</p>
              <p className="font-medium">{ticket.nombre_usuario}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Evento:</p>
              <p className="font-medium">{ticket.nombre_evento}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Cantidad:</p>
              <p className="font-medium">{ticket.cantidad_tickets}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">Total:</p>
              <p className="font-medium">$ {ticket.total}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500 dark:text-gray-400">
                Fecha de compra:
              </p>
              <p className="font-medium">{ticket.fecha_compra}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button>Descargar</Button>
            <Button onPress={() => router.push("/museums")} variant="ghost">
              Volver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardReceipt;
