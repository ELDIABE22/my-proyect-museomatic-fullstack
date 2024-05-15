import axios from "axios";
import { updateUserSchema } from "@/utils/zod";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const ModalUser = ({
  isOpen,
  onOpenChange,
  setOpenModal,
  dataUser,
  getUser,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [updateUser, setUpdateUser] = useState(false);
  const [error, setError] = useState(null);

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
        id: dataUser.id,
        name,
        phone,
        admin: null,
      });

      const { message } = res.data;

      if (message === "Datos actualizados") {
        alert(message);
        setOpenModal(!isOpen);
        getUser();
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
    setName(dataUser.nombre);
    setEmail(dataUser.email);
    setPhone(dataUser.telefono);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setOpenModal(!isOpen);
        setError(null);
      }}
      onOpenChange={onOpenChange}
      placement="center"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <ModalHeader>Perfil</ModalHeader>
              <Divider />
              <ModalBody>
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
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button
                  color="danger"
                  type="button"
                  isDisabled={updateUser}
                  variant="light"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
                <Button isLoading={updateUser} type="submit" color="success">
                  Actualizar
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalUser;
