import Link from "next/link";
import AdminIcon from "./icons/AdminIcon";
import QueueList from "./icons/QueueList";
import Users from "./icons/Users";
import Museums from "./icons/Museums";
import EventCalendary from "./icons/EventCalendary";
import BookOpen from "./icons/BookOpen";
import { usePathname } from "next/navigation";
import ArrowUturnLeft from "./icons/ArrowUturnLeft";

const NavbarDashboard = () => {
  const inactiveLink = "flex gap-1 p-1";
  const activeLink =
    inactiveLink + " bg-platinum font-bold text-black rounded-l-lg";

  const pathname = usePathname();

  const isActive = (href) => pathname.includes(href);

  return (
    <aside className="text-white p-4 pr-0">
      <Link href={"/admin/dashboard"} className="flex gap-1 mb-4 mr-4">
        <AdminIcon />
        <span className="font-bold">MUSEOMATIC - ADMIN</span>
      </Link>
      <nav>
        <div className="flex flex-col gap-3 mb-5">
          <Link
            href={"/admin/dashboard/museums"}
            className={
              isActive("/admin/dashboard/museums") ? activeLink : inactiveLink
            }
          >
            <Museums />
            Museos
          </Link>
          <Link
            href={"/admin/dashboard/events"}
            className={
              isActive("/admin/dashboard/events") ? activeLink : inactiveLink
            }
          >
            <EventCalendary />
            Eventos
          </Link>
          <Link
            href={"/admin/dashboard/articles"}
            className={
              isActive("/admin/dashboard/articles") ? activeLink : inactiveLink
            }
          >
            <BookOpen />
            Colecciones
          </Link>
          <Link
            href={"/admin/dashboard/users"}
            className={
              isActive("/admin/dashboard/users") ? activeLink : inactiveLink
            }
          >
            <Users />
            Usuarios
          </Link>
          <Link
            href={"/admin/dashboard/sales"}
            className={
              isActive("/admin/dashboard/sales") ? activeLink : inactiveLink
            }
          >
            <QueueList />
            Ventas
          </Link>
        </div>
        <Link
          href={"/museums"}
          className="flex gap-1 p-1 bg-platinum font-bold text-black rounded-l-lg"
        >
          <ArrowUturnLeft />
          Volver al museo
        </Link>
      </nav>
    </aside>
  );
};

export default NavbarDashboard;
