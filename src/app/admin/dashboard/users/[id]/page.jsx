"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatearFecha } from "@/utils/formateDate";
import { updateUserSchema } from "@/utils/zod";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";

const UserPage = ({ params }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [admin, setAdmin] = useState(false);

  const [updateUser, setUpdateUser] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getUser = async () => {
    try {
      const res = await axios.get(`/api/admin/user/${params.id}`);
      const { data } = res;

      const idBuffer = Buffer.from(data.id.data);
      const idString = idBuffer.toString("hex");

      const fecha_registro = formatearFecha(data.fecha_registro);

      setId(idString);
      setName(data.nombre);
      setEmail(data.email);
      setPhone(data.telefono);
      setRegistrationDate(fecha_registro);
      setAdmin(data.usuario_admin === 1 ? true : false);
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

      const res = await axios.put("/api/admin/user", {
        id,
        name,
        phone,
        admin: admin ? 1 : 0,
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

        router.push("/admin/dashboard/users");
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

      setUpdateUser(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdateUser(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getUser();
      } else {
        return router.push("/admin");
      }
    } else if (status === "unauthenticated") {
      return router.push("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.usuario_admin, status]);

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <>
          <h2 className="text-center font-bold text-2xl mb-5">
            Información del Usuario
          </h2>
          <Card isDisabled={updateUser}>
            <CardBody>
              <div className="flex justify-between">
                <p className="text-md font-semibold">ID del usuario:</p>
                <span>{id}</span>
              </div>
            </CardBody>
          </Card>
          <Divider className="my-5" />
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
            <Card>
              <CardBody>
                <div className="flex justify-center">
                  <Checkbox
                    isDisabled={updateUser}
                    defaultSelected={admin}
                    color="default"
                    isSelected={admin}
                    onValueChange={setAdmin}
                  >
                    Administrador
                  </Checkbox>
                </div>
              </CardBody>
            </Card>
            <Card isDisabled={updateUser}>
              <CardBody>
                <div className="flex justify-between">
                  <p className="font-semibold">Fecha de registro: </p>
                  <span>{registrationDate}</span>
                </div>
              </CardBody>
            </Card>
            <div className="flex justify-center gap-5">
              <Button
                type="button"
                color="danger"
                isDisabled={updateUser}
                variant="light"
                radius="none"
                className="w-full"
                onPress={() => router.push("/admin/dashboard/users")}
              >
                Cancelar
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
        </>
      )}
    </DashboardLayout>
  );
};

export default UserPage;
