/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import { useMuseum } from "@/context/MuseumContext";
import { SearchIcon } from "./icons/SearchIcon";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
  User,
} from "@nextui-org/react";

const Navbar = ({ openModal, setOpenModal, user, loading, getUser }) => {
  const {
    museums,
    filterValue,
    statusFilterCity,
    statusFilterState,
    statusTime,
    setFilterValue,
    setStatusFilterCity,
    setStatusFilterState,
  } = useMuseum();

  const { status } = useSession();

  const router = useRouter();

  // useCallback para manejar el cambio en el valor de búsqueda, actualizando el valor del filtro.
  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  // useCallback para limpiar el valor del filtro
  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  useEffect(() => {
    getUser();
  }, [status]);

  return (
    <header className="flex flex-col gap-3 p-3 bg-platinum shadow-large">
      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-around">
        <div className="flex justify-center">
          <p className="text-4xl font-bold">MUSEOMATIC</p>
        </div>
        <div className="flex gap-3 justify-center">
          {status === "loading" && loading && <Spinner color="white" />}

          {status === "authenticated" && (
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                  }}
                  className="transition-transform"
                  description={user.usuario_admin === 1 && "Admin"}
                  name={user.nombre}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue={user.email}
                  onPress={() => setOpenModal(!openModal)}
                >
                  <p className="font-bold">{user.email}</p>
                </DropdownItem>
                {user.usuario_admin === 1 && (
                  <DropdownItem
                    key="admin"
                    className="text-primary"
                    color="primary"
                    onPress={() => router.push("/admin/dashboard")}
                    textValue="Admin"
                  >
                    Admin
                  </DropdownItem>
                )}
                <DropdownItem key="tickets" textValue="Tiquetes">
                  Tiquetes
                </DropdownItem>
                <DropdownItem
                  key="signoff"
                  className="text-danger"
                  color="danger"
                  onPress={signOut}
                  textValue="Cerrar Sesión"
                >
                  Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}

          {status === "unauthenticated" && (
            <>
              <Button
                radius="none"
                variant="ghost"
                onPress={() => router.push("/auth/login")}
                className="bg-white text-black"
              >
                Iniciar Sesión
              </Button>
              <Button
                radius="none"
                variant="shadow"
                onPress={() => router.push("/auth/register")}
                className="bg-black text-white"
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-5 sm:gap-0 sm:flex-row justify-between">
        <div className="w-full flex items-center">
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
                className="w-full sm:max-w-[120px] shadow-xl bg-white"
              >
                Ciudad
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columnas de tabla"
              closeOnSelect={false}
              selectionMode="multiple"
              selectedKeys={statusFilterCity}
              onSelectionChange={setStatusFilterCity}
            >
              {museums.map((mu) => (
                <DropdownItem key={mu.ciudad} className="capitalize">
                  {mu.ciudad}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="w-full sm:min-w-[350px]">
          <Input
            isClearable
            type="text"
            radius="sm"
            size="sm"
            label="Buscar"
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            classNames={{
              inputWrapper: ["shadow-xl bg-white"],
            }}
          />
        </div>
        <div className="w-full flex items-center justify-end">
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
                className="w-full sm:max-w-[120px] shadow-xl bg-white"
              >
                Horario
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columnas de tabla"
              closeOnSelect={false}
              selectionMode="multiple"
              selectedKeys={statusFilterState}
              onSelectionChange={setStatusFilterState}
            >
              {statusTime.map((mu) => (
                <DropdownItem key={mu.uid} className="capitalize">
                  {mu.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
