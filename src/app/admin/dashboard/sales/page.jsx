"use client";

import { Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { searchSchema } from "@/utils/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import AutocompleteMuseums from "@/components/admin/sales/AutocompleteMuseums";
import CardTicketsSold from "@/components/admin/sales/CardTicketsSold";
import CardTotalTicketsSold from "@/components/admin/sales/CardTotalTicketsSold";
import SectionMuseumSales from "@/components/admin/sales/SectionMuseumSales";

const SalesPage = () => {
  const [museum, setMuseum] = useState([]);
  const [searchTicketSale, setSearchTicketSale] = useState(null);
  const [ticketSale, setTicketSale] = useState({});

  const [idMuseum, setIdMuseum] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchSales, setSearchSales] = useState(false);
  const [error, setError] = useState(null);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getMuseumAndTickets = async () => {
    try {
      const resMuseums = await axios.get("/api/admin/museum");

      if (resMuseums.status !== 200) {
        throw new Error("Error al obtener los museos");
      }

      const { data: dataMuseums } = resMuseums;

      const filterMuseumActived = dataMuseums
        .filter((museum) => museum.estado === "activo")
        .map((museum) => {
          const idBuffer = Buffer.from(museum.id.data);
          const idString = idBuffer.toString("hex");
          return { ...museum, id: idString };
        });

      const resTicketSales = await axios.get("/api/admin/sales");

      if (resTicketSales.status !== 200) {
        throw new Error("Error al obtener las ventas de entradas");
      }

      const { data: dataTicketSales } = resTicketSales;

      setMuseum(filterMuseumActived);
      setTicketSale(dataTicketSales);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTicket = async () => {
    setSearchSales(true);

    try {
      searchSchema.parse({
        idMuseum,
      });

      setError(null);

      const res = await axios.get(`/api/admin/sales/${idMuseum}`);
      const { data } = res;

      setSearchTicketSale(data);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    } finally {
      setSearchSales(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getMuseumAndTickets();
      } else {
        return router.push("/admin");
      }
    } else if (status === "unauthenticated") {
      return router.push("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <>
          <h2 className="font-bold text-2xl text-center mb-5">
            Ventas de Ticket
          </h2>

          <section className="flex flex-wrap justify-center gap-5 mb-5">
            <CardTicketsSold ticketSale={ticketSale} />
            <CardTotalTicketsSold ticketSale={ticketSale} />
          </section>

          <section className="flex items-center gap-1 mx-3 mb-5">
            <AutocompleteMuseums
              museum={museum}
              idMuseum={idMuseum}
              setIdMuseum={setIdMuseum}
              searchSales={searchSales}
              handleSearchTicket={handleSearchTicket}
              error={error}
            />
          </section>

          {searchTicketSale && (
            <>
              <Divider className="mb-5" />
              <SectionMuseumSales searchTicketSale={searchTicketSale} />
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default SalesPage;
