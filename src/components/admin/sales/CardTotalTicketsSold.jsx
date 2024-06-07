import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

const CardTotalTicketsSold = ({ ticketSale, searchTicketSale }) => {
  return (
    <Card className="max-w-[350px] w-full">
      <CardHeader className="flex gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          height={24}
          color={"#0d0d0d"}
          fill={"none"}
        >
          <path
            d="M17.5 5C18.3284 5 19 5.67157 19 6.5C19 7.32843 18.3284 8 17.5 8C16.6716 8 16 7.32843 16 6.5C16 5.67157 16.6716 5 17.5 5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M13.7884 12.3665C13.8097 11.9655 13.9222 11.232 13.3125 10.6744M13.3125 10.6744C13.1238 10.5019 12.866 10.3462 12.5149 10.2225C11.2583 9.77958 9.71484 11.2619 10.8067 12.6188C11.3936 13.3482 11.8461 13.5725 11.8035 14.4008C11.7735 14.9834 11.2012 15.5922 10.4469 15.824C9.7916 16.0255 9.06876 15.7588 8.61156 15.2479C8.05332 14.6241 8.1097 14.0361 8.10492 13.7798M13.3125 10.6744L14.0006 9.98633M8.66131 15.3256L8.00781 15.9791"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex flex-col">
          <p className="text-md font-bold">Tickets</p>
          <p className="text-small text-default-500">
            Total de tickets vendidos
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex justify-center">
          <p className="font-bold text-2xl">
            {ticketSale?.total_ventas &&
              parseFloat(ticketSale?.total_ventas).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            {searchTicketSale?.total_ventas &&
              !ticketSale?.total_ventas &&
              parseFloat(searchTicketSale?.total_ventas).toLocaleString(
                "es-CO",
                {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            {!searchTicketSale?.total_ventas &&
              !ticketSale?.total_ventas &&
              parseFloat(0).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardTotalTicketsSold;
