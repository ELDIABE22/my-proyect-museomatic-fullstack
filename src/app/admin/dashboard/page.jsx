"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center">
        <h2 className="text-3xl">
          Bienvenido, <b>{session?.user?.nombre}</b>
        </h2>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
