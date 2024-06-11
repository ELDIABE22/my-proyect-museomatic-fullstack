import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";

const CardTicketVip = ({ ticketTotal, confirmType }) => {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-default-800">
      <CardHeader className="overflow-hidden">
        <div className="w-full">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/012/027/723/non_2x/admit-one-ticket-icon-black-and-white-isolated-wite-free-vector.jpg"
            alt="Event Image"
            width={600}
            height={400}
            className="w-full h-48 object-cover"
          />
        </div>
      </CardHeader>
      <CardBody className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-center">Ticket VIP</h3>
        <div className="bg-default-200 dark:bg-default-700 rounded-lg p-3 space-y-1">
          <p className="text-xl font-bold">
            {(ticketTotal + 25000).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="space-y-2 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#0d0d0d"}
                fill={"none"}
              >
                <path
                  d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                <span className="font-semibold">Entrada prioritaria</span>:
                Acceso rápido y sin filas a la entrada del evento.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#0d0d0d"}
                fill={"none"}
              >
                <path
                  d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                <span className="font-semibold">Parking VIP</span>: Zona de
                aparcamiento reservada para VIP.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#0d0d0d"}
                fill={"none"}
              >
                <path
                  d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                <span className="font-semibold">Guardarropa</span>: Un lugar
                para guardar abrigos, bolsos y otros objetos personales.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#0d0d0d"}
                fill={"none"}
              >
                <path
                  d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                <span className="font-semibold">Asientos preferenciales</span>:
                Los mejores asientos en la sala o recinto del evento.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#0d0d0d"}
                fill={"none"}
              >
                <path
                  d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>
                Descuento del <span className="font-semibold">10%</span> en un
                producto a tu elección en el restaurante o tienda del evento.
              </p>
            </div>
          </div>
        </div>
        <Button className="w-full" onPress={() => confirmType("VIP")}>
          Comprar Ticket
        </Button>
      </CardBody>
    </Card>
  );
};

export default CardTicketVip;
