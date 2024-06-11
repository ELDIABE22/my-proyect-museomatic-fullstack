import { Button, Card, CardBody, DatePicker } from "@nextui-org/react";
import { useMemo, useState } from "react";
import {
  formatearFecha,
  getDaysInMonth,
  isLeapYear,
  parseEventDate,
} from "@/utils/formateDate";
import CardEvent from "./cardEvent/CardEvent";

const TabEvent = ({ events }) => {
  const [date, setDate] = useState(null);

  // Filtra eventos según la fecha seleccionada
  const filteredEvents = useMemo(() => {
    if (!date) return events;

    const dateFormate = formatearFecha(date);
    const parsedDate = parseEventDate(dateFormate);

    let day = parsedDate.getDate();
    let monthIndex = parsedDate.getMonth();
    const year = parsedDate.getFullYear();

    day += 1;
    if (day > getDaysInMonth(monthIndex, isLeapYear(year))) {
      day = 1;
      monthIndex += 1;
    }

    const updatedDateString = `${day} ${
      [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ][monthIndex]
    } ${year}`;

    return events.filter((event) => {
      return event.fecha === updatedDateString;
    });
  }, [date, events]);

  return (
    <div>
      <p className="text-lg font-bold text-center mb-5">Eventos</p>
      <div className="flex flex-col gap-5 justify-center">
        {events.length > 0 ? (
          <>
            <Card className="w-max ml-3">
              <CardBody>
                <div className="flex gap-1 items-end">
                  <DatePicker
                    labelPlacement="outside"
                    label="Buscar por fecha"
                    value={date}
                    onChange={setDate}
                    className="max-w-[284px]"
                  />
                  <Button
                    isDisabled={!date}
                    isIconOnly
                    color="default"
                    variant="light"
                    aria-label="delete"
                    onPress={() => setDate(null)}
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
                        d="M19.0005 4.99988L5.00045 18.9999M5.00045 4.99988L19.0005 18.9999"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              </CardBody>
            </Card>

            <div className="flex gap-5 justify-center flex-wrap">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((ev) => (
                  <CardEvent key={ev.id} events={ev} />
                ))
              ) : (
                <p className="text-2xl font-bold">No se encontraron eventos.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-3xl font-bold">
            El museo no tiene eventos.
          </p>
        )}
      </div>
    </div>
  );
};

export default TabEvent;
