"use client"

import { fetchUserRepos, getUserId, getUsername } from "@/utils/github";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NewPost = () => {

  const router = useRouter();
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    (async () => {
      if (status === 'authenticated') { // fetch data if user is logged in
        const username = await getUsername(session.user?.image as string);
        setRepos(await fetchUserRepos(username));
      } else if (status === 'unauthenticated') { // redirect to login page
        router.push('/');
      }
    })();
  }, [status]);

  return (
    <div>

    </div>
  );
}
 
export default NewPost;