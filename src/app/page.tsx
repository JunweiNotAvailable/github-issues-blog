"use client"

import MainSidebar from "@/components/MainSidebar";
import { useSession } from "next-auth/react";

export default function Home() {

  const { data: session, status } = useSession();

  return (
    <div className="flex py-2 h-full box-border">
      <MainSidebar />
      <main>
        
      </main>
    </div>
  )
}
