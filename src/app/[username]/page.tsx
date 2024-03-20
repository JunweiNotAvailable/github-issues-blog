import { getUser, getUserFromUrl, getUserIssues } from "@/utils/github";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import styles from '../../styles/profile.module.css';
import Posts from "./Posts";
import Image from "next/image";
import { Post } from "@/utils/interfaces";


const Profile = async ({ params }: any) => {

  const session = await getServerSession();
  const { username } = params;

  try {
    const user = await getUser(username as string);
    // Get auth user
    let authUser = null;
    if (session) {
      const name = (await getUserFromUrl(session.user?.image as string)).login;
      authUser = await getUser(name);
    }
    // Get posts
    const { issues, totalCount } = await getUserIssues(username as string, 1) || {};
    const posts = issues.sort((a: Post, b: Post) => a.updated_at < b.updated_at ? 1 : -1);
    return (
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row w-full py-12 px-4" style={{ maxWidth: 1024 }}>
          {/* user info */}
          <div className={`${styles.userInfo} w-72 md:pl-4 md:py-8 md:pr-8 flex md:flex-col items-center h-fit md:shadow-sm rounded-lg`}>
            <div className="w-1/3 md:w-2/3 min-w-24">
              <div className="rounded-full overflow-hidden w-full aspect-square">
                <Image className="rounded-full w-full h-full border border-slate-300" priority alt="" src={user.avatar_url} width={512} height={512} />
              </div>
            </div>
            <div className="mx-0 ml-4 md:mx-2 min-w-0 flex-1">
              <div className="text-lg md:text-2xl mt-2 md:mt-4 font-bold overflow-ellipsis overflow-hidden">{user.name}</div> {/* user's display name */}
              <div className='text-gray-400 text-sm font-light overflow-ellipsis overflow-hidden'>@{username}</div> {/* unique username */}
              <div className='text-gray-400 my-2 text-sm font-light overflow-ellipsis overflow-hidden'>{user.followers} follower{user.followers === 1 ? '' : 's'} · {totalCount !== -1 && `${totalCount} post${totalCount === 1 ? '' : 's'}`}</div> {/* unique username */}
              <div className="text-sm my-3 overflow-auto hidden md:block">{user.bio}</div>
            </div>
          </div>
          {/* mobile bio */}
          <div className="text-sm my-3 overflow-auto block md:hidden">{user.bio}</div>

          {/* posts */}
          <div className="flex-1 md:ml-10 min-w-0">
            <Posts user={user} authUser={authUser} initialPosts={posts} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.log('Failed getting user data:', error);
  }

  return (
    <div className="w-full my-32 flex flex-col items-center justify-center">
      <div className="font-bold">Cannot find the user :(</div>
      <Link href={'/'} className="underline my-2 hover:bg-white">Go to home</Link>
    </div>
  );
}

export default Profile;