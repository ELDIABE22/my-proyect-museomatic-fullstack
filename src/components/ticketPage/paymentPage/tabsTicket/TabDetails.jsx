import { EditIcon } from "@/components/icons/EditIcon";
import { Input, Button } from "@nextui-org/react";

const TabDetails = ({
  handleSubmit,
  name,
  confirmUser,
  ticketAmount,
  confirmTicketAmount,
  verifyingPayment,
  setName,
  error,
  cardNumber,
  handleInputChangeCardNumber,
  dateExpiry,
  setDateExpiry,
  cvv,
  setCvv,
  ticketTotal,
  confirmTicketType,
  confirmType,
}) => {
  return (
    <div className="w-fit h-fit bg-white shadow-lg rounded-lg max-w-[450px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-4">
          <div className="flex gap-1 justify-between items-center">
            <div className="flex gap-1">
              <p className="font-semibold">Nombre:</p>
              <span>{name}</span>
            </div>
            <span
              onClick={confirmUser}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EditIcon />
            </span>
          </div>
          <div className="flex gap-1 justify-between items-center">
            <div className="flex gap-1">
              <p className="font-semibold">Tickets:</p>
              <span>{ticketAmount}</span>
            </div>
            <span
              onClick={confirmTicketAmount}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EditIcon />
            </span>
          </div>
          <div className="flex gap-1 justify-between items-center">
            <div className="flex gap-1">
              <p className="font-semibold">Tipo de ticket:</p>
              <span>{confirmTicketType}</span>
            </div>
            <span
              onClick={confirmType}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EditIcon />
            </span>
          </div>
          <div className="w-full h-auto flex flex-col gap-1">
            <Input
              isDisabled={verifyingPayment}
              isClearable
              label="Nombre del titular de la tarjeta"
              labelPlacement="outside"
              autoComplete="off"
              type="text"
              variant="bordered"
              placeholder="Introduce tu nombre completo"
              value={name}
              onValueChange={setName}
              isInvalid={error?.some((error) => error.name)}
              errorMessage={error?.find((error) => error.name)?.name}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-1">
            <Input
              isDisabled={verifyingPayment}
              isClearable
              label="Número de tarjeta"
              labelPlacement="outside"
              autoComplete="off"
              type="text"
              maxLength={19}
              variant="bordered"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onValueChange={handleInputChangeCardNumber}
              isInvalid={error?.some((error) => error.cardNumber)}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-3">
              <Input
                isDisabled={verifyingPayment}
                isClearable
                label="Fecha de caducidad"
                labelPlacement="outside"
                autoComplete="off"
                type="text"
                maxLength={5}
                variant="bordered"
                placeholder="MM/AA"
                value={dateExpiry}
                onValueChange={setDateExpiry}
                isInvalid={error?.some((error) => error.dateExpiry)}
                errorMessage={
                  error?.find((error) => error.dateExpiry)?.dateExpiry
                }
              />
              <Input
                isDisabled={verifyingPayment}
                isClearable
                label="CVV"
                labelPlacement="outside"
                autoComplete="off"
                type="text"
                maxLength={3}
                variant="bordered"
                placeholder="CVV"
                max={16}
                value={cvv}
                onValueChange={setCvv}
                isInvalid={error?.some((error) => error.cvv)}
              />
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <p>TOTAL:</p>
            <span>
              {confirmTicketType === "Normal"
                ? (ticketTotal * ticketAmount).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ((ticketTotal + 25000) * ticketAmount).toLocaleString(
                    "es-CO",
                    {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
            </span>
          </div>
        </div>
        <Button
          isLoading={verifyingPayment}
          className="h-14 bg-gray rounded-lg border-0 outline-none text-white text-sm font-semibold bg-gradient-to-r from-gray-900 to-black shadow-lg transition-all duration-300 ease-in-out"
          type="submit"
        >
          PAGAR
        </Button>
      </form>
    </div>
  );
};

export default TabDetails;
