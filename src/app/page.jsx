import Image from "next/image";
import { Button } from "@nextui-org/react";
import CardHome from "@/components/CardHome";

export default function Home() {
  return (
    <section className="bg-gray bg-center bg-cover bg-no-repeat">
      <div className="max-w-[1400px] min-h-screen m-auto p-4 flex flex-col">
        <div className="relative pt-20 pr-0 sm:pl-12 md:pl-20 pb-20 flex flex-col lg:flex-row gap-8">
          <Image
            alt="bg-dots"
            className="absolute top-0 left-[50%] -translate-x-full opacity-60"
            width={140}
            height={140}
            src="/bg-dots.png"
          />
          <Image
            alt="bg-arrow"
            className="absolute bottom-8 right-[20%] sm:right-[50%] -translate-x-full opacity-80"
            width={140}
            height={140}
            src="/bg-arrow.png"
          />
          <div>
            <h1 className="mb-4 text-7xl font-extrabold text-white">
              MUSEO
              <br />
              <span className="text-black">MATIC</span>
            </h1>
            <div className="max-w-[350px] mb-8 flex gap-1 flex-wrap">
              <p className="text-white leading-6">
                Explora la historia y el arte en{" "}
              </p>
              <p className="text-black font-bold">MUSEOMATIC.</p>
            </div>
            <Button
              color="default"
              radius="none"
              variant="shadow"
              className="font-medium w-full md:max-w-[235px]"
            >
              Descubre los museos en linea
            </Button>
          </div>
          <div className="grid grid-cols-1 justify-center sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardHome />
            <CardHome />
            <CardHome />
          </div>
        </div>
      </div>
    </section>
  );
}
