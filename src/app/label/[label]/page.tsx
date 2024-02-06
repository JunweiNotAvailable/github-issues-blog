'use client'

import PostItem from "@/components/PostItem";
import Spinner from "@/components/Spinner";
import { labels } from "@/utils/constants";
import { formatNumber, removeDuplicate } from "@/utils/functions";
import { getLabelCount, getLabelledIssues } from "@/utils/github";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Label = () => {

  const router = useRouter();
  const { label } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false); // prevent repeated loading
  const [labelCounts, setLabelCounts] = useState<number[]>([]);

  // get number of posts based on label
  useEffect(() => {
    (async () => {
      const counts = [];
      for (let i = 0; i < 9; i++) {
        const count = await getLabelCount(labels[i]);
        counts.push(count);
      }
      setLabelCounts(counts);
    })();
  }, []);

  // load posts when page updated
  useEffect(() => {
    (async () => {
      setIsLoadingData(true);
      const issues = await getLabelledIssues((label as string).replaceAll(' ', '%20'), page);
      if (issues.length === 0) { // no more data
        setIsLastPage(true);
        setIsLoadingData(false);
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
        <div className="flex-1 min-w-0 mx-2">
          {posts.length === 0 && isLastPage && !isLoadingData ?
            <div className="text-gray-300 text-lg font-bold text-center">No posts found :(</div>
            :
            posts.map((post, i) => <PostItem
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
        <div className="w-64 h-fit mx-2 ml-4 rounded-lg shadow-sm bg-slate-100 py-1 sticky top-16 border">
          <div className="text-xs font-bold mx-3 my-2">Popular labels</div>
          <div className="flex flex-col mt-1">
            {labels.slice(0, 9).map((label, i) => <button onClick={() => router.push(`/label/${label}`)} className="hover:bg-slate-200 text-left py-2 px-3 text-sm" key={`label-${i}`}>{label}<span className="text-xs text-gray-400 ml-2">{labelCounts[i] ? `${formatNumber(labelCounts[i])} posts` : ''}</span></button>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Label;