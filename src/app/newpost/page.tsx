"use client"

import { fetchUserRepos, getUsername, postIssue } from "@/utils/github";
import styles from '../../styles/newpost.module.css';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { labelColors, labels } from "@/utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { isDark, randInt } from "@/utils/functions";

const NewPost = () => {

  const router = useRouter();
  const { data: session, status } = useSession();
  // refs
  const repoInputRef = useRef(null);
  // github data
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  // page states
  const [repoInput, setRepoInput] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<{ name: string, color: string }[]>([]);
  const [customLabelInput, setCustomLabelInput] = useState('');
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [isValidPost, setIsValidPost] = useState(false);

  // register events
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // check if user is authenticated
  useEffect(() => {
    (async () => {
      if (status === 'authenticated') { // fetch data if user is logged in
        const name = await getUsername(session.user?.image as string);
        const data = await fetchUserRepos(name);
        setUsername(name);
        setRepos(data);
      } else if (status === 'unauthenticated') { // redirect to login page if no user logged in
        router.push('/');
      }
    })();
  }, [status]);

  // check if post is ready to submit
  useEffect(() => {
    setIsValidPost(
      repos.find((repo: any) => repo.name === repoInput) !== undefined &&
      title !== '' &&
      body.length > 30
    );
  }, [repoInput, title, body]);

  // click handler
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown') && target.id !== 'repo-input') { // close dropdown when not clicking the dropdown and repo input
      setIsDropdownOpened(false);
    }
  }  

  // submit post -> create issue
  const submitPost = async () => {
    await postIssue(username, repoInput, title, body, selectedLabels);
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
              <h3 className="font-bold m-1">Repo</h3>
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
              <button className={`${styles.submitButton} ${isValidPost ? '' : styles.disabled} shadow rounded-md py-1.5 px-8 text-sm font-bold`} onClick={submitPost} disabled={!isValidPost}>Post</button>
            </div>
          </div>

          {/* labels */}
          <div className="w-64 ml-4 box-border">
            {/* selected */}
            <div className="flex flex-wrap">
              {selectedLabels.map((label, i) => <div className="flex rounded-full items-center m-1 text-xs cursor-default border py-1 px-2" key={`selected-${i}`} 
                style={{ 
                  borderColor: label.color,
                  background: label.color + '88', 
                  color: isDark(label.color) ? '#fff' : '#000'
                }}
              >
                {label.name}
                <FontAwesomeIcon className="ml-1 p-0.5 cursor-pointer" icon={faTimes} onClick={() => setSelectedLabels(prev => prev.filter(l => l.name !== label.name))} />
              </div>)}
            </div>
            {/* all */}
            <div className="text-sm font-bold mt-2">Labels</div>
            <div className="flex flex-col mt-1 border rounded-md shadow-sm overflow-hidden">
              {labels.map((label, i) => <button className={`${selectedLabels.find(l => l.name === label) ? styles.selected : ''} flex justify-between items-center py-2 px-3 text-left text-sm`} key={`label-${i}`} onClick={() => setSelectedLabels(prev => prev.find(l => l.name === label) ? prev.filter(l => l.name !== label) : [...prev, { name: label, color: labelColors[i] }])}>
                <div className="flex items-center">
                  <div className='rounded-full w-3 h-3 border border-slate-300 mr-2' style={{ background: labelColors[i] }} />
                  {label}
                </div>
                {selectedLabels.find(l => l.name === label) && <FontAwesomeIcon icon={faCheck} color="#0E8A16" />}
              </button>)}
            </div>
            <div className={`flex mt-2`}>
              <input className={`${styles.input} border text-sm py-1 px-2 rounded flex-1 min-w-0`} placeholder="Add your own label" value={customLabelInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setCustomLabelInput(e.target.value)} />
              <button className={`${styles.submitButton} text-sm px-4 ml-1 rounded`} onClick={() => (customLabelInput.length > 0 && !selectedLabels.find(l => l.name === customLabelInput)) && setSelectedLabels(prev => [...prev, { name: customLabelInput, color: labelColors[randInt(0, labelColors.length)] }])}>Add</button>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}
 
export default NewPost;