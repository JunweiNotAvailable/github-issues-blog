"use client"

import { getUserFromUrl } from "@/utils/github";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();
  const { data: session, status } = useSession();

  // handle status change
  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        const username = (await getUserFromUrl(session.user?.image as string)).login;
        router.replace(`/${username}`);
      })();
    }
  }, [status]);

  return (
    status === 'unauthenticated' &&
    <div className='flex flex-1 items-center justify-center flex-col'>      
      <div className="font-bold text-3xl text-center">Create content with Github issues</div>
      <div></div>
      <button className="black-button text-lg px-6 py-1 mt-4" onClick={() => signIn('github')}>Log in</button>
    </div>
  )
}
