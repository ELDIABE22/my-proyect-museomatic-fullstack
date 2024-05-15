import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Input,
  Checkbox,
} from "@nextui-org/react";
import axios from "axios";
import { updateUserSchema } from "@/utils/zod";

const ModalAdminUser = ({
  isOpen,
  onOpenChange,
  setOpenModalUser,
  user,
  session,
  getUsers,
  setModalUserData,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [admin, setAdmin] = useState(false);

  const [updateUser, setUpdateUser] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    setUpdateUser(true);

    try {
      updateUserSchema.parse({
        name,
        phone,
      });

      setError(null);

      const res = await axios.put("/api/admin/user", {
        id: user.id,
        name,
        phone,
        admin: admin ? 1 : 0,
      });

      const { message } = res.data;

      if (message === "Datos actualizados") {
        alert(message);
        getUsers();
        setOpenModalUser(!isOpen);
      } else {
        alert(message);
      }

      setUpdateUser(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdateUser(false);
    }
  };

  useEffect(() => {
    setName(user?.nombre);
    setEmail(user?.email);
    setPhone(user?.telefono);
    setAdmin(user?.usuario_admin === 1 ? true : false);
  }, [user]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setOpenModalUser(!isOpen);
        setModalUserData(null);
        setError(null);
      }}
      onOpenChange={onOpenChange}
      placement="center"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Información Usuario
              {session?.user.usuario_admin === 1 && (
                <p className="text-md">
                  ID:{" "}
                  <span className="text-small text-default-500">{user.id}</span>
                </p>
              )}
            </ModalHeader>
            <Divider />
            <ModalBody>
              <form className="flex flex-col gap-4">
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
                {session?.user.usuario_admin === 1 && (
                  <Checkbox
                    isDisabled={updateUser}
                    defaultSelected={admin}
                    color="default"
                    isSelected={admin}
                    onValueChange={setAdmin}
                  >
                    Admin
                  </Checkbox>
                )}
                {session?.user.usuario_admin === 1 && (
                  <div>
                    <p className="font-semibold text-center">
                      Fecha de registro:{" "}
                      <span className="font-normal">{user.fecha_registro}</span>
                    </p>
                  </div>
                )}
              </form>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={updateUser}
                variant="light"
                onPress={onClose}
              >
                Cerrar
              </Button>
              <Button
                type="submit"
                isLoading={updateUser}
                onPress={handleUpdate}
                color="success"
              >
                Actualizar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAdminUser;
