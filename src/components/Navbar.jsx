"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "./icons/SearchIcon";
import { signOut, useSession } from "next-auth/react";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
  User,
} from "@nextui-org/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  return (
    <header className="flex flex-col gap-3 p-3 bg-platinum shadow-large">
      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-around">
        <div className="flex justify-center">
          <p className="text-4xl font-bold">MUSEOMATIC</p>
        </div>
        <div className="flex gap-3 justify-center">
          {status === "loading" && <Spinner color="white" />}

          {status === "authenticated" && (
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                  }}
                  className="transition-transform"
                  description={session?.user.usuario_admin === 1 && "Admin"}
                  name={session?.user.nombre}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">{session?.user.email}</p>
                </DropdownItem>
                {session?.user.usuario_admin === 1 && (
                  <DropdownItem
                    key="admin"
                    className="text-primary"
                    color="primary"
                    onPress={() => router.push("/admin/dashboard")}
                  >
                    Admin
                  </DropdownItem>
                )}
                <DropdownItem key="tickets">Tiquetes</DropdownItem>
                <DropdownItem key="settings">Configuración</DropdownItem>
                <DropdownItem
                  key="signoff"
                  className="text-danger"
                  color="danger"
                  onPress={signOut}
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
        <div className="w-full">
          <Select
            size="sm"
            radius="sm"
            label="Ciudad"
            className="max-w-full sm:max-w-[120px] shadow-xl"
          >
            <SelectItem key="Barranquilla" value="Barranquilla">
              Barranquilla
            </SelectItem>
            <SelectItem key="Bogotá" value="Bogotá">
              Bogotá
            </SelectItem>
          </Select>
        </div>
        <div className="w-full sm:min-w-[350px]">
          <Input
            isClearable
            type="text"
            radius="sm"
            size="sm"
            label="Buscar"
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            classNames={{
              inputWrapper: ["shadow-xl"],
            }}
          />
        </div>
        <div className="w-full sm:text-right">
          <Select
            size="sm"
            radius="sm"
            label="Horario"
            className="max-w-full sm:max-w-[120px] shadow-xl"
          >
            <SelectItem key="Abierto" value="Abierto">
              Abierto
            </SelectItem>
            <SelectItem key="Cerrado" value="Cerrado">
              Cerrado
            </SelectItem>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
