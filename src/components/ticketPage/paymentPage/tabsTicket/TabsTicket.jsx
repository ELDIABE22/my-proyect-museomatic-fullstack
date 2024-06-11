import { Tab, Tabs } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ticketSchema } from "@/utils/zod";
import { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import TabName from "./TabName";
import TabTicketAmount from "./TabTicketAmount";
import TabDetails from "./TabDetails";
import TabTicketType from "./tabTicketType/TabTicketType";

const TabsTicket = ({ params, ticketTotal }) => {
  const { data: session } = useSession();

  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [dateExpiry, setDateExpiry] = useState("");
  const [ticketAmount, setTicketAmount] = useState("");

  const [confirmTicketType, setConfirmTicketType] = useState("");
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
        total:
          confirmTicketType === "Normal"
            ? ticketTotal * ticketAmount
            : (ticketTotal + 25000) * ticketAmount,
        cantidad_tickets: parseInt(ticketAmount),
      });

      const { message, idTicket } = res.data;

      switch (message) {
        case "Compra realizada":
          toast.success("Redireccionando...", {
            style: {
              backgroundColor: "#DCDCDC",
              color: "#000000",
              border: "1px solid #000000",
              padding: "16px",
            },
            iconTheme: {
              primary: "#000000",
              secondary: "#FFFFFF",
            },
          });
          router.push(`/ticket/${idTicket}/receipt`);
          break;
        case "Tickets agotados":
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
          router.push("/museums");
          break;
        default:
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

  const confirmType = (type) => {
    if (!confirmTicketType) {
      setConfirmTicketType(type);
    } else {
      setConfirmTicketType("");
    }
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
    if (!confirmTicketType) {
      setDisabledKeys(["ticketAmount", "name", "details"]);
      setSelected("ticketType");
    } else if (confirmTicketType && !confirmTicket) {
      setDisabledKeys(["ticketType", "name", "details"]);
      setSelected("ticketAmount");
    } else if (confirmTicket && !confirmName) {
      setDisabledKeys(["ticketType", "ticketAmount", "details"]);
      setSelected("name");
    } else if (confirmTicket && confirmName) {
      setDisabledKeys(["ticketType", "ticketAmount", "name"]);
      setSelected("details");
    }
  }, [confirmTicket, confirmName, confirmTicketType]);

  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={setSelected}
      disabledKeys={disabledKeys}
      size="lg"
      radius="none"
      aria-label="Options"
    >
      <Tab key="ticketType" title="Tipo de ticket" className="p-3">
        <TabTicketType ticketTotal={ticketTotal} confirmType={confirmType} />
      </Tab>

      <Tab key="ticketAmount" title="Tickets">
        <TabTicketAmount
          ticketAmount={ticketAmount}
          setTicketAmount={setTicketAmount}
          error={error}
          confirmTicketAmount={confirmTicketAmount}
        />
      </Tab>

      <Tab key="name" title="Información">
        <TabName
          name={name}
          setName={setName}
          error={error}
          confirmUser={confirmUser}
        />
      </Tab>

      <Tab key="details" title="Detalles">
        <TabDetails
          handleSubmit={handleSubmit}
          name={name}
          confirmUser={confirmUser}
          ticketAmount={ticketAmount}
          confirmTicketAmount={confirmTicketAmount}
          verifyingPayment={verifyingPayment}
          setName={setName}
          error={error}
          cardNumber={cardNumber}
          handleInputChangeCardNumber={handleInputChangeCardNumber}
          dateExpiry={dateExpiry}
          setDateExpiry={setDateExpiry}
          cvv={cvv}
          setCvv={setCvv}
          ticketTotal={ticketTotal}
          confirmTicketType={confirmTicketType}
          confirmType={confirmType}
        />
      </Tab>
    </Tabs>
  );
};

export default TabsTicket;
