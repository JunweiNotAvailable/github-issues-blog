"use client"

import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";

export default function Home() {

  const { data: session, status } = useSession();

  return (
    <div className="flex py-2 h-full box-border">
      <Sidebar />
      <main></main>
    </div>
  )
}
