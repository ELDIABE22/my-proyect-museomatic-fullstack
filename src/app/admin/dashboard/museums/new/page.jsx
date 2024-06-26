"use client";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { cityList } from "@/utils/autocompleteData";
import { useRouter } from "next/navigation";
import { TimeInput } from "@nextui-org/date-input";
import { DateInput } from "@nextui-org/date-input";
import { museumSchema } from "@/utils/zod";
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

const NewMuseumsPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [foundingDate, setFoundingDate] = useState(null);
  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);
  const [website, setWebsite] = useState("");
  const [itemImage, setItemImage] = useState({ file: null });
  const [error, setError] = useState(null);
  const [creatingMuseum, setCreatingMuseum] = useState(false);

  const router = useRouter();

  const handleEditImage = async (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItemImage({ image: imageUrl, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingMuseum(true);
    try {
      museumSchema.parse({
        name,
        description,
        address,
        foundingDate: foundingDate ? "Fecha" : "",
        openingTime: openingTime ? "Time" : "",
        closingTime: closingTime ? "Time" : "",
        city,
        entryPrice,
      });

      setError(null);

      const formData = new FormData();

      formData.append("image", itemImage.file);

      formData.append(
        "data",
        JSON.stringify({
          name,
          address,
          description,
          openingTime,
          closingTime,
          website,
          foundingDate,
          city,
          entryPrice,
        })
      );

      const res = await axios.post("/api/admin/museum", formData);

      const { message } = res.data;

      if (message === "Museo agregado") {
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
        router.push("/admin/dashboard/museums");
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

      setCreatingMuseum(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setCreatingMuseum(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-center font-bold text-3xl mb-5">AGREGAR MUSEO</h2>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              isDisabled={creatingMuseum}
              isClearable
              type="text"
              label="Nombre"
              value={name}
              onValueChange={setName}
              isInvalid={error?.some((error) => error.name)}
              errorMessage={error?.find((error) => error.name)?.name}
            />
            <Textarea
              isDisabled={creatingMuseum}
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
                isDisabled={creatingMuseum}
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
                isDisabled={creatingMuseum}
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
              isDisabled={creatingMuseum}
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
                isDisabled={creatingMuseum}
                label="Hora de apertura"
                value={openingTime}
                onChange={setOpeningTime}
                isRequired={error?.some((error) => error.openingTime)}
              />
              <TimeInput
                isDisabled={creatingMuseum}
                label="Hora de cierre"
                value={closingTime}
                onChange={setClosingTime}
                isRequired={error?.some((error) => error.closingTime)}
              />
            </div>
            <Input
              isDisabled={creatingMuseum}
              isClearable
              type="number"
              label="Precio entrada"
              value={entryPrice}
              onValueChange={setEntryPrice}
              isInvalid={error?.some((error) => error.entryPrice)}
              errorMessage={
                error?.find((error) => error.entryPrice)?.entryPrice
              }
            />
            <Input
              isDisabled={creatingMuseum}
              isClearable
              type="text"
              label="Sitio web"
              value={website}
              onValueChange={setWebsite}
            />

            <Card shadow="sm" isPressable isDisabled={creatingMuseum}>
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
              isLoading={creatingMuseum}
              variant="shadow"
              type="submit"
              className="w-full bg-black"
            >
              <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                {creatingMuseum ? "Agregando..." : "Agregar"}
              </p>
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewMuseumsPage;
