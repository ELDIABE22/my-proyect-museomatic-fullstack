"use client";

import {
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import { SearchIcon } from "./icons/SearchIcon";
import { useRouter } from "next/navigation";
import { DeleteIcon } from "./icons/DeleteIcon";

const Navbar = () => {
  const router = useRouter();

  return (
    <header className="flex flex-col gap-3 p-3 bg-platinum">
      <div className="flex justify-between">
        <div className="flex items-center">
          <p className="text-3xl font-bold">MUSEOMATIC</p>
        </div>
        <div>
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
        <div className="flex gap-3 items-center">
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
        </div>
      </div>
      <Divider />
      <div className="flex justify-center items-center gap-2">
        <Select
          size="sm"
          radius="sm"
          label="Ciudad"
          className="max-w-[120px] shadow-xl"
        >
          <SelectItem key="Barranquilla" value="Barranquilla">
            Barranquilla
          </SelectItem>
          <SelectItem key="Bogotá" value="Bogotá">
            Bogotá
          </SelectItem>
        </Select>
        <Select
          size="sm"
          radius="sm"
          label="Horario"
          className="max-w-[120px] shadow-xl"
        >
          <SelectItem key="Abierto" value="Abierto">
            Abierto
          </SelectItem>
          <SelectItem key="Cerrado" value="Cerrado">
            Cerrado
          </SelectItem>
        </Select>
        <Tooltip content="Borrar filtrado" color="foreground">
          <Button isIconOnly color="danger" aria-label="Like">
            <DeleteIcon />
          </Button>
        </Tooltip>
      </div>
    </header>
  );
};

export default Navbar;
