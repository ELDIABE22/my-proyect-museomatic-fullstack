"use client";

import CardMuseums from "@/components/CardMuseums";
import axios from "axios";
import { useEffect, useState } from "react";

const MuseumsPage = () => {
  const [museums, setMuseums] = useState([]);
  const [museumsCity, setMuseumsCity] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMuseums = async () => {
    try {
      const res = await axios.get("/api/admin/museum");
      const { data } = res;

      const activeData = data
        .map((mu) => {
          const idBuffer = Buffer.from(mu.id.data);
          const idString = idBuffer.toString("hex");

          return { ...mu, id: idString };
        })
        .filter((muFilter) => muFilter.estado === "activo");

      const cities = activeData.map((mu) => mu.ciudad);

      setMuseums(activeData);
      setMuseumsCity(cities);
      setLoading(false);
    } catch (error) {
      console.log("Error, intentalo más tarde: ", error);
    }
  };

  useEffect(() => {
    getMuseums();
  }, []);

  return (
    <>
      {loading ? (
        <p className="text-2xl font-bold text-center">Cargando...</p>
      ) : (
        <>
          {museums.length > 0 ? (
            <div>
              {museumsCity.map((city, cityIndex) => (
                <div className="my-4 mx-3" key={cityIndex}>
                  <h3 className="text-center font-bold text-3xl">{city}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
                    {museums.map(
                      (mu) =>
                        mu.ciudad === city && (
                          <CardMuseums key={mu.id} museums={mu} />
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-3xl font-bold">
              No hay museos disponibles.
            </p>
          )}
        </>
      )}
    </>
  );
};

export default MuseumsPage;
