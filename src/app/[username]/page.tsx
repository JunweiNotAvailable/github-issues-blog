'use client'

import Post from "@/components/PostItem";
import Spinner from "@/components/Spinner";
import { removeDuplicate } from "@/utils/functions";
import { getUser, getUserFromUrl, getUserIssues, getUserRepos } from "@/utils/github";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Profile = () => {

  const router = useRouter();
  const { data: session, status } = useSession();
  const params = useParams();
  const { username } = params;
  // auth user
  const [authUser, setAuthUser] = useState<any | null>(null);
  // post user's data
  const [isGettingUser, setIsGettingUser] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // fetch user data 
  useEffect(() => {
    (async () => {
      // get user data
      const userData = await getUser(username as string);
      setUser(userData);
      setIsGettingUser(false);
    })();
  }, []);

  // get auth user data
  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        const name = (await getUserFromUrl(session.user?.image as string)).login;
        const userData = await getUser(name);
        setAuthUser(userData);
      })();
    }
  }, [status]);

  // load data when page updated
  useEffect(() => {
    (async () => {
      setIsLoadingData(true);
      const issues = await getUserIssues(username as string, page);
      if (issues.length === 0) { // no more data
        setIsLastPage(true);
        setIsLoadingData(false);
        return;
      }
      setPosts(prev => removeDuplicate([...prev, ...issues]).sort((a: any, b: any) => a.updated_at < b.updated_at ? 1 : -1));
      setIsLoadingData(false);
    })();
  }, [page]);

  // register scroll event
  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [isLastPage, isLoadingData]);

  // handle scroll
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement || document.body;
    // load more data if scroll to bottom
    if (Math.abs(scrollHeight - (scrollTop + clientHeight)) < 10) {
      // only load if there are more data
      if (!isLastPage && !isLoadingData) {
        setPage(page + 1);
      }
    }
  }

  return (
    user ?
      <div className="flex justify-center">
        <div className="flex w-full py-12 px-4" style={{ maxWidth: 1024 }}>
          {/* user info */}
          <div className="w-72 pl-4 pr-8 py-2">
            {/* <div className="sticky top-20">Search</div> */}
            <div>
              <div className="rounded-full overflow-hidden w-full aspect-square">
                <Image className="rounded-full w-full h-full border border-slate-300" priority alt="" src={user.avatar_url} width={512} height={512} />
              </div>
            </div>
            <div className="mx-2">
              <div className="text-2xl mt-4 font-bold overflow-ellipsis overflow-hidden">{user.name}</div> {/* user's display name */}
              <div className='text-gray-400 text-sm font-light overflow-ellipsis overflow-hidden'>{username}</div> {/* unique username */}
              <div className="text-sm my-3 overflow-auto">{user.bio}</div>
            </div>
          </div>
          {/* posts */}
          <div className="flex-1 ml-10 min-w-0">
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg mb-2">Posts</div>
              <button className="blue-button font-bold text-sm py-1 px-3 rounded shadow-sm" onClick={() => router.push('/newpost')}>New Post</button>
            </div>
            {posts.length === 0 && isLastPage && !isLoadingData ?
              <div className="text-center text-gray-300 text-lg font-bold">You have no posts</div>
              :
              posts.map((post, i) => <Post
                key={`post-${i}`}
                owner={user}
                post={post}
                hasPostLink
                isMyPost={authUser?.login.toLowerCase() === username.toString().toLowerCase()}
              />)}
            {isLoadingData && <div className="flex justify-center my-5"><Spinner /></div>}
          </div>
        </div>
      </div>
      :

      !isGettingUser && <div className="w-full my-32 flex flex-col items-center justify-center">
        <div className="text-gray-300 text-lg font-bold">Can't find the user :(</div>
        <button className="underline my-2" onClick={() => router.push('/')}>Go to Home</button>
      </div>
  );
}

export default Profile;