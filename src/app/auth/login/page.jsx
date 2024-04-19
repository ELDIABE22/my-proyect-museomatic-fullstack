"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button, Input } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <section className="container mx-auto flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row md:gap-5 m-3 sm:m-0 border border-platinum rounded-3xl p-3 bg-platinum shadow-large shadow-black w-[930px]">
        <div className="w-full md:w-2/4 rounded-2xl flex justify-center items-center flex-col bg-white">
          <div className="mb-3">
            <Image
              alt="ilustracion"
              width={140}
              height={140}
              src="/ilustracion.jpg"
              className="w-[150px] md:w-[250px]"
            />
          </div>
        </div>

        <div className="w-full md:w-2/4">
          <div>
            <p className="text-3xl my-5 font-bold text-center md:text-left">
              Iniciar Sesión
            </p>
          </div>
          <form className="mb-3">
            <div className="flex flex-col gap-3 mb-3">
              <Input type="email" label="Correo electrónico" />
              <Input
                type={isVisible ? "text" : "password"}
                label="Contraseña"
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
                type="submit"
                color="success"
                variant="shadow"
                size="lg"
                className="w-full"
              >
                <p className="text-white text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                  Ingresar
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
    </section>
  );
};

export default LoginPage;
