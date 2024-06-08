"use client";

import axios from "axios";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MuseumsLayout({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { data: session, status } = useSession();

  const params = useParams();

  const getUser = async () => {
    try {
      if (status === "authenticated") {
        const idBuffer = Buffer.from(session?.user.id.data);
        const id = idBuffer.toString("hex");
        const res = await axios.get(`/api/admin/user/${id}`);
        const { data } = res;
        setUser(data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error, intentar más tarde" + error.message);
    }
  };

  return (
    <section>
      {!params.id && (
        <Navbar
          openModal={openModal}
          setOpenModal={setOpenModal}
          user={user}
          loading={loading}
          getUser={getUser}
        />
      )}
      {children}
    </section>
  );
}
