"use client";

import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <div className="w-64 h-screen bg-base-200 text-base-content flex flex-col">
        {/* Menú eliminado */}
      </div>
    </div>
  );
}
