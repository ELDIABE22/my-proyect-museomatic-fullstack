import Image from "next/image";

const CardMuseums = () => {
  return (
    <div className="col-span-1 cursor-pointer transition hover:scale-105">
      <div className="flex gap-2 bg-background/50 border border-primary-50 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src="/destination-1.jpg"
            alt="destination-1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h3 className="font-semibold text-xl">Meseo Carnaval</h3>
          <div className="text-primary/90">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </div>{" "}
          {/* Descripcion { museo.description.substring(0,45)}... */}
          <div className="text-primary/90"></div>
        </div>
      </div>
    </div>
  );
};

export default CardMuseums;
