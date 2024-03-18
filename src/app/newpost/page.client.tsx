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

interface Props {
  username: string
  repos: any[]
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

      {/* labels */}
      <div className="mt-2 md:mt-0 w-full md:w-64 md:ml-8 box-border">
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
          {labels.slice(0, 9).map((label, i) => <button className={`${selectedLabels.find(l => l.name === label) ? styles.selected : ''} flex justify-between items-center py-2 px-3 text-left text-sm hover:bg-slate-100`} key={`label-${i}`} onClick={() => setSelectedLabels(prev => prev.find(l => l.name === label) ? prev.filter(l => l.name !== label) : [...prev, { name: label, color: labelColors[i] }])}>
            <div className="flex items-center">
              <div className='rounded-full w-3 h-3 border border-slate-300 mr-2' style={{ background: labelColors[i] }} />
              {label}
            </div>
            {selectedLabels.find(l => l.name === label) && <FontAwesomeIcon icon={faCheck} color="#0E8A16" />}
          </button>)}
        </div>
        <div className={`flex mt-2`}>
          <input className={`${styles.input} border text-sm py-1 px-2 rounded flex-1 min-w-0`} placeholder="Add your own label" value={customLabelInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setCustomLabelInput(e.target.value)} />
          <button className={`${styles.submitButton} text-sm px-4 ml-1 rounded`} onClick={() => (customLabelInput.length > 0 && !selectedLabels.find(l => l.name === customLabelInput)) && setSelectedLabels(prev => [...prev, { name: customLabelInput, color: '#e0e4e8' }])}>Add</button>
        </div>
      </div>

      {/* mobile submit button */}
      <div className="flex md:hidden justify-end mt-10">
        <button className={`${styles.submitButton} ${isValidPost ? '' : styles.disabled} shadow rounded-md py-1.5 px-8 text-sm font-bold`} onClick={submitPost} disabled={!isValidPost}>Post</button>
      </div>
    </>
  );
}

export default NewPostClient;