"use client"

import { fetchUserRepos, getUserId, getUsername } from "@/utils/github";
import styles from '../../styles/newpost.module.css';
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
      } else if (status === 'unauthenticated') { // redirect to login page if no user logged in
        router.push('/');
      }
    })();
  }, [status]);

  return (
    <div className="flex justify-center h-full">
      <div className="w-full py-4 flex flex-col" style={{ maxWidth: 960 }}>
        {/* title */}
        <h1 className="text-xl border-b py-4 px-2 font-bold">New post</h1>
        {/* body */}
        <div className="py-4 px-2 flex flex-1">
          {/* editor */}
          <div className="flex-1">
            <div className={styles.inputGroup}>
              <h3 className="font-bold m-1">Title</h3>
              <input placeholder="Title"/>
            </div>
            <div className={styles.inputGroup} style={{ marginTop: 8 }}>
              <h3 className="font-bold m-1">Description</h3>
              {/* markdown */}
            </div>
          </div>
          {/* labels */}
          <div className="w-56 ml-4 box-border">
            
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default NewPost;