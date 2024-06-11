import {
  Card,
  CardBody,
  Input,
  CardHeader,
  Divider,
  CardFooter,
  Button,
} from "@nextui-org/react";

const TabName = ({ name, setName, error, confirmUser }) => {
  return (
    <Card>
      <CardHeader className="text-2xl font-semibold">
        Confirmar Nombre
      </CardHeader>
      <Divider />
      <CardBody>
        <Input
          type="text"
          autoComplete="off"
          label="Nombre"
          isClearable
          value={name}
          onValueChange={setName}
          isInvalid={error?.some((error) => error.name)}
          errorMessage={error?.find((error) => error.name)?.name}
        />
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          onPress={confirmUser}
          radius="none"
          variant="shadow"
          className="w-full"
        >
          Confirmar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TabName;
