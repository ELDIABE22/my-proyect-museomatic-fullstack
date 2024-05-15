"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { loginSchema } from "@/utils/zod";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { Button, Input, Spinner } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userLoginLoading, setUserLoginLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { status } = useSession();

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

      const res = await signIn("user-login", {
        email: zodData.email,
        password: zodData.password,
        redirect: false,
      });

      if (res.error) {
        alert(res.error);
      }

      if (res.ok) {
        alert("Sesión iniciada");
        router.push("/museums");
      }

      setCreatingUserLoading(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUserLoginLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <section className="container mx-auto flex justify-center items-center min-h-screen">
      {status === "loading" ? (
        <Spinner color="current" />
      ) : (
        <div className="flex flex-col md:flex-row md:gap-5 m-3 sm:m-0 border border-platinum rounded-3xl p-3 bg-platinum shadow-large shadow-black w-[930px]">
          <div className="w-full md:w-2/4 rounded-2xl flex justify-center items-center flex-col bg-white">
            <div className="mb-3">
              <Image
                alt="ilustracion2"
                width={500}
                height={500}
                src="/ilustracion2.jpg"
                className="w-[150px] md:w-full"
              />
            </div>
          </div>

          <div className="w-full md:w-2/4">
            <div>
              <p className="text-3xl my-5 font-bold text-center md:text-left">
                Iniciar Sesión
              </p>
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
                  errorMessage={
                    error?.find((error) => error.password)?.password
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
              </div>
              <div className="mb-3 flex">
                <Link
                  href="/auth/forgot-password"
                  className="text-black text-small font-bold cursor-pointer block hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
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
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="flex justify-center max-h-12 gap-3 bg-white p-[14px] rounded-2xl cursor-pointer shadow-large shadow-black"
                >
                  <GoogleIcon />
                  <p className="font-bold text-[15px]">Continuar con Google</p>
                </button>
              </div>
            </form>
            <div className="text-center text-black/70 text-xs flex justify-center gap-1">
              Aún no tienes cuenta?{" "}
              <Link
                href={"/auth/register"}
                className="text-black block font-bold hover:scale-90 transform transition-transform duration-[0.2s] ease-in-out"
              >
                Registrar
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LoginPage;
