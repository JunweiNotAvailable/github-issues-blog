import React, { Fragment } from "react";
import styles from '../../styles/newpost.module.css';
import { getServerSession } from "next-auth/next";
import { getUserFromUrl, getUserRepos } from "@/utils/github";
import NewPostClient from "./page.client";

const NewPost = async () => {

  const session = await getServerSession();

  if (session) {
    try {
      const username = (await getUserFromUrl(session.user?.image as string)).login;
      const repos = await getUserRepos(username);
      // Perform server-side redirect
      return (
        <div className="flex justify-center">
          <div className="w-full py-8 flex flex-col" style={{ maxWidth: 1024 }}>
            <h1 className="text-xl border-b p-2 font-bold">New post</h1>
            <div className="py-4 px-2 flex-1 flex flex-col md:flex-row">
              <NewPostClient username={username} repos={repos} />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  return (
    <Fragment>
      <meta httpEquiv="refresh" content={`0; url=/`} />
    </Fragment>
  )
}

export default NewPost;