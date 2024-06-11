import { SearchIcon } from "@/components/icons/SearchIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

const TabAnalysis = ({ event }) => {
  console.log(event);
  const [userTicket, setUserTicket] = useState([]);
  console.log(userTicket);

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);

  // Definición de las columnas de encabezado de la tabla, especificando la clave y la etiqueta para cada columna.
  const headerColumns = [
    {
      key: "id",
      label: "TICKET",
    },
    {
      key: "name",
      label: "NOMBRE",
    },
    {
      key: "amount",
      label: "CANTIDAD",
    },
    {
      key: "total",
      label: "TOTAL",
    },
  ];

  // Determina si hay un filtro de búsqueda activo, basado en si el valor del filtro es verdadero (no vacío).
  const hasSearchFilter = Boolean(filterValue);

  // Número de filas por página para la paginación.
  const rowsPerPage = 5;

  // Filtra la lista de usuarios según el filtro de búsqueda y estado, memorizando el resultado para optimizar el rendimiento.
  const filteredItems = useMemo(() => {
    let filteredUsers = [...userTicket];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nombre_usuario.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [filterValue, hasSearchFilter, userTicket]);

  // Calcula el número total de páginas basado en la cantidad de elementos filtrados y el número de filas por página.
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // useMemo para calcular y memorizar el subconjunto de usuarios que se mostrarán en la página actual.
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems, page]);

  // useCallback para manejar el cambio en el valor de búsqueda, actualizando el valor del filtro y reiniciando la página a  1 si hay un valor de búsqueda.
  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  // useCallback para limpiar el valor del filtro y reiniciar la página a  1.
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // useCallback para renderizar celdas de la tabla basado en la clave de columna, aplicando estilos y componentes específicos.
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <p className="font-bold text-tiny capitalize">
            {user.numero_tickets}
          </p>
        );
      case "name":
        return (
          <p className="font-bold text-tiny capitalize">
            {user.nombre_usuario}
          </p>
        );
      case "amount":
        return (
          <p className="font-bold text-tiny capitalize">
            {user.cantidad_tickets}
          </p>
        );
      case "total":
        return (
          <p className="font-bold text-tiny capitalize">
            {parseFloat(user.total).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        );
      default:
        return cellValue;
    }
  }, []);

  // useMemo para renderizar el contenido superior de la tabla, incluyendo un campo de búsqueda y un menú desplegable para filtrar por rol.
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onClear, onSearchChange]);

  // useMemo para renderizar la paginación en la parte inferior de la página, permitiendo al usuario navegar entre páginas.
  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          showControls
          isCompact
          showShadow
          color="default"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, [page, pages]);

  useEffect(() => {
    if (event && event.usuarios_tickets) {
      const transformedTickets = event.usuarios_tickets.map((ticket) => {
        return {
          ...ticket,
          numero_tickets: Buffer.from(ticket.numero_tickets.data).toString(
            "hex"
          ),
        };
      });
      setUserTicket(transformedTickets);
    }
  }, [event]);

  return (
    <section>
      <h2 className="text-center font-bold text-3xl mb-5">
        ANÁLISIS DEL EVENTO
      </h2>
      <div className="flex flex-wrap gap-5 justify-center mb-5">
        {/* CARTA DE ASISTENCIA */}
        <Card>
          <CardHeader>
            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#0d0d0d"}
                fill={"none"}
              >
                <path
                  d="M15 5C15 6.65685 13.2418 8.5 12 8.5C10.7582 8.5 9 6.65685 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16.0415 9C17.5645 10.3353 18.5513 12.5969 17.6651 14.7052C17.4742 15.1594 17.0361 15.4539 16.5514 15.4539C16.0585 15.4539 15.2489 15.296 15.0917 15.9374L13.9944 20.4123C13.7656 21.3454 12.9433 22 12 22C11.0567 22 10.2344 21.3454 10.0056 20.4123L8.90833 15.9374C8.75103 15.296 7.94149 15.4539 7.44862 15.4539C6.9639 15.4539 6.52582 15.1594 6.33488 14.7052C5.44866 12.5969 6.43558 10.3353 7.95857 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <h2 className="text-center font-bold text-xl">Asistencias</h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-center font-semibold text-lg">
              El evento no ha empezado.
              {/* {event.length}/{event.capacidad} */}
            </p>
          </CardBody>
        </Card>
        {/* CARTA DE VENTAS DE ENTRADAS */}
        <Card>
          <CardHeader>
            <div className="flex gap-1">
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
              <h2 className="text-center font-bold text-xl">
                Ventas de entradas
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-center font-semibold text-2xl">
              {parseFloat(event.total_ventas).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardBody>
        </Card>
      </div>

      <Divider className="my-5" />

      {/* TABLA DE USUARIOS */}
      <div>
        <h2 className="text-center font-bold text-3xl mb-5">
          TICKETS COMPRADOS
        </h2>
        <Table
          aria-label="tabla de usuarios"
          className="mx-auto"
          topContent={topContent}
          bottomContent={bottomContent}
          removeWrapper
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow
                key={item.numero_tickets}
                emptyContent={"Ningún ticket comprado."}
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default TabAnalysis;
