"use client"

import { removeDuplicate } from "@/utils/functions";
import { getIssues, getUserIssues } from "@/utils/github";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import PostItem from "@/components/PostItem";

export default function Home() {

  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false); // prevent repeated loading

  // load posts when page updated
  useEffect(() => {
    (async () => {
      setIsLoadingData(true);
      const issues = await getIssues(page);
      if (issues.length === 0) { // no more data
        setIsLastPage(true);
        return;
      }
      setPosts(prev => removeDuplicate([...prev, ...issues]));
      setIsLoadingData(false);
    })();
  }, [page]);

  // register scroll event
  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [isLastPage, isLoadingData]);

  // handle scroll
  const handleScroll = async () => {
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
    <div className='flex justify-center'>      
      <div className="flex py-10 w-full" style={{ maxWidth: 1024 }}>
        {/* posts */}
        <div className="flex-1 min-w-0">
          {posts.map((post, i) => <PostItem 
            key={`post-${i}`}
            owner={post.user}
            hasPostLink
            hasUserLink
            post={post}
            isMyPost={false}
          />)}
          {isLoadingData && <div className="flex justify-center my-5"><Spinner /></div>}
        </div>
        {/* sidebar */}
        <div className="w-56 ml-8"></div>
      </div>
    </div>
  )
}
