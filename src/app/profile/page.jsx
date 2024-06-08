"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUserSchema } from "@/utils/zod";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [updateUser, setUpdateUser] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getUser = async () => {
    try {
      const idSessionBuffer = Buffer.from(session?.user.id.data);
      const idSessionString = idSessionBuffer.toString("hex");

      const res = await axios.get(`/api/admin/user/${idSessionString}`);
      const { data } = res;

      setName(data.nombre);
      setEmail(data.email);
      setPhone(data.telefono);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateUser(true);

    try {
      updateUserSchema.parse({
        name,
        phone,
      });

      setError(null);

      const res = await axios.put("/api/profile", {
        id: session?.user.id,
        name,
        phone,
      });

      const { message } = res.data;

      if (message === "Datos actualizados") {
        toast.success(message, {
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

        router.push("/museums");
      } else {
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
      }
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    } finally {
      setUpdateUser(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getUser();
    } else if (status === "unauthenticated") {
      return router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, status]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-5">
      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <>
          <div>
            <h2 className="text-3xl font-semibold">
              Hola, <span className="text-gray">{name}</span>
            </h2>
            <p className="text-default-500 text-sm">
              Aquí tienes tu Información
            </p>
          </div>
          <Divider className="my-5" />
          <Card className="w-full">
            <CardBody>
              <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                <Input
                  isDisabled={updateUser}
                  isClearable
                  autoComplete="off"
                  type="text"
                  label="Nombre"
                  value={name}
                  onValueChange={setName}
                  isInvalid={error?.some((error) => error.name)}
                  errorMessage={error?.find((error) => error.name)?.name}
                />
                <Input
                  isDisabled
                  type="email"
                  label="Correo electrónico"
                  value={email}
                  onValueChange={setEmail}
                />
                <Input
                  isDisabled={updateUser}
                  type="number"
                  autoComplete="off"
                  label="Teléfono"
                  isClearable
                  value={phone}
                  onValueChange={setPhone}
                  isInvalid={error?.some((error) => error.phone)}
                  errorMessage={error?.find((error) => error.phone)?.phone}
                />
                <div className="flex justify-center gap-5">
                  <Button
                    type="button"
                    color="danger"
                    isDisabled={updateUser}
                    variant="light"
                    radius="none"
                    className="w-full"
                    onPress={() => router.push("/museums")}
                  >
                    Volver
                  </Button>
                  <Button
                    radius="none"
                    type="submit"
                    isLoading={updateUser}
                    color="default"
                    className="bg-black text-white w-full"
                  >
                    Actualizar
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </>
      )}
    </section>
  );
};

export default ProfilePage;
