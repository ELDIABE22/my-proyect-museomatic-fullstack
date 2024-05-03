"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const MuseumPage = ({ params }) => {
  const [museum, setMuseum] = useState({});
  const [loading, setLoading] = useState(true);
  console.log(museum);

  const getMuseums = async () => {
    try {
      const res = await axios.get(`/api/admin/museum/${params.id}`);
      const { data } = res;

      setMuseum(data);
      setLoading(false);
    } catch (error) {
      console.log("Error, intentalo más tarde: ", error);
    }
  };

  useEffect(() => {
    getMuseums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      {loading ? (
        <p className="text-2xl font-bold text-center">Cargando...</p>
      ) : (
        <>
          <div className="h-[300px] w-full relative flex items-center justify-center">
            <Image
              fill
              alt={museum.nombre}
              className="absolute object-cover w-full h-full bg-black filter blur-sm"
              src={museum.imagenURL}
            />
            <h2 className="absolute text-center font-bold text-5xl text-black">
              {museum.nombre}
            </h2>
          </div>
        </>
      )}
    </section>
  );
};

export default MuseumPage;
