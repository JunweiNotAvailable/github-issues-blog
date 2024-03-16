import React, { Fragment } from "react";
import PageClient from './page.client';
import { getServerSession } from "next-auth/next";
import { getUserFromUrl, getUserRepos } from "@/utils/github";

const NewPost = async () => {

  const session = await getServerSession();

  if (session) {
    try {
      const username = (await getUserFromUrl(session.user?.image as string)).login;
      const data = await getUserRepos(username);
      // Perform server-side redirect
      return (
        <PageClient username={username} repos={data} />
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    return (
      <Fragment>
        <meta httpEquiv="refresh" content={`0; url=/`} />
      </Fragment>
    )
  }

  return (
    <></>
  );
}

export default NewPost;