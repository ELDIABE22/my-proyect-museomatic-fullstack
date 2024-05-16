"use client";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { eventSchema } from "@/utils/zod";
import { typesEvents } from "@/utils/autocompleteData";
import { parseDate, Time } from "@internationalized/date";
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
import toast from "react-hot-toast";

const UpdateEventsPage = ({ params }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [idMuseum, setIdMuseum] = useState("");
  const [typeEvent, setTypeEvent] = useState("");
  const [state, setState] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [eventTimeInit, setEventTimeInit] = useState(null);
  const [eventTimeFinally, setEventTimeFinally] = useState(null);
  const [itemImage, setItemImage] = useState({ file: null });

  const [loading, setLoading] = useState(true);
  const [deleteEvent, setDeleteEvent] = useState(false);
  const [updateEvent, setUpdateEvent] = useState(false);
  const [error, setError] = useState(null);

  const [museum, setMuseum] = useState([]);

  const { data: session, status } = useSession();

  const router = useRouter();

  const stateEvent = ["Pendiente", "En curso", "Finalizado"];

  const handleEditImage = async (file) => {
    if (file) {
      const imageUrlRemove = itemImage.image.imageUrlNew;
      const imageUrl = URL.createObjectURL(file);
      setItemImage({
        image: { imageUrlNew: imageUrl, imageUrlRemove },
        file,
      });
    }
  };

  const getMuseumAndEvent = async () => {
    try {
      const resMuseums = await axios.get("/api/admin/museum");
      const { data: museums } = resMuseums;

      const filterMuseumActived = museums
        .filter((museum) => museum.estado === "activo")
        .map((museum) => {
          const idBuffer = Buffer.from(museum.id.data);
          const idString = idBuffer.toString("hex");
          return { ...museum, id: idString };
        });

      const resEvent = await axios.get(`/api/admin/event/${params.id}`);
      const { data: event } = resEvent;

      const idBuffer = Buffer.from(event.museo_id.data);
      const idString = idBuffer.toString("hex");

      const fecha = new Date(event.fecha);

      // Formatea la fecha en el formato "YYYY-MM-DD"
      const fechaFormateada = fecha.toISOString().split("T")[0];

      const [hoursInit, minutesInit] = event.hora_inicio.split(":");
      const [hoursFinally, minutesFinally] = event.hora_fin.split(":");

      setIdMuseum(idString);
      setName(event.nombre);
      setDescription(event.descripcion);
      setEventDate(parseDate(fechaFormateada));
      setEventTimeInit(new Time(hoursInit, minutesInit));
      setEventTimeFinally(new Time(hoursFinally, minutesFinally));
      setPrice(event.precio);
      setTypeEvent(event.tipo_evento);
      setCapacity(event.capacidad.toString());
      setState(event.estado);
      setItemImage({ image: { imageUrlNew: event.imagenURL }, file: null });

      // Actualizar la lista de museos activos
      setMuseum(filterMuseumActived);

      setLoading(false);
    } catch (error) {
      console.error("Error, intenta más tarde: ", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateEvent(true);

    try {
      eventSchema.parse({
        idMuseum,
        name,
        description,
        eventDate: eventDate ? "Fecha" : "",
        eventTimeInit: eventTimeInit ? "Time" : "",
        eventTimeFinally: eventTimeFinally ? "Time" : "",
        price,
        typeEvent,
        capacity,
        state,
      });

      setError(null);

      const formData = new FormData();

      formData.append("id", params.id);

      if (itemImage.file) {
        formData.append("image", itemImage.file);
        formData.append("imageUrlRemove", itemImage.image.imageUrlRemove);
      } else {
        formData.append("image", itemImage.image.imageUrlNew);
        formData.append("imageUrlRemove", itemImage.image.imageUrlRemove);
      }

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
          eventTimeInit,
          state,
          eventTimeFinally,
        })
      );

      const res = await axios.put("/api/admin/event", formData);

      const { message } = res.data;

      if (message === "Evento actualizado") {
        toast.success(message, {
          style: {
            backgroundColor: "#DCDCDC",
            color: "#000000",
            border: "1px solid #000000",
            padding: "16px",
          },
          iconTheme: {
            primary: "#000000",
            secondary: "#FFFFFF",
          },
        });
        router.push("/admin/dashboard/events");
      } else {
        toast.error(message, {
          style: {
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            border: "1px solid #FF0000",
            padding: "16px",
          },
          iconTheme: {
            primary: "#FF0000",
            secondary: "#FFFFFF",
          },
        });
      }

      setUpdateEvent(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdateEvent(false);
    }
  };

  const handleDelete = async () => {
    setDeleteEvent(true);

    const formData = new FormData();
    formData.append("id", params.id);
    formData.append(
      "imageUrlRemove",
      itemImage.image.imageUrlRemove || itemImage.image.imageUrlNew
    );

    try {
      const res = await axios.delete("/api/admin/event", { data: formData });
      const { message } = res.data;

      if (message === "Evento eliminado") {
        toast.success(message, {
          style: {
            backgroundColor: "#DCDCDC",
            color: "#000000",
            border: "1px solid #000000",
            padding: "16px",
          },
          iconTheme: {
            primary: "#000000",
            secondary: "#FFFFFF",
          },
        });
        router.push("/admin/dashboard/events");
      } else {
        toast.error(message, {
          style: {
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            border: "1px solid #FF0000",
            padding: "16px",
          },
          iconTheme: {
            primary: "#FF0000",
            secondary: "#FFFFFF",
          },
        });
      }

      setDeleteEvent(false);
    } catch (error) {
      console.log("Error, intentar más tarder: ", error);
      setDeleteEvent(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getMuseumAndEvent();
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
          <h2 className="text-center font-bold text-3xl mb-5">
            ACTUALIZAR EVENTO
          </h2>
          <div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <Input
                isDisabled={updateEvent || deleteEvent}
                isClearable
                type="text"
                label="Nombre"
                value={name}
                onValueChange={setName}
                isInvalid={error?.some((error) => error.name)}
                errorMessage={error?.find((error) => error.name)?.name}
              />
              <Textarea
                isDisabled={updateEvent || deleteEvent}
                label="Descripción"
                value={description}
                onValueChange={setDescription}
                isInvalid={error?.some((error) => error.description)}
                errorMessage={
                  error?.find((error) => error.description)?.description
                }
              />
              <Autocomplete
                isDisabled={updateEvent || deleteEvent}
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
                isDisabled={updateEvent || deleteEvent}
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
              <DateInput
                isDisabled={updateEvent || deleteEvent}
                label={"Fecha del evento"}
                value={eventDate}
                onChange={setEventDate}
                isInvalid={error?.some((error) => error.eventDate)}
                errorMessage={
                  error?.find((error) => error.eventDate)?.eventDate
                }
              />
              <div className="flex gap-5">
                <TimeInput
                  isDisabled={updateEvent || deleteEvent}
                  label="Hora inicio"
                  value={eventTimeInit}
                  onChange={setEventTimeInit}
                  isRequired={error?.some((error) => error.eventTimeInit)}
                />
                <TimeInput
                  isDisabled={updateEvent || deleteEvent}
                  label="Hora fin"
                  value={eventTimeFinally}
                  onChange={setEventTimeFinally}
                  isRequired={error?.some((error) => error.eventTimeFinally)}
                />
              </div>
              <div className="flex gap-5">
                <Input
                  isDisabled={updateEvent || deleteEvent}
                  isClearable
                  type="number"
                  label="Precio"
                  value={price}
                  onValueChange={setPrice}
                  isInvalid={error?.some((error) => error.price)}
                  errorMessage={error?.find((error) => error.price)?.price}
                />
                <Input
                  isDisabled={updateEvent || deleteEvent}
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
              <Autocomplete
                isDisabled={updateEvent || deleteEvent}
                label="Estado del museo"
                selectedKey={state}
                onSelectionChange={(e) => {
                  if (e === null) {
                    setState("");
                  } else {
                    setState(e);
                  }
                }}
                isInvalid={error?.some((error) => error.state)}
                errorMessage={error?.find((error) => error.state)?.state}
              >
                {stateEvent.length > 0 &&
                  stateEvent.map((estado) => (
                    <AutocompleteItem key={estado}>{estado}</AutocompleteItem>
                  ))}
              </Autocomplete>
              <Card
                shadow="sm"
                isPressable
                isDisabled={updateEvent || deleteEvent}
              >
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleEditImage(e.target.files[0])}
                  />
                  <CardBody className="flex flex-col items-center">
                    <p className="text-lg font-semibold">
                      {itemImage?.image.imageUrlNew
                        ? "Cambiar imagen"
                        : "Cargar imagen"}
                    </p>
                    {itemImage?.image.imageUrlNew ? (
                      <Image
                        shadow="sm"
                        radius="lg"
                        alt={itemImage?.image.imageUrlNew}
                        className="object-cover h-[200px] w-[500px]"
                        src={itemImage?.image.imageUrlNew}
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
                isDisabled={deleteEvent}
                isLoading={updateEvent}
                variant="shadow"
                type="submit"
                className="w-full bg-black"
              >
                <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                  {updateEvent ? "Actualizando..." : "Actualizar"}
                </p>
              </Button>
              <Button
                isDisabled={updateEvent}
                isLoading={deleteEvent}
                variant="shadow"
                type="buttom"
                className="w-full bg-red-500"
                onPress={handleDelete}
              >
                <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                  {deleteEvent ? "Eliminando..." : "Eliminar"}
                </p>
              </Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UpdateEventsPage;
