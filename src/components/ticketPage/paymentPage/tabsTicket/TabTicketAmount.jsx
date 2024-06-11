import {
  Card,
  CardBody,
  Input,
  CardHeader,
  Divider,
  CardFooter,
  Button,
} from "@nextui-org/react";

const TabTicketAmount = ({
  ticketAmount,
  setTicketAmount,
  error,
  confirmTicketAmount,
}) => {
  return (
    <Card>
      <CardHeader className="text-2xl font-semibold">
        Cantidad de tickets
      </CardHeader>
      <Divider />
      <CardBody>
        <Input
          type="number"
          autoComplete="off"
          label="Cantidad"
          isClearable
          value={ticketAmount}
          onValueChange={setTicketAmount}
          isInvalid={error?.some((error) => error.ticketAmount)}
          errorMessage={
            error?.find((error) => error.ticketAmount)?.ticketAmount
          }
        />
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          onPress={confirmTicketAmount}
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

export default TabTicketAmount;
