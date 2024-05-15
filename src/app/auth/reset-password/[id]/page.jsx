"use client";

import axios from "axios";
import CardResetPassword from "@/components/CardResetPassword";
import { useEffect, useState } from "react";

const ResetPasswordPage = ({ params }) => {
  const [token, setToken] = useState(null);

  const getToken = async () => {
    try {
      const res = await axios.get(`/api/auth/reset-password/${params.id}`);
      const { message } = res.data;

      if (message === "Token válido") {
        setToken("Token válido");
      } else if (message === "El token no es válido o ha expirado") {
        setToken("El token no es válido o ha expirado");
      }
    } catch (error) {
      console.log("Error al consultar el token" + error.message);
    }
  };

  useEffect(() => {
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-screen flex justify-center items-center">
      {token === null && <p className="font-bold text-2xl">Cargando...</p>}

      {token === "Token válido" && <CardResetPassword params={params} />}

      {token === "El token no es válido o ha expirado" && (
        <p className="font-bold text-2xl">El enlace no existe o ya expiró!</p>
      )}
    </section>
  );
};

export default ResetPasswordPage;
