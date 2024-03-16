import LoginButton from "@/components/LoginButton";
import { getUserFromUrl } from "@/utils/github";
import { getServerSession } from "next-auth/next";
import { Fragment } from "react";


export default async function Home() {

  const session = await getServerSession();

  if (session) {
    try {
      const username = (await getUserFromUrl(session.user?.image as string)).login;
      // Perform server-side redirect
      return (
        <Fragment>
          <meta httpEquiv="refresh" content={`0; url=/${username}`} />
        </Fragment>
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  return (
    !session ?
    <div className='flex flex-1 items-center justify-center flex-col'>      
      <div className="font-bold text-3xl text-center">Create content with Github issues</div>
      <div></div>
      <LoginButton />
    </div>
    :

    <></>
  )
}
