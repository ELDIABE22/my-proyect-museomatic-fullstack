"use client";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { typesCollection } from "@/utils/autocompleteData";
import { collectionSchema } from "@/utils/zod";
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
import toast from "react-hot-toast";

const NewCollectionPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [idMuseum, setIdMuseum] = useState("");
  const [typeCollection, setTypeCollection] = useState("");
  const [website, setWebsite] = useState("");
  const [itemImage, setItemImage] = useState({ file: null });
  const [error, setError] = useState(null);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [loading, setLoading] = useState(true);

  const [museum, setMuseum] = useState([]);

  const { data: session, status } = useSession();

  const router = useRouter();

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

  const handleEditImage = async (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItemImage({ image: imageUrl, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingCollection(true);
    try {
      collectionSchema.parse({
        idMuseum,
        name,
        description,
        typeCollection,
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
          typeCollection,
          website,
        })
      );

      const res = await axios.post("/api/admin/collection", formData);

      const { message } = res.data;

      if (message === "Colección agregado") {
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
        router.push("/admin/dashboard/articles");
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

      setCreatingCollection(false);
    } catch (error) {
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setCreatingCollection(false);
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
            CREAR COLECCIÓN
          </h2>
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                isDisabled={creatingCollection}
                isClearable
                type="text"
                label="Nombre"
                value={name}
                onValueChange={setName}
                isInvalid={error?.some((error) => error.name)}
                errorMessage={error?.find((error) => error.name)?.name}
              />
              <Textarea
                isDisabled={creatingCollection}
                label="Descripción"
                value={description}
                onValueChange={setDescription}
                isInvalid={error?.some((error) => error.description)}
                errorMessage={
                  error?.find((error) => error.description)?.description
                }
              />
              <Autocomplete
                isDisabled={creatingCollection}
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
                isDisabled={creatingCollection}
                label="Tipo de colección"
                selectedKey={typeCollection}
                onSelectionChange={(e) => {
                  if (e === null) {
                    setTypeCollection("");
                  } else {
                    setTypeCollection(e);
                  }
                }}
                isInvalid={error?.some((error) => error.typeCollection)}
                errorMessage={
                  error?.find((error) => error.typeCollection)?.typeCollection
                }
              >
                {typesCollection.length > 0 &&
                  typesCollection.map((estado) => (
                    <AutocompleteItem key={estado}>{estado}</AutocompleteItem>
                  ))}
              </Autocomplete>
              <Input
                isDisabled={creatingCollection}
                isClearable
                type="text"
                label="Sitio web"
                value={website}
                onValueChange={setWebsite}
              />

              <Card shadow="sm" isPressable isDisabled={creatingCollection}>
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
                isLoading={creatingCollection}
                variant="shadow"
                type="submit"
                className="w-full bg-black"
              >
                <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                  {creatingCollection ? "Creando..." : "Crear"}
                </p>
              </Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default NewCollectionPage;
