'use client'

import PostItem from "@/components/PostItem";
import { getIssue, getUser, getUserFromUrl } from "@/utils/github";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Post = () => {

  // auth
  const { data: session, status } = useSession();
  const [authUser, setAuthUser] = useState<any | null>(null);
  // post and owner
  const { username, repo, issue } = useParams();
  const [owner, setOwner] = useState<any | null>(null); // post owner
  const [post, setPost] = useState<any | null>(null);

  // get post and owner data
  useEffect(() => {
    (async () => {
      const issueData = await getIssue(username as string, repo as string, issue as string);
      setPost(issueData);
      const ownerData = await getUser(issueData.user.login);
      setOwner(ownerData);
    })();
  }, []);

  // get auth user
  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        const name = (await getUserFromUrl(session.user?.image as string)).login;
        const userData = await getUser(name);
        setAuthUser(userData);
      })();
    }
  }, [status]);

  return (
    (owner && post) && 
    <div className="flex justify-center pb-16">
      <div className="w-full" style={{ maxWidth: 720 }}>
        {/* header */}
        <div className="font-bold text-xl bg-white my-4 mx-1">Post</div>
        {/* post */}
        <PostItem
          post={post}
          owner={owner}
          isMyPost={owner.login === authUser?.login}
          showComments
          hasUserLink
        />
      </div>
    </div>
  );
}
 
export default Post;