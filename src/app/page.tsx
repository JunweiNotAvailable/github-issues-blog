"use client"

import { getIssues } from "@/utils/github";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {

  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false); // prevent repeated loading

  // load posts when page updated
  useEffect(() => {
    (async () => {
      
    })();
  }, [page]);

  return (
    <div className='flex justify-center'>      
      <div className="flex py-10 w-full" style={{ maxWidth: 1024 }}>
        {/* posts */}
        <div className="flex-1">

        </div>
        {/* sidebar */}
        <div className="w-56 ml-8"></div>
      </div>
    </div>
  )
}
