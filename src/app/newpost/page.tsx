"use client"

import { fetchUserRepos, getUsername } from "@/utils/github";
import styles from '../../styles/newpost.module.css';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";

const NewPost = () => {

  const router = useRouter();
  const { data: session, status } = useSession();
  // refs
  const repoInputRef = useRef(null);
  // github data
  const [repos, setRepos] = useState([]);
  // page states
  const [repoInput, setRepoInput] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);

  // register events
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    (async () => {
      if (status === 'authenticated') { // fetch data if user is logged in
        const username = await getUsername(session.user?.image as string);
        const data = await fetchUserRepos(username);
        setRepos(data);
        console.log(data)
      } else if (status === 'unauthenticated') { // redirect to login page if no user logged in
        router.push('/');
      }
    })();
  }, [status]);

  // click handler
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown') && target.id !== 'repo-input') { // when not clicking the dropdown and repo input
      setIsDropdownOpened(false);
    }
  }  

  return (
    <div className="flex justify-center h-full">
      <div className="w-full py-4 flex flex-col" style={{ maxWidth: 1024 }}>
        
        <h1 className="text-xl border-b p-2 font-bold">New post</h1>

        <div className="py-4 px-2 flex flex-1">
          {/* inputs */}
          <div className="flex flex-col flex-1">
            {/* repo input */}
            <div className={`${styles.inputGroup} relative max-w-80`}>
              <input id="repo-input" ref={repoInputRef} className="w-full box-border" placeholder="Select a repository" onFocus={() => setIsDropdownOpened(true)} value={repoInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setRepoInput(e.target.value)}/>
              {/* dropdown */}
              <div className={`${isDropdownOpened && repos.length > 0 ? '' : 'hidden '}${styles.dropdown} absolute max-h-48 overflow-auto w-full flex flex-col top-full mt-1 border border-slate-200 rounded-md bg-white shadow left-0 box-border`}>
                {repos.filter((repo: any) => repo.name.toLowerCase().includes(repoInput.toLowerCase())).map((repo: any, i) => 
                  <button className="py-2 px-3 text-left text-sm" key={`repo-${i}`} onClick={() => {
                    setRepoInput(repo.name);
                    setIsDropdownOpened(false);
                  }}>{repo.name}</button>
                )}
              </div>
            </div>
            {/* title input */}
            <div className={`${styles.inputGroup}`}>
              <h3 className="font-bold m-1">Title</h3>
              <input placeholder="Title" value={title} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}/>
            </div>
            {/* body input */}
            <div className={`${styles.inputGroup} flex-1`}>
              <h3 className="font-bold m-1">Body</h3>
              <MarkdownEditor source={body} setSource={setBody} />
            </div>
            {/* submit button */}
            <div className="flex justify-end mt-3">
              <button className={`${styles.submitButton} shadow rounded-md py-1.5 px-8 text-sm font-bold`}>Post</button>
            </div>
          </div>
          {/* labels */}
          <div className="w-56 ml-4 box-border">
            <div className="">
              
            </div>
            
          </div>
        </div>


      </div>
    </div>
  );
}
 
export default NewPost;