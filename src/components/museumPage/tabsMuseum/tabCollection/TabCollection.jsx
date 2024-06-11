import CardCollection from "./cardCollection/CardCollection";

const TabCollection = ({ collections }) => {
  return (
    <div>
      <p className="text-lg font-bold text-center mb-5">Colecciones</p>
      {collections.length > 0 ? (
        <div className="flex gap-5 justify-center flex-wrap">
          {collections.map((coll) => (
            <CardCollection key={coll.id} collections={coll} />
          ))}
        </div>
      ) : (
        <p className="text-center text-3xl font-bold">
          El museo no tiene colecciones.
        </p>
      )}
    </div>
  );
};

export default TabCollection;
