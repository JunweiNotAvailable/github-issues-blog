'use client'

import styles from '../../styles/profile.module.css';
import PostItem from "@/components/PostItem";
import Spinner from "@/components/Spinner";
import { getUserIssues } from "@/utils/github";
import { Post, User } from '@/utils/interfaces';
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  authUser: User
  user: User
  initialPosts: Post[]
}

const Posts: React.FC<Props> = ({ authUser, user, initialPosts }) => {

  const router = useRouter();
  const { username } = useParams();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(initialPosts.length < 10);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // load data when page updated
  useEffect(() => {
    (async () => {
      if (page < 2) return;
      setIsLoadingData(true);
      const { issues, totalCount } = await getUserIssues(username as string, page) || {};
      if (issues.length === 0) { // no more data
        setIsLastPage(true);
        setIsLoadingData(false);
        return;
      }
      setPosts(prev => [...prev, ...issues].sort((a: any, b: any) => a.updated_at < b.updated_at ? 1 : -1));
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
    <>
      <div className="flex items-center justify-between my-4 md:mt-0">
        <div className="md:text-lg">{`${username}'s posts`}</div>
        {authUser?.login.toLowerCase() === username.toString().toLowerCase() && <button className="blue-button font-bold text-sm py-1 px-3 rounded shadow-sm" onClick={() => router.push('/newpost')}>New Post</button>}
      </div>
      {posts.length === 0 && isLastPage && !isLoadingData ?
        <div className="text-center text-gray-300 font-bold">{user.login} has no posts :(</div>
        :
        posts.map((post, i) => <PostItem
          key={`post-${i}`}
          post={post}
        />)}
      {isLoadingData && <div className="flex justify-center my-5"><Spinner /></div>}
    </>
  );
}

export default Posts;