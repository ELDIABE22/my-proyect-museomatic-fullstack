"use client";

import axios from "axios";
import CardReceipt from "@/components/CardReceipt";
import { useRouter } from "next/navigation";
import { formatearFecha } from "@/utils/formateDate";
import { useEffect, useState } from "react";

const ReceiptPage = ({ params }) => {
  const [ticket, setTicket] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const getTicket = async () => {
    try {
      const res = await axios.get(`/api/ticket/${params.id}`);
      const { message, infoTicket } = res.data;

      if (message === "Petición autorizada") {
        const idBuffer = Buffer.from(infoTicket.numero_tickets.data);
        const idString = idBuffer.toString("hex");

        const formattedDate = formatearFecha(infoTicket.fecha_compra);

        const updateDate = {
          ...infoTicket,
          numero_tickets: idString,
          fecha_compra: formattedDate,
        };

        setTicket(updateDate);
      } else if (message === "Petición denegada") {
        router.push("/");
      }

      setLoading(false);
    } catch (error) {
      console.log(
        `Error al consultar el ticket con ID ${params.id}` + error.message
      );
    }
  };

  useEffect(() => {
    getTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-screen flex justify-center items-center">
      {loading ? (
        <p className="font-bold text-2xl">Cargando...</p>
      ) : (
        <CardReceipt ticket={ticket} />
      )}
    </section>
  );
};

export default ReceiptPage;
