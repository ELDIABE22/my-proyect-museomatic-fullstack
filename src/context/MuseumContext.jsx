"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MuseumContext = createContext();

// Hook personalizado para acceder al contexto
export const useMuseum = () => {
  const context = useContext(MuseumContext);
  if (context === undefined) {
    throw new Error("useMuseum debe ser usado dentro de un MuseumProvider");
  }
  return context;
};

export const MuseumProvider = ({ children }) => {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilterCity, setStatusFilterCity] = useState("all");
  const [statusFilterState, setStatusFilterState] = useState("all");
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

          const fechaHoy = new Date();
          const fechaHoyString = fechaHoy.toISOString().slice(0, 10);

          const horaApertura = new Date(
            fechaHoyString + "T" + mu.hora_apertura
          );
          const horaCierre = new Date(fechaHoyString + "T" + mu.hora_cierre);

          const horaActual = new Date();

          let timeStatus;
          if (horaActual >= horaApertura && horaActual <= horaCierre) {
            timeStatus = "Abierto";
          } else {
            timeStatus = "Cerrado";
          }

          return {
            ...mu,
            id: idString,
            timeStatus: timeStatus,
          };
        })
        .filter((muFilter) => muFilter.estado === "activo");

      // Set para que no se guarden ciudades iguales
      const cities = [...new Set(activeData.map((mu) => mu.ciudad))];

      setMuseums(activeData);
      setMuseumsCity(cities);
      setLoading(false);
    } catch (error) {
      console.log("Error, intentalo más tarde: ", error);
    }
  };

  // Determina si hay un filtro de búsqueda activo, basado en si el valor del filtro es verdadero (no vacío).
  const hasSearchFilter = Boolean(filterValue);

  // Opciones de estado disponibles para el filtro, representando el horario del museo.
  const statusTime = [
    { name: "Abierto", uid: "Abierto" },
    { name: "Cerrado", uid: "Cerrado" },
  ];

  // Filtra la lista de museos según el filtro de búsqueda y estado, memorizando el resultado para optimizar el rendimiento.
  const filteredItems = useMemo(() => {
    let filteredMuseum = [...museums];

    if (hasSearchFilter) {
      filteredMuseum = filteredMuseum.filter((mu) =>
        mu.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilterCity !== "all" &&
      Array.from(statusFilterCity).length !== museumsCity.length
    ) {
      filteredMuseum = filteredMuseum.filter((mu) =>
        Array.from(statusFilterCity).includes(mu.ciudad)
      );
    }

    if (
      statusFilterState !== "all" &&
      Array.from(statusFilterState).length !== statusTime.length
    ) {
      filteredMuseum = filteredMuseum.filter((mu) =>
        Array.from(statusFilterState).includes(mu.timeStatus)
      );
    }

    // Set para que no se guarden ciudades iguales
    const cities = [...new Set(filteredMuseum.map((mu) => mu.ciudad))];

    setMuseumsCity(cities);

    return filteredMuseum;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue, museums, statusFilterCity, statusFilterState]);

  useEffect(() => {
    getMuseums();
  }, []);

  return (
    <MuseumContext.Provider
      value={{
        museums,
        museumsCity,
        filteredItems,
        filterValue,
        statusFilterCity,
        statusFilterState,
        statusTime,
        loading,
        setMuseums,
        setMuseumsCity,
        setFilterValue,
        setStatusFilterCity,
        setStatusFilterState,
      }}
    >
      {children}
    </MuseumContext.Provider>
  );
};
