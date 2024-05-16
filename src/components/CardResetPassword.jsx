import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import { resetPasswordSchema } from "@/utils/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import toast from "react-hot-toast";

const CardResetPassword = ({ params }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState(null);

  const [updateNewPasswordLoading, setUpdateNewPasswordLoading] =
    useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateNewPasswordLoading(true);

    try {
      resetPasswordSchema.parse({
        newPassword,
        confirmNewPassword,
      });

      setError(null);

      if (newPassword !== confirmNewPassword) {
        setUpdateNewPasswordLoading(false);
        toast.error("Las contraseñas no coinciden!", {
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
        return;
      }

      const data = {
        token: params.id,
        newPassword,
      };

      const res = await axios.post("/api/auth/reset-password", data);

      const { message } = res.data;

      if (message === "Tu contraseña ha sido restablecida") {
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
        router.push("/auth/login");
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

      setUpdateNewPasswordLoading(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdateNewPasswordLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <Card>
        <CardHeader>
          <h2 className="font-bold text-2xl">Restablecer contraseña</h2>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-3">
          <Input
            isDisabled={updateNewPasswordLoading}
            autoFocus
            type={isVisible ? "text" : "password"}
            label="Nueva contraseña"
            radius="none"
            autoComplete="off"
            value={newPassword}
            onValueChange={setNewPassword}
            isInvalid={error?.some((error) => error.newPassword)}
            errorMessage={
              error?.find((error) => error.newPassword)?.newPassword
            }
            className="w-full"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          <Input
            type={isVisible ? "text" : "password"}
            isDisabled={updateNewPasswordLoading}
            label="Confirmar nueva contraseña"
            radius="none"
            autoComplete="off"
            value={confirmNewPassword}
            onValueChange={setConfirmNewPassword}
            isInvalid={error?.some((error) => error.confirmNewPassword)}
            className="w-full"
            errorMessage={
              error?.find((error) => error.confirmNewPassword)
                ?.confirmNewPassword
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex gap-3">
          <Button
            isDisabled={updateNewPasswordLoading}
            type="button"
            onPress={() => router.push("/auth/login")}
            radius="none"
            variant="ghost"
            className="w-full"
          >
            Cancelar
          </Button>
          <Button
            isLoading={updateNewPasswordLoading}
            type="submit"
            radius="none"
            variant="shadow"
            className="w-full"
          >
            Confirmar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CardResetPassword;
