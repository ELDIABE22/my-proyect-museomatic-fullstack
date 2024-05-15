"use client";

import axios from "axios";
import TabsTicket from "@/components/TabsTicket";
import { useEffect, useState } from "react";

const TicketPaymentPage = ({ params }) => {
  const [ticketTotal, setTicketTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTicket = async () => {
    try {
      const res = await axios.get(`/api/create-payment-intent/${params.id}`);
      const { message, ticket } = res.data;

      if (message === "Agotado") {
        alert("Tickets agotados");
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
    <section className="min-h-screen flex flex-col justify-center items-center gap-3">
      {loading ? (
        <p className="text-2xl font-bold">Cargando...</p>
      ) : (
        <>
          <h2 className="text-3xl font-bold">Detalles de la compra</h2>
          <TabsTicket params={params} ticketTotal={ticketTotal} />
        </>
      )}
    </section>
  );
};

export default TicketPaymentPage;
