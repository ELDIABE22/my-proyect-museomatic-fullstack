"use client";

import NavbarDashboard from "@/components/NavbarDashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardLayout = ({ children }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [router, status]);

  return (
    <section className="bg-black h-screen flex overflow-hidden">
      <NavbarDashboard />
      <div className="bg-platinum flex-grow mt-2 mr-2 rounded-lg p-4 mb-0 overflow-auto">
        {children}
      </div>
    </section>
  );
};

export default DashboardLayout;
