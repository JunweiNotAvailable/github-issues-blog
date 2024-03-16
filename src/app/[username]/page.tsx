import { getUser, getUserFromUrl, getUserIssues } from "@/utils/github";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { Fragment } from "react";
import ProfileClient from "./page.client";


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
    const posts = issues.sort((a: any, b: any) => a.updated_at < b.updated_at ? 1 : -1);
    return (
      <Fragment>
        <ProfileClient user={user} authUser={authUser} initialPosts={posts} postsCount={totalCount} />
      </Fragment>
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