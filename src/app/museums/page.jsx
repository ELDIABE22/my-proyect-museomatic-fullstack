"use client";

import CardMuseums from "@/components/museumPage/CardMuseums";
import { useMuseum } from "@/context/MuseumContext";

const MuseumsPage = () => {
  const { museumsCity, filteredItems, loading } = useMuseum();

  return (
    <>
      {loading ? (
        <p className="text-2xl font-bold text-center mt-4">Cargando...</p>
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <div>
              {museumsCity.map((city, cityIndex) => (
                <div className="my-4 mx-3" key={cityIndex}>
                  <h3 className="text-center font-bold text-3xl">{city}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-5 gap-y-8 mt-4">
                    {filteredItems.map(
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
            <p className="text-center text-2xl font-bold mt-5">
              No se encontraron museos.
            </p>
          )}
        </>
      )}
    </>
  );
};

export default MuseumsPage;
