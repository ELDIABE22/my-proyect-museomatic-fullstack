"use client";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateInput, TimeInput } from "@nextui-org/date-input";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Textarea,
} from "@nextui-org/react";
import { eventSchema } from "@/utils/zod";

const NewEventsPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [idMuseum, setIdMuseum] = useState("");
  const [typeEvent, setTypeEvent] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [itemImage, setItemImage] = useState({ file: null });
  const [loading, setLoading] = useState(true);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [error, setError] = useState(null);

  const [museum, setMuseum] = useState([]);

  const { data: session, status } = useSession();

  const router = useRouter();

  const typesEvents = [
    "Exposiciones temporales",
    "Exposiciones permanentes",
    "Visitas guiadas",
    "Talleres",
    "Conciertos",
    "Obras de teatro",
    "Proyecciones audiovisuales",
    "Charlas",
    "Conferencias",
    "Presentaciones de libros",
    "Eventos para niños",
    "Eventos familiares",
    "Festivales",
    "Ciclos de cine",
    "Actividades educativas",
    "Visitas nocturnas",
    "Días de entrada gratuita",
    "Concursos",
    "Lanzamientos de productos",
    "Inauguraciones",
    "Mesas redondas",
    "Simposios",
    "Congresos",
    "Eventos gastronómicos",
    "Eventos literarios",
    "Eventos de bienestar",
    "Eventos inclusivos",
    "Eventos virtuales",
  ];

  const handleEditImage = async (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItemImage({ image: imageUrl, file });
    }
  };

  const getMuseum = async () => {
    try {
      const res = await axios.get("/api/admin/museum");
      const { data } = res;

      const filterMuseumActived = data
        .filter((museum) => museum.estado === "activo")
        .map((museum) => {
          const idBuffer = Buffer.from(museum.id.data);
          const idString = idBuffer.toString("hex");
          return { ...museum, id: idString };
        });

      setMuseum(filterMuseumActived);

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los museos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingEvent(true);
    try {
      eventSchema.parse({
        idMuseum,
        name,
        description,
        eventDate: eventDate ? "Fecha" : "",
        eventTime: eventTime ? "Time" : "",
        price,
        typeEvent,
        capacity,
      });

      setError(null);

      const formData = new FormData();

      formData.append("image", itemImage.file);

      formData.append(
        "data",
        JSON.stringify({
          idMuseum,
          name,
          description,
          price,
          capacity,
          typeEvent,
          eventDate,
          eventTime,
        })
      );

      const res = await axios.post("/api/admin/event", formData);
      const { message } = res.data;

      if (message === "Evento creado") {
        alert(message);
        router.push("/admin/dashboard/events");
      } else {
        alert(message);
      }

      setCreatingEvent(false);
    } catch (error) {
      console.log(error);
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setCreatingEvent(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getMuseum();
      } else {
        return router.push("/admin");
      }
    } else if (status === "unauthenticated") {
      return router.push("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
        <div>
          <h2 className="text-center font-bold text-3xl mb-5">CREAR EVENTO</h2>
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                isDisabled={creatingEvent}
                isClearable
                type="text"
                label="Nombre"
                value={name}
                onValueChange={setName}
                isInvalid={error?.some((error) => error.name)}
                errorMessage={error?.find((error) => error.name)?.name}
              />
              <Textarea
                isDisabled={creatingEvent}
                label="Descripción"
                value={description}
                onValueChange={setDescription}
                isInvalid={error?.some((error) => error.description)}
                errorMessage={
                  error?.find((error) => error.description)?.description
                }
              />
              <Autocomplete
                isDisabled={creatingEvent}
                label="Museo"
                selectedKey={idMuseum}
                onSelectionChange={(e) => {
                  if (e === null) {
                    setIdMuseum("");
                  } else {
                    setIdMuseum(e);
                  }
                }}
                isInvalid={error?.some((error) => error.idMuseum)}
                errorMessage={error?.find((error) => error.idMuseum)?.idMuseum}
              >
                {museum.length > 0 &&
                  museum.map((estado) => (
                    <AutocompleteItem key={estado.id}>
                      {estado.nombre}
                    </AutocompleteItem>
                  ))}
              </Autocomplete>
              <Autocomplete
                isDisabled={creatingEvent}
                label="Tipo de evento"
                selectedKey={typeEvent}
                onSelectionChange={(e) => {
                  if (e === null) {
                    setTypeEvent("");
                  } else {
                    setTypeEvent(e);
                  }
                }}
                isInvalid={error?.some((error) => error.typeEvent)}
                errorMessage={
                  error?.find((error) => error.typeEvent)?.typeEvent
                }
              >
                {typesEvents.length > 0 &&
                  typesEvents.map((estado) => (
                    <AutocompleteItem key={estado}>{estado}</AutocompleteItem>
                  ))}
              </Autocomplete>
              <div className="flex gap-5">
                <DateInput
                  isDisabled={creatingEvent}
                  label={"Fecha del evento"}
                  value={eventDate}
                  onChange={setEventDate}
                  isInvalid={error?.some((error) => error.eventDate)}
                  errorMessage={
                    error?.find((error) => error.eventDate)?.eventDate
                  }
                />
                <TimeInput
                  isDisabled={creatingEvent}
                  label="Hora del evento"
                  value={eventTime}
                  onChange={setEventTime}
                  isRequired={error?.some((error) => error.eventTime)}
                />
              </div>
              <div className="flex gap-5">
                <Input
                  isDisabled={creatingEvent}
                  isClearable
                  type="number"
                  label="Precio"
                  value={price}
                  onValueChange={setPrice}
                  isInvalid={error?.some((error) => error.price)}
                  errorMessage={error?.find((error) => error.price)?.price}
                />
                <Input
                  isDisabled={creatingEvent}
                  isClearable
                  type="number"
                  label="Capacidad"
                  value={capacity}
                  onValueChange={setCapacity}
                  isInvalid={error?.some((error) => error.capacity)}
                  errorMessage={
                    error?.find((error) => error.capacity)?.capacity
                  }
                />
              </div>
              <Card shadow="sm" isPressable>
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleEditImage(e.target.files[0])}
                  />
                  <CardBody className="flex flex-col items-center">
                    <p className="text-lg font-semibold">
                      {itemImage?.image ? "Cambiar imagen" : "Cargar imagen"}
                    </p>
                    {itemImage?.image ? (
                      <Image
                        shadow="sm"
                        radius="lg"
                        alt={itemImage.image}
                        className="object-cover h-[200px] w-[500px]"
                        src={itemImage.image}
                      />
                    ) : (
                      <div className="w-[500px] h-[200px] rounded-md border border-dashed flex justify-center items-center">
                        <Image
                          src="/haga-click.png"
                          alt="haga-click"
                          className="object-cover h-[100px] w-[100px]"
                        />
                      </div>
                    )}
                  </CardBody>
                </label>
              </Card>
              <Button
                isLoading={creatingEvent}
                variant="shadow"
                type="submit"
                className="w-full bg-black"
              >
                <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                  {creatingEvent ? "Creando..." : "Crear"}
                </p>
              </Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default NewEventsPage;
