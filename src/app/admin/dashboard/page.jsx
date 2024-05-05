"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin !== 1) {
        return router.push("/admin");
      }
    } else if (status === "unauthenticated") {
      return router.push("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 items-center justify-center">
        <h2 className="text-3xl">
          Bienvenido, <b>{session?.user?.nombre}</b>
        </h2>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
