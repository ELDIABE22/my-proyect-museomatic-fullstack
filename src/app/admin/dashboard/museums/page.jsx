"use client";

import Link from "next/link";
import axios from "axios";
import PlusIcon from "@/components/icons/PlusIcon";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";

const MuseumsPage = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getMuseums = async () => {
    try {
      const res = await axios.get("/api/admin/museum");
      const { data } = res;

      // Itera sobre cada elemento del array y convierte el idBuffer a una cadena de texto
      const updatedData = data.map((museum) => {
        const idBuffer = Buffer.from(museum.id.data);
        const idString = idBuffer.toString("hex");
        return { ...museum, id: idString };
      });

      setMuseums(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los museos:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getMuseums();
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
      <div className="mb-5">
        <Button
          radius="none"
          variant="ghost"
          className="text-white bg-black w-full"
          startContent={<PlusIcon />}
          onPress={() => router.push("/admin/dashboard/museums/new")}
        >
          Agregar museo
        </Button>
      </div>

      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <>
          {museums.length > 0 ? (
            <div className="flex gap-5">
              {museums.map((mu) => (
                <Card
                  key={mu.id}
                  shadow="sm"
                  isPressable
                  className="transition hover:scale-105"
                >
                  <Link href={`/admin/dashboard/museums/update/${mu.id}`}>
                    <CardHeader className="font-bold text-xl text-center">
                      {mu.nombre}
                    </CardHeader>
                    <CardBody>
                      <Image
                        shadow="sm"
                        radius="none"
                        alt={mu.nombre}
                        className="object-cover h-[200px] w-[300px]"
                        src={mu.imagenURL}
                      />
                    </CardBody>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center font-bold text-2xl">No hay museos.</p>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default MuseumsPage;
