/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { useSession } from "next-auth/react";
import { formatearFecha } from "@/utils/formateDate";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import Link from "next/link";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/admin/user");
      const { data } = res;

      const updateData = data.map((users) => {
        const idBuffer = Buffer.from(users.id.data);
        const idString = idBuffer.toString("hex");

        const fecha_registro = formatearFecha(users.fecha_registro);

        return { ...users, id: idString, fecha_registro };
      });

      setUsers(updateData);
      setLoading(false);
    } catch (error) {
      console.log("Error, intentar más tarde: " + error.message);
    }
  };

  // Definición de las columnas de encabezado de la tabla, especificando la clave y la etiqueta para cada columna.
  const headerColumns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "name",
      label: "NOMBRE",
    },
    {
      key: "type",
      label: "TIPO",
    },
    {
      key: "actions",
      label: "ACCIONES",
    },
  ];

  // Opciones de estado disponibles para el filtro, representando roles de usuario.
  const statusOptions = [
    { name: "Admin", uid: true },
    { name: "Usuario", uid: false },
  ];

  // Determina si hay un filtro de búsqueda activo, basado en si el valor del filtro es verdadero (no vacío).
  const hasSearchFilter = Boolean(filterValue);

  // Número de filas por página para la paginación.
  const rowsPerPage = 10;

  // Filtra la lista de usuarios según el filtro de búsqueda y estado, memorizando el resultado para optimizar el rendimiento.
  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) => {
        let filterAdmin;

        if (user.usuario_admin === 1) {
          filterAdmin = "true";
        } else {
          filterAdmin = "false";
        }

        return Array.from(statusFilter).includes(filterAdmin);
      });
    }

    return filteredUsers;
  }, [users, hasSearchFilter, statusFilter, statusOptions.length, filterValue]);

  // Calcula el número total de páginas basado en la cantidad de elementos filtrados y el número de filas por página.
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // useMemo para calcular y memorizar el subconjunto de usuarios que se mostrarán en la página actual.
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

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
        return <p className="font-bold text-tiny capitalize">{user.id}</p>;
      case "name":
        return <p className="font-bold text-tiny capitalize">{user.nombre}</p>;
      case "type":
        return (
          <Chip
            className={
              user.usuario_admin === 1
                ? "bg-black text-white shadow-large"
                : "bg-white text-black shadow-large"
            }
            size="sm"
            variant="shadow"
          >
            {user.usuario_admin === 1 ? "Admin" : "Usuario"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-center">
            <Tooltip content="Editar">
              <Link
                href={`/admin/dashboard/users/${user.id}`}
                className="text-lg text-black cursor-pointer active:opacity-50"
              >
                <EyeIcon />
              </Link>
            </Tooltip>
          </div>
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
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="shadow"
                >
                  TIPO
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de tabla"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onClear, onSearchChange, statusFilter, statusOptions]);

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
    if (status === "authenticated") {
      if (session?.user.usuario_admin === 1) {
        getUsers();
      } else {
        return router.push("/admin");
      }
    } else if (status === "unauthenticated") {
      return router.push("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.usuario_admin, status]);

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-center font-bold text-2xl">Cargando...</p>
      ) : (
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
                key={item._id}
                emptyContent={"No hay usuarios registrados."}
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </DashboardLayout>
  );
};

export default UsersPage;
