import { useRouter } from "next/navigation";
import { typesEvents } from "@/utils/autocompleteData";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  DateInput,
  Image,
  Input,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { eventSchema } from "@/utils/zod";

const TabUpdate = ({ event, museum, getMuseumAndEvent }) => {
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

  const [deleteEvent, setDeleteEvent] = useState(false);
  const [updateEvent, setUpdateEvent] = useState(false);
  const [error, setError] = useState(null);

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

      formData.append("id", event.id);

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

      getMuseumAndEvent();
    } catch (error) {
      console.log(error.message);
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
    } finally {
      setUpdateEvent(false);
    }
  };

  const handleDelete = async () => {
    setDeleteEvent(true);

    const formData = new FormData();
    formData.append("id", event.id);
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

      router.push("/admin/dashboard/events");
    } catch (error) {
      console.log("Error, intentar más tarder: ", error);
    } finally {
      setDeleteEvent(false);
    }
  };

  useEffect(() => {
    setIdMuseum(event.museo_id);
    setName(event.nombre);
    setDescription(event.descripcion);
    setEventDate(event.fecha);
    setEventTimeInit(event.hora_inicio);
    setEventTimeFinally(event.hora_fin);
    setPrice(event.precio);
    setTypeEvent(event.tipo_evento);
    setCapacity(event.capacidad.toString());
    setState(event.estado);
    setItemImage({ image: { imageUrlNew: event.imagenURL }, file: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <h2 className="text-center font-bold text-3xl mb-5">ACTUALIZAR EVENTO</h2>
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
            errorMessage={error?.find((error) => error.typeEvent)?.typeEvent}
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
            errorMessage={error?.find((error) => error.eventDate)?.eventDate}
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
              errorMessage={error?.find((error) => error.capacity)?.capacity}
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
          <Card shadow="sm" isPressable isDisabled={updateEvent || deleteEvent}>
            <label className="w-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleEditImage(e.target.files[0])}
              />
              <CardBody className="flex flex-col items-center">
                <p className="text-lg font-semibold">
                  {itemImage?.image?.imageUrlNew
                    ? "Cambiar imagen"
                    : "Cargar imagen"}
                </p>
                {itemImage?.image?.imageUrlNew ? (
                  <Image
                    shadow="sm"
                    radius="lg"
                    alt={itemImage?.image?.imageUrlNew}
                    className="object-cover h-[200px] w-[500px]"
                    src={itemImage?.image?.imageUrlNew}
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
    </section>
  );
};

export default TabUpdate;
