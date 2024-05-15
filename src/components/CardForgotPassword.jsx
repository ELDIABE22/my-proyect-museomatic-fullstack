import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { correoForgotPasswordSchema } from "@/utils/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";

const CardForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sendingMail, setSendingMail] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendingMail(true);

    try {
      const validateEmail = correoForgotPasswordSchema.parse({ email });

      setError(null);

      const res = await axios.post("/api/auth/forgot-password", validateEmail);

      const { message } = res.data;

      if (message === "Correo enviado para restablecer contraseña") {
        alert(message);
        setEmail("");
      } else {
        alert(message);
      }

      setSendingMail(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setSendingMail(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2 className="font-bold text-2xl">¿Has olvidado tu contraseña?</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            isDisabled={sendingMail}
            autoFocus
            type="email"
            label="Correo electrónico"
            radius="none"
            autoComplete="off"
            isClearable
            value={email}
            onValueChange={setEmail}
            isInvalid={error?.some((error) => error.email)}
            errorMessage={error?.find((error) => error.email)?.email}
            className="w-full"
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex gap-3">
          <Button
            isDisabled={sendingMail}
            type="button"
            onPress={() => router.push("/auth/login")}
            radius="none"
            variant="ghost"
            className="w-full"
          >
            Cancelar
          </Button>
          <Button
            isLoading={sendingMail}
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

export default CardForgotPassword;
