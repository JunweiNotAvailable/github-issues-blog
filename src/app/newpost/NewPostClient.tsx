"use client"

import { postIssue } from "@/utils/github";
import styles from '../../styles/newpost.module.css';
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { labelColors, labels } from "@/utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { isDark } from "@/utils/functions";
import Spinner from "@/components/Spinner";
import { Post } from "@/utils/interfaces";

interface Props {
  username: string
  repos: Post[]
}

const NewPostClient: React.FC<Props> = ({ username, repos }) => {

  const router = useRouter();
  // refs
  const repoInputRef = useRef(null);
  // page states
  const [repoInput, setRepoInput] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<{ name: string, color: string }[]>([]);
  const [customLabelInput, setCustomLabelInput] = useState('');
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [isValidPost, setIsValidPost] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // register events
  useEffect(() => {
    // click handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown') && target.id !== 'repo-input') { // close dropdown when not clicking the dropdown and repo input
        setIsDropdownOpened(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // check if post is ready to submit
  useEffect(() => {
    setIsValidPost(
      repos.find((repo: any) => repo.name === repoInput) !== undefined &&
      title !== '' &&
      body.length > 30
    );
  }, [repoInput, title, body]);

  // submit post -> create issue
  const submitPost = async () => {
    setIsPosting(true);
    await postIssue(username, repoInput, title, body, selectedLabels);
    setIsPosting(false);
    router.push(`/${username}`);
  }

  return (
    <>
      {/* inputs */}
      <div className="flex flex-col flex-1">
        {/* repo input */}
        <div className={`${styles.inputGroup} relative max-w-80`}>
          <h3 className="font-bold m-1">Repo</h3>
          <input id="repo-input" ref={repoInputRef} className="w-full box-border" placeholder="Select a repository" onFocus={() => setIsDropdownOpened(true)} value={repoInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setRepoInput(e.target.value)} />
          {/* dropdown */}
          <div className={`${isDropdownOpened && repos.length > 0 ? '' : 'hidden '}${styles.dropdown} absolute max-h-48 overflow-auto w-full flex flex-col top-full mt-1 border border-slate-200 rounded-md bg-white shadow left-0 box-border`}>
            {repos.filter((repo: any) => repo.name.toLowerCase().includes(repoInput.toLowerCase())).map((repo: any, i) =>
              <button className="py-2 px-3 text-left text-sm hover:bg-slate-100" key={`repo-${i}`} onClick={() => {
                setRepoInput(repo.name);
                setIsDropdownOpened(false);
              }}>{repo.name}</button>
            )}
          </div>
        </div>
        {/* title input */}
        <div className={`${styles.inputGroup}`}>
          <h3 className="font-bold m-1">Title</h3>
          <input placeholder="Title" value={title} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
        </div>
        {/* body input */}
        <div className={`${styles.inputGroup} flex-1`}>
          <h3 className="font-bold m-1">Body</h3>
          <MarkdownEditor source={body} setSource={setBody} />
        </div>
        {/* submit button */}
        <div className="hidden md:flex justify-end mt-3">
          <button className={`${styles.submitButton} ${isValidPost && !isPosting ? '' : styles.disabled} shadow rounded-md py-1.5 px-8 text-sm font-bold `} onClick={submitPost} disabled={!isValidPost || isPosting}>{isPosting ? <Spinner size={20} color="#fff" /> : 'Post'}</button>
        </div>
      </div>
      
    </>
  );
}

export default NewPostClient;