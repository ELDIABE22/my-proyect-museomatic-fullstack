"use client";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

const UpdateCollectionPage = ({ params }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [idMuseum, setIdMuseum] = useState("");
  const [typeCollection, setTypeCollection] = useState("");
  const [website, setWebsite] = useState("");
  const [itemImage, setItemImage] = useState({ file: null });
  const [error, setError] = useState(null);
  const [updateCollection, setUpdateCollection] = useState(false);
  const [loading, setLoading] = useState(true);

  const [museum, setMuseum] = useState([]);

  const { data: session, status } = useSession();

  const router = useRouter();

  const typesCollection = [
    "Arte",
    "Historia",
    "Ciencias Naturales",
    "Antropología",
    "Arqueología",
    "Etnografía",
    "Fotografía",
    "Arquitectura",
    "Artes Decorativas",
    "Artes Visuales",
    "Botánica",
    "Geología",
    "Zoología",
    "Mineralogía",
    "Paleontología",
    "Religión",
    "Filatelia",
    "Numismática",
    "Herbario",
    "Insectario",
    "Ornitario",
    "Entomología",
    "Hidrobiología",
    "Ictiología",
    "Lacustrología",
    "Malacología",
    "Micología",
    "Myrmecología",
    "Nematología",
    "Odonatología",
    "Pentatomología",
    "Quelonología",
    "Rinología",
    "Serpentología",
    "Tetrapodología",
    "Urodeología",
    "Vespertiliología",
    "Xilofagia",
    "Árboles",
    "Flora",
    "Fauna",
    "Minerales",
    "Fósiles",
    "Ecoetología",
    "Conservación",
    "Investigación",
    "Educación",
    "Exposiciones Temporales",
    "Eventos Especiales",
  ];

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

  const getMuseumAndCollection = async () => {
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

      const resCollection = await axios.get(
        `/api/admin/collection/${params.id}`
      );
      const { data: collection } = resCollection;

      const idBuffer = Buffer.from(collection.museo_id.data);
      const idString = idBuffer.toString("hex");

      setIdMuseum(idString);
      setName(collection.nombre);
      setDescription(collection.descripcion);
      setTypeCollection(collection.tipo_articulo);
      setWebsite(collection.sitio_web);
      setItemImage({ image: { imageUrlNew: collection.imageURL }, file: null });

      // Actualizar la lista de museos activos
      setMuseum(filterMuseumActived);

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      console.error("Error, intenta más tarde: ", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateCollection(true);
    try {
      collectionSchema.parse({
        idMuseum,
        name,
        description,
        typeCollection,
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
          typeCollection,
          website,
        })
      );

      const res = await axios.put("/api/admin/collection", formData);

      const { message } = res.data;

      if (message === "Colección actualizada") {
        alert(message);
        router.push("/admin/dashboard/articles");
      } else {
        alert(message);
      }

      setUpdateCollection(false);
    } catch (error) {
      console.log(error);
      const errors = error?.errors?.map((error) => error.message);
      setError(errors);
      setUpdateCollection(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getMuseumAndCollection();
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
            ACTUALIZAR COLECCIÓN
          </h2>
          <div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <Input
                isDisabled={updateCollection}
                isClearable
                type="text"
                label="Nombre"
                value={name}
                onValueChange={setName}
                isInvalid={error?.some((error) => error.name)}
                errorMessage={error?.find((error) => error.name)?.name}
              />
              <Textarea
                isDisabled={updateCollection}
                label="Descripción"
                value={description}
                onValueChange={setDescription}
                isInvalid={error?.some((error) => error.description)}
                errorMessage={
                  error?.find((error) => error.description)?.description
                }
              />
              <Autocomplete
                isDisabled={updateCollection}
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
                isDisabled={updateCollection}
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
                isDisabled={updateCollection}
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
                isLoading={updateCollection}
                variant="shadow"
                type="submit"
                className="w-full bg-black"
              >
                <p className="text-white font-semibold text-lg w-full tracking-widest hover:scale-110 transform transition-transform duration-[0.2s] ease-in-out">
                  {updateCollection ? "Actualizando..." : "Actualizar"}
                </p>
              </Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UpdateCollectionPage;
