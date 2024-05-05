"use client";

import axios from "axios";
import Link from "next/link";
import PlusIcon from "@/components/icons/PlusIcon";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";

const ArticlesPage = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getCollection = async () => {
    try {
      const resCollection = await axios.get("/api/admin/collection");
      const { data: collection } = resCollection;

      const resMuseum = await axios.get("/api/admin/museum");
      const { data: museum } = resMuseum;

      // Mapear IDs de museos a un objeto
      const museumIdMap = {};

      museum.forEach((mu) => {
        const idBufferMuseum = Buffer.from(mu.id.data);
        const idStringMuseum = idBufferMuseum.toString("hex");
        museumIdMap[idStringMuseum] = { id: idStringMuseum, nombre: mu.nombre };
      });

      const updatedData = collection.map((coll) => {
        const idBufferCollection = Buffer.from(coll.id.data);
        const idStringCollection = idBufferCollection.toString("hex");

        const idBufferMuseum = Buffer.from(coll.museo_id.data);
        const idStringMuseum = idBufferMuseum.toString("hex");

        const { id, nombre } = museumIdMap[idStringMuseum];

        return {
          ...coll,
          id: idStringCollection,
          museo_id: { id, nombre },
        };
      });

      setCollection(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Error, intenta más tarde: ", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getCollection();
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
          onPress={() => router.push("/admin/dashboard/articles/new")}
        >
          Agregar nueva colección
        </Button>
      </div>

      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <>
          {collection.length > 0 ? (
            <div className="flex justify-center gap-5 flex-wrap">
              {collection.map((col) => (
                <Card
                  key={col.id}
                  shadow="sm"
                  isPressable
                  className="transition hover:scale-105"
                >
                  <Link href={`/admin/dashboard/articles/update/${col.id}`}>
                    <CardHeader className="flex flex-col font-bold text-xl text-center">
                      {col.nombre}
                      <p className="text-xs text-gray font-normal">
                        {col.museo_id.nombre}
                      </p>
                    </CardHeader>
                    <CardBody>
                      <Image
                        shadow="sm"
                        radius="none"
                        alt={col.nombre}
                        className="object-cover h-[200px] w-[300px]"
                        src={col.imageURL}
                      />
                    </CardBody>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center font-bold text-2xl">
              No hay colecciones.
            </p>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ArticlesPage;
