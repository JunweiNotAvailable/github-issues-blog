"use client"

import MainSidebar from "@/components/MainSidebar";
import { getIssues } from "@/utils/github";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {

  const { data: session, status } = useSession();

  // initial load
  useEffect(() => {
    (async () => {
      
    })();
  }, []);

  return (
    <div className="flex py-2 h-full box-border">
      <MainSidebar />
      <main>
        
      </main>
    </div>
  )
}
