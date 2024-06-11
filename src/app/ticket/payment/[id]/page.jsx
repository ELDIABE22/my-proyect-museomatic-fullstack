"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TabsTicket from "@/components/ticketPage/paymentPage/tabsTicket/TabsTicket";
import toast from "react-hot-toast";

const TicketPaymentPage = ({ params }) => {
  const [ticketTotal, setTicketTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTicket = async () => {
    try {
      const res = await axios.get(`/api/create-payment-intent/${params.id}`);
      const { message, ticket } = res.data;

      if (message === "Agotado") {
        toast.success("Tickets agotados", {
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
        router.push("/");
        return;
      }

      setTicketTotal(parseFloat(ticket.PrecioDelEvento));
      setLoading(false);
    } catch (error) {
      console.log(
        `Error al consultar el evento con ID: ${params.id}` + error.message
      );
    }
  };

  useEffect(() => {
    getTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center gap-3 overflow-x-auto">
      {loading ? (
        <p className="text-2xl font-bold">Cargando...</p>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center">
            Detalles de la compra
          </h2>
          <TabsTicket params={params} ticketTotal={ticketTotal} />
        </>
      )}
    </section>
  );
};

export default TicketPaymentPage;
