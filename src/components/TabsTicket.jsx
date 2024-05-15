import axios from "axios";
import { EditIcon } from "./icons/EditIcon";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ticketSchema } from "@/utils/zod";
import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  CardHeader,
  Divider,
  CardFooter,
  Button,
} from "@nextui-org/react";

const TabsTicket = ({ params, ticketTotal }) => {
  const { data: session } = useSession();

  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [dateExpiry, setDateExpiry] = useState("");
  const [ticketAmount, setTicketAmount] = useState("");

  const [confirmTicket, setConfirmTicket] = useState(false);
  const [confirmName, setConfirmName] = useState(false);

  const [verifyingPayment, setUserLoginLoading] = useState(false);

  const [selected, setSelected] = useState("");
  const [disabledKeys, setDisabledKeys] = useState([]);

  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    setUserLoginLoading(true);
    e.preventDefault();

    try {
      ticketSchema.parse({
        name,
        cardNumber,
        dateExpiry,
        cvv,
      });

      setError(null);

      const res = await axios.post("/api/create-payment-intent", {
        evento_id: params.id,
        total: ticketTotal * ticketAmount,
        cantidad_tickets: parseInt(ticketAmount),
      });

      const { message, idTicket } = res.data;

      switch (message) {
        case "Compra realizada":
          alert("Redireccionando...");
          router.push(`/ticket/${idTicket}/receipt`);
          break;
        case "Tickets agotados":
          alert(message);
          router.push("/museums");
          break;
        default:
          alert(message);
          break;
      }

      setUserLoginLoading(false);
    } catch (error) {
      console.log(error.message);
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUserLoginLoading(false);
    }
  };

  const handleInputChangeCardNumber = (value) => {
    // Remover cualquier carácter que no sea un número
    const formattedValue = value.replace(/\D/g, "");

    // Insertar espacios cada cuatro dígitos
    setCardNumber(
      formattedValue
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .substr(0, 19)
    );
  };

  const confirmTicketAmount = () => {
    if (!verifyingPayment) {
      try {
        ticketSchema.parse({
          ticketAmount,
        });

        setError(null);

        setName(session?.user.nombre);

        setConfirmTicket(!confirmTicket);
      } catch (error) {
        const errors = error?.errors?.map((error) => error.message);
        setError(errors);
      }
    }
  };

  const confirmUser = () => {
    if (!verifyingPayment) {
      try {
        ticketSchema.parse({
          name,
        });

        setError(null);

        setConfirmName(!confirmName);
      } catch (error) {
        const errors = error?.errors?.map((error) => error.message);
        setError(errors);
      }
    }
  };

  useEffect(() => {
    if (!confirmTicket) {
      setDisabledKeys(["name", "details"]);
      setSelected("ticketAmount");
    } else if (confirmTicket && !confirmName) {
      setDisabledKeys(["ticketAmount", "details"]);
      setSelected("name");
    } else if (confirmTicket && confirmName) {
      setDisabledKeys(["ticketAmount", "name"]);
      setSelected("details");
    }
  }, [confirmTicket, confirmName]);

  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={setSelected}
      disabledKeys={disabledKeys}
      size="lg"
      radius="none"
      aria-label="Options"
    >
      <Tab key="ticketAmount" title="Tickets">
        <Card>
          <CardHeader className="text-2xl font-semibold">
            Cantidad de tickets
          </CardHeader>
          <Divider />
          <CardBody>
            <Input
              type="number"
              autoComplete="off"
              label="Cantidad"
              isClearable
              value={ticketAmount}
              onValueChange={setTicketAmount}
              isInvalid={error?.some((error) => error.ticketAmount)}
              errorMessage={
                error?.find((error) => error.ticketAmount)?.ticketAmount
              }
            />
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              onPress={confirmTicketAmount}
              radius="none"
              variant="shadow"
              className="w-full"
            >
              Confirmar
            </Button>
          </CardFooter>
        </Card>
      </Tab>
      <Tab key="name" title="Información">
        <Card>
          <CardHeader className="text-2xl font-semibold">
            Confirmar Nombre
          </CardHeader>
          <Divider />
          <CardBody>
            <Input
              type="text"
              autoComplete="off"
              label="Nombre"
              isClearable
              value={name}
              onValueChange={setName}
              isInvalid={error?.some((error) => error.name)}
              errorMessage={error?.find((error) => error.name)?.name}
            />
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              onPress={confirmUser}
              radius="none"
              variant="shadow"
              className="w-full"
            >
              Confirmar
            </Button>
          </CardFooter>
        </Card>
      </Tab>
      <Tab key="details" title="Detalles">
        <div className="w-fit h-fit bg-white shadow-lg rounded-lg max-w-[450px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-4">
              <div className="flex gap-1 justify-between items-center">
                <div className="flex gap-1">
                  <p className="font-semibold">Nombre:</p>
                  <span>{name}</span>
                </div>
                <span
                  onClick={confirmUser}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <EditIcon />
                </span>
              </div>
              <div className="flex gap-1 justify-between items-center">
                <div className="flex gap-1">
                  <p className="font-semibold">Tickets:</p>
                  <span>{ticketAmount}</span>
                </div>
                <span
                  onClick={confirmTicketAmount}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <EditIcon />
                </span>
              </div>
              <div className="w-full h-auto flex flex-col gap-1">
                <Input
                  isDisabled={verifyingPayment}
                  isClearable
                  label="Nombre del titular de la tarjeta"
                  labelPlacement="outside"
                  autoComplete="off"
                  type="text"
                  variant="bordered"
                  placeholder="Introduce tu nombre completo"
                  value={name}
                  onValueChange={setName}
                  isInvalid={error?.some((error) => error.name)}
                  errorMessage={error?.find((error) => error.name)?.name}
                />
              </div>
              <div className="w-full h-auto flex flex-col gap-1">
                <Input
                  isDisabled={verifyingPayment}
                  isClearable
                  label="Número de tarjeta"
                  labelPlacement="outside"
                  autoComplete="off"
                  type="text"
                  maxLength={19}
                  variant="bordered"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onValueChange={handleInputChangeCardNumber}
                  isInvalid={error?.some((error) => error.cardNumber)}
                />
              </div>
              <div className="w-full h-auto flex flex-col gap-1">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    isDisabled={verifyingPayment}
                    isClearable
                    label="Fecha de caducidad"
                    labelPlacement="outside"
                    autoComplete="off"
                    type="text"
                    maxLength={5}
                    variant="bordered"
                    placeholder="MM/AA"
                    value={dateExpiry}
                    onValueChange={setDateExpiry}
                    isInvalid={error?.some((error) => error.dateExpiry)}
                    errorMessage={
                      error?.find((error) => error.dateExpiry)?.dateExpiry
                    }
                  />
                  <Input
                    isDisabled={verifyingPayment}
                    isClearable
                    label="CVV"
                    labelPlacement="outside"
                    autoComplete="off"
                    type="text"
                    maxLength={3}
                    variant="bordered"
                    placeholder="CVV"
                    max={16}
                    value={cvv}
                    onValueChange={setCvv}
                    isInvalid={error?.some((error) => error.cvv)}
                  />
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <p>TOTAL:</p>
                <span>$ {ticketTotal * ticketAmount}</span>
              </div>
            </div>
            <Button
              isLoading={verifyingPayment}
              className="h-14 bg-gray rounded-lg border-0 outline-none text-white text-sm font-semibold bg-gradient-to-r from-gray-900 to-black shadow-lg transition-all duration-300 ease-in-out"
              type="submit"
            >
              PAGAR
            </Button>
          </form>
        </div>
      </Tab>
    </Tabs>
  );
};

export default TabsTicket;
