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
    <div className='flex'>
      <MainSidebar />
      <main className="flex-1">
        <div  style={{ height: 2000 }}/>
      </main>
    </div>
  )
}
