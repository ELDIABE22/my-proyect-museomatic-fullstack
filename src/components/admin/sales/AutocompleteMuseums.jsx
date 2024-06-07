import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";

const AutocompleteMuseums = ({
  museum,
  idMuseum,
  setIdMuseum,
  searchSales,
  handleSearchTicket,
  error,
}) => {
  return (
    <>
      <Autocomplete
        isDisabled={searchSales}
        label="Buscar por museo"
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
            <AutocompleteItem key={estado.id}>{estado.nombre}</AutocompleteItem>
          ))}
      </Autocomplete>
      <Button
        isLoading={searchSales}
        isIconOnly
        color="default"
        variant="faded"
        aria-label="Search"
        radius="none"
        onPress={handleSearchTicket}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          height={24}
          color={"#0d0d0d"}
          fill={"none"}
        >
          <path
            d="M17.5 17.5L22 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </>
  );
};

export default AutocompleteMuseums;
