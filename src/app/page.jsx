"use client";

import axios from "axios";
import Image from "next/image";
import CardHome from "@/components/CardHome";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);

  const { status } = useSession();

  const router = useRouter();

  let style;

  switch (museums.length) {
    case 1:
      style =
        "grid grid-cols-1 justify-center sm:grid-cols-2 lg:grid-cols-3 gap-4";
      break;
    case 2:
      style =
        "grid grid-cols-1 justify-center sm:grid-cols-2 lg:grid-cols-3 gap-4";
      break;
    case 3:
      style =
        "grid grid-cols-1 justify-center sm:grid-cols-2 lg:grid-cols-3 gap-4";
      break;
    default:
      break;
  }

  const getMuseums = async () => {
    try {
      const res = await axios.get("/api/museum");
      const { data } = res;

      const updateData = data.map((mu) => {
        const idBuffer = Buffer.from(mu.id.data);
        const idString = idBuffer.toString("hex");

        return { ...mu, id: idString };
      });

      setMuseums(updateData);
      setLoading(false);
    } catch (error) {
      console.log("Error, intentar más tarde: ", error.message);
    }
  };

  useEffect(() => {
    getMuseums();
  }, []);

  return (
    <section className="bg-gray/60 min-h-screen">
      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Spinner color="white" />
        </div>
      ) : (
        <div className="max-w-[1400px] min-h-screen m-auto p-4 flex flex-col">
          <div className="relative pt-20 pr-0 sm:pl-12 md:pl-20 pb-20 flex flex-col lg:flex-row gap-8">
            <Image
              alt="bg-dots"
              className="absolute top-0 left-[50%] -translate-x-full opacity-60"
              width="140"
              height="140"
              src="/bg-dots.png"
            />
            <Image
              alt="bg-arrow"
              className="absolute bottom-8 right-[20%] sm:right-[50%] -translate-x-full opacity-80"
              width="140"
              height="140"
              src="/bg-arrow.png"
            />
            <div>
              <h1 className="mb-4 text-7xl font-extrabold text-white">
                MUSEO
                <br />
                <span className="text-black">MATIC</span>
              </h1>
              <div className="max-w-[350px] mb-8 flex gap-1 flex-wrap">
                <p className="text-white leading-6">
                  Explora la historia y el arte en{" "}
                </p>
                <p className="text-black font-bold">MUSEOMATIC.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  color="default"
                  radius="none"
                  variant="shadow"
                  className="font-medium w-full md:max-w-[235px]"
                  onPress={() => router.push("/museums")}
                >
                  Descubre los museos en linea
                </Button>
                <div className="flex gap-3 w-full md:max-w-[235px]">
                  {status === "loading" && (
                    <Spinner className="text-center" color="white" />
                  )}

                  {status === "unauthenticated" && (
                    <>
                      <Button
                        radius="none"
                        variant="ghost"
                        onPress={() => router.push("/auth/login")}
                        className="bg-white text-black w-full"
                      >
                        Iniciar Sesión
                      </Button>
                      <Button
                        radius="none"
                        variant="shadow"
                        onPress={() => router.push("/auth/register")}
                        className="bg-black text-white w-full"
                      >
                        Registrarse
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {museums.length > 0 && (
              <div className={style}>
                {museums.map((mu) => (
                  <CardHome key={mu.id} museum={mu} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
