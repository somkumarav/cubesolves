"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaTh,
  FaAward,
  FaInfoCircle,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { JSX } from "react";

type Route = {
  name: string;
  link: string;
  icon: JSX.Element;
};

export const NavBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const routes: Route[] = [
    {
      name: "Home",
      link: "/",
      icon: <FaTh size={20} />,
    },

    {
      name: "Leaderboard",
      link: "/leaderboard",
      icon: <FaAward size={20} />,
    },

    {
      name: "About",
      link: "/about",
      icon: <FaInfoCircle size={20} />,
    },

    {
      name: "Setting",
      link: "/settings",
      icon: <FaCog size={20} />,
    },

    session?.user?.image
      ? {
          name: "User",
          link: "/user",
          icon: (
            <Image
              src={session.user.image}
              width={20}
              height={20}
              alt=''
              className='h-[20px] w-[20px] rounded-full'
            />
          ),
        }
      : {
          name: "User",
          link: "/user",
          icon: <FaUserCircle size={20} />,
        },
  ];

  return (
    <div className='flex h-[5vh] w-full items-center justify-center gap-[50px]'>
      {routes.map((route) => {
        const active = pathname === route.link;
        return (
          <Link
            key={route.name}
            className={`${
              active ? "text-nav-bar" : "text-nav-bar-inactive"
            } cursor-pointer hover:text-nav-bar/90 transition-colors`}
            href={route.link}
          >
            {route.icon}
          </Link>
        );
      })}
    </div>
  );
};
