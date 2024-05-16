"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/utils/zod";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import toast from "react-hot-toast";

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userLoginLoading, setUserLoginLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserLoginLoading(true);

    try {
      const zodData = loginSchema.parse({
        email,
        password,
      });

      setError(null);

      const res = await signIn("admin-login", {
        email: zodData.email,
        password: zodData.password,
        redirect: false,
      });

      if (res.error) {
        toast.error(res.error, {
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

      if (res.ok) {
        toast.success("Sesión admin iniciada", {
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

        router.push("/admin/dashboard");
      }

      setCreatingUserLoading(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUserLoginLoading(false);
    }
  };

  return (
    <section className="flex flex-col-reverse sm:flex-row gap-2 h-screen bg-platinum">
      <div className=" w-full sm:w-2/4 md:w-2/5 p-2 flex flex-col justify-center bg-platinum ">
        <div>
          <p className="text-3xl my-3 font-bold text-center">Iniciar Sesión</p>
        </div>
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="flex flex-col gap-3 mb-3">
            <Input
              isDisabled={userLoginLoading}
              isClearable
              type="email"
              label="Correo electrónico"
              value={email}
              onValueChange={setEmail}
              isInvalid={error?.some((error) => error.email)}
              errorMessage={error?.find((error) => error.email)?.email}
            />
            <Input
              isDisabled={userLoginLoading}
              type={isVisible ? "text" : "password"}
              label="Contraseña"
              autoComplete="off"
              value={password}
              onValueChange={setPassword}
              isInvalid={error?.some((error) => error.password)}
              errorMessage={error?.find((error) => error.password)?.password}
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
          </div>
          <div className="mb-3 flex">
            <small className="text-black font-bold cursor-pointer block hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out">
              ¿Olvidaste tu contraseña?
            </small>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              isLoading={userLoginLoading}
              type="submit"
              variant="shadow"
              size="lg"
              className="w-full bg-black"
              spinner={
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              }
            >
              <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                {userLoginLoading ? "Ingresando..." : "Ingresar"}
              </p>
            </Button>
          </div>
        </form>
      </div>

      <div className=" bg-gray h-full w-full sm:w-2/4 md:w-3/5 flex flex-col justify-center items-center rounded-bl-full rounded-br-full sm:rounded-br-none sm:rounded-bl-full sm:rounded-tl-full ">
        <div>
          <p className=" text-4xl md:text-6xl font-bold p-3 shadow-large bg-platinum">
            ADMIN
          </p>
        </div>
        <div className="flex">
          <p className=" text-4xl md:text-6xl font-bold shadow-large p-3 bg-white">
            MUSEO
          </p>
          <p className=" text-4xl md:text-6xl font-bold shadow-large p-3 bg-black text-white">
            MATIC
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
