'use client'

import Post from "@/components/PostItem";
import { getUser, getUserFromUrl, getUserIssues, getUserRepos } from "@/utils/github";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Profile = () => {

  const { data: session, status } = useSession();
  const params = useParams();
  const { username } = params;
  // my data
  const [me, setMe] = useState<any | null>(null);
  // user's data
  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  // fetch user data 
  useEffect(() => {
    (async () => {
      // get user data
      const userData = await getUser(username as string);
      setUser(userData);
      // get posts
      const issues = await getUserIssues(username as string, page);
      setPosts(issues);
    })();
  }, []);

  // fetch authenticated user data
  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        const name = (await getUserFromUrl(session.user?.image as string)).login;
        const userData = await getUser(name);
        setMe(userData);
      })();
    }
  }, [status]);

  return (
    user &&
    <div className="flex justify-center">
      <div className="flex w-full py-12 px-4" style={{ maxWidth: 1024 }}>
        {/* user info */}
        <div className="w-72 pl-4 pr-8 py-2">
          <div>
            <div className="rounded-full overflow-hidden w-full aspect-square">
              <Image className="rounded-full w-full h-full border border-slate-300" priority alt="" src={user.avatar_url} width={512} height={512} />
            </div>
          </div>
          <div className="mx-2">
            <div className="text-2xl mt-4 font-bold overflow-ellipsis overflow-hidden">{user.name}</div> {/* user's display name */}
            <div className='text-gray-400 text-sm font-light overflow-ellipsis overflow-hidden'>{username}</div> {/* unique username */}
            <div className="text-sm my-3 overflow-auto">{user.bio}</div>
            {/* <div className="text-xs font-bold text-slate-400">Following</div> */}

          </div>
        </div>
        {/* posts */}
        <div className="flex-1 ml-10 min-w-0">
          <div className="font-bold text-lg mb-2">Posts</div>
          {posts.map((post, i) => <Post 
            key={`post-${i}`}
            user={user}
            post={post}
            isMyPost={me?.login.toLowerCase() === username.toString().toLowerCase()}
          />)}
        </div>
      </div>
    </div>
  );
}
 
export default Profile;