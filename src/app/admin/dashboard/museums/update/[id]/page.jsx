"use client";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { cityList } from "@/utils/autocompleteData";
import { useRouter } from "next/navigation";
import { TimeInput } from "@nextui-org/date-input";
import { DateInput } from "@nextui-org/date-input";
import { useSession } from "next-auth/react";
import { museumSchema } from "@/utils/zod";
import { parseDate, Time } from "@internationalized/date";
import { useEffect, useState } from "react";
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

const UpdateMuseumPage = ({ params }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [foundingDate, setFoundingDate] = useState(null);
  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);
  const [website, setWebsite] = useState("");
  const [itemImage, setItemImage] = useState({ file: null });
  const [state, setState] = useState("");
  const [error, setError] = useState(null);

  const [deleteEvent, setDeleteEvent] = useState(false);
  const [updatedMuseum, setUpdateMuseum] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const router = useRouter();

  const estadoMuseo = ["Activo", "Inactivo"];

  const getMuseum = async () => {
    try {
      const res = await axios.get(`/api/admin/museum/${params.id}`);
      const { data } = res;

      const fecha = new Date(data.fecha_fundacion);

      // Formatea la fecha en el formato "YYYY-MM-DD"
      const fechaFormateada = fecha.toISOString().split("T")[0];

      const [hours_apertura, minutes_apertura] = data.hora_apertura.split(":");
      const [hours_cierre, minutes_cierre] = data.hora_cierre.split(":");

      setName(data.nombre);
      setDescription(data.descripcion);
      setAddress(data.direccion);
      setFoundingDate(parseDate(fechaFormateada));
      setOpeningTime(new Time(hours_apertura, minutes_apertura));
      setClosingTime(new Time(hours_cierre, minutes_cierre));
      setWebsite(data.sitio_web);
      setItemImage({ image: { imageUrlNew: data.imagenURL }, file: null });
      setState(data.estado === "activo" ? "Activo" : "Inactivo");
      setCity(data.ciudad);

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los museos:", error);
    }
  };

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
    setUpdateMuseum(true);
    try {
      museumSchema.parse({
        name,
        description,
        address,
        foundingDate: foundingDate ? "Fecha" : "",
        openingTime: openingTime ? "Time" : "",
        closingTime: closingTime ? "Time" : "",
        state,
        city,
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
          name,
          address,
          description,
          openingTime,
          closingTime,
          state,
          website,
          foundingDate,
          city,
        })
      );

      const res = await axios.put("/api/admin/museum", formData);

      const { message } = res.data;

      if (message === "Museo actualizado") {
        alert(message);
        router.push("/admin/dashboard/museums");
      } else {
        alert(message);
      }

      setUpdateMuseum(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdateMuseum(false);
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
      const res = await axios.delete("/api/admin/museum", { data: formData });
      const { message } = res.data;

      if (message === "Museo eliminado") {
        alert(message);
        router.push("/admin/dashboard/museums");
      } else {
        alert(message);
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
          <h2 className="text-center font-bold text-3xl mb-5">
            ACTUALIZAR MUSEO
          </h2>
          <div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <Input
                isDisabled={updatedMuseum}
                isClearable
                type="text"
                label="Nombre"
                value={name}
                onValueChange={setName}
                isInvalid={error?.some((error) => error.name)}
                errorMessage={error?.find((error) => error.name)?.name}
              />
              <Textarea
                isDisabled={updatedMuseum}
                label="Descripción"
                value={description}
                onValueChange={setDescription}
                isInvalid={error?.some((error) => error.description)}
                errorMessage={
                  error?.find((error) => error.description)?.description
                }
              />
              <div className="flex gap-5">
                <Autocomplete
                  isDisabled={updatedMuseum}
                  label="Ciudad"
                  selectedKey={city}
                  onSelectionChange={(e) => {
                    if (e === null) {
                      setCity("");
                    } else {
                      setCity(e);
                    }
                  }}
                  isInvalid={error?.some((error) => error.city)}
                  errorMessage={error?.find((error) => error.city)?.city}
                >
                  {cityList.length > 0 &&
                    cityList.map((estado) => (
                      <AutocompleteItem key={estado}>{estado}</AutocompleteItem>
                    ))}
                </Autocomplete>
                <Input
                  isDisabled={updatedMuseum}
                  isClearable
                  type="text"
                  label="Dirección"
                  value={address}
                  onValueChange={setAddress}
                  isInvalid={error?.some((error) => error.address)}
                  errorMessage={error?.find((error) => error.address)?.address}
                />
              </div>
              <DateInput
                isDisabled={updatedMuseum}
                label={"Fecha de fundación"}
                value={foundingDate}
                onChange={setFoundingDate}
                isInvalid={error?.some((error) => error.foundingDate)}
                errorMessage={
                  error?.find((error) => error.foundingDate)?.foundingDate
                }
              />
              <div className="flex gap-3">
                <TimeInput
                  isDisabled={updatedMuseum}
                  label="Hora de apertura"
                  value={openingTime}
                  onChange={setOpeningTime}
                  isRequired={error?.some((error) => error.openingTime)}
                />
                <TimeInput
                  isDisabled={updatedMuseum}
                  label="Hora de cierre"
                  value={closingTime}
                  onChange={setClosingTime}
                  isRequired={error?.some((error) => error.closingTime)}
                />
              </div>
              <Autocomplete
                isDisabled={updatedMuseum}
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
                {estadoMuseo.length > 0 &&
                  estadoMuseo.map((estado) => (
                    <AutocompleteItem key={estado}>{estado}</AutocompleteItem>
                  ))}
              </Autocomplete>
              <Input
                isDisabled={updatedMuseum}
                isClearable
                type="text"
                label="Sitio web"
                value={website}
                onValueChange={setWebsite}
              />
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
                      {itemImage?.image.imageUrlNew
                        ? "Cambiar imagen"
                        : "Cargar imagen"}
                    </p>
                    {itemImage?.image.imageUrlNew ? (
                      <Image
                        shadow="sm"
                        radius="lg"
                        alt={itemImage.image.imageUrlNew}
                        className="object-cover h-[200px] w-[500px]"
                        src={itemImage.image.imageUrlNew}
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
                isLoading={updatedMuseum}
                variant="shadow"
                type="submit"
                className="w-full bg-black"
              >
                <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                  {updatedMuseum ? "Actualizando..." : "Actualizar"}
                </p>
              </Button>
              <Button
                isDisabled={updatedMuseum}
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

export default UpdateMuseumPage;
