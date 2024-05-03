"use client";

import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";

export default function MuseumsLayout({ children }) {
  const params = useParams();

  return (
    <section>
      {!params.id && <Navbar />}
      {children}
    </section>
  );
}
