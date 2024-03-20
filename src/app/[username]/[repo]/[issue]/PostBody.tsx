'use client';

import { closeIssue, updateIssue } from '@/utils/github';
import styles from '../../../../styles/post.module.css';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEllipsis, faPen, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import MarkdownEditor from '@/components/MarkdownEditor';
import UIWMarkdownEditor from '@uiw/react-markdown-editor';
import { isDark } from '@/utils/functions';
import Label from '@/components/Label';
import { labelColors, labels } from '@/utils/constants';
import { Post, PostLabel, User } from '@/utils/interfaces';

interface Props {
  owner: User
  authUser: User
  post: Post
}

const PostBody = ({ owner, authUser, post }: Props) => {

  const router = useRouter();
  const isMyPost = owner ? owner?.login === authUser?.login : false;
  
  const [isOptionsOpened, setIsOptionsOpened] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [selectedLabels, setSelectedLabels] = useState<any[]>(post.labels);
  // the texts when editting, reset when cancel or finish editting
  const [tempTitle, setTempTitle] = useState(post.title);
  const [tempBody, setTempBody] = useState(post.body);
  const [tempSelectedLabels, setTempSelectedLabels] = useState<any[]>(post.labels);
  const [customLabelInput, setCustomLabelInput] = useState('');
  // delete
  const [isDeleting, setIsDeleting] = useState(false);

  // register event
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // reset temp value when start editting
  useEffect(() => {
    if (isEditting) {
      setTempTitle(title);
      setTempBody(body);
      setTempSelectedLabels(selectedLabels);
      setCustomLabelInput('');
    }
  }, [isEditting]);

  // click event handler
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.post-options-button') && !target.closest('.post-options')) {
      setIsOptionsOpened(false);
    }
  }

  // save editted post
  const savePost = async () => {
    setTitle(tempTitle);
    setBody(tempBody);
    setSelectedLabels([...tempSelectedLabels]);
    setIsEditting(false);
    await updateIssue(
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)?.[1] || '',
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)?.[2] || '',
      post.number,
      {
        title: tempTitle,
        body: tempBody,
        labels: tempSelectedLabels
      }
    );
  }

  // delete post
  const deletePost = async () => {
    await closeIssue(
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)?.[1] || '',
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)?.[2] || '',
      post.number,
    );
    router.push(`/${owner.login}`);
  }


  return (
    <>
      <div className='w-full flex justify-between items-center my-4'>
        {/* title */}
        {isEditting ? <div className={`${styles.inputGroup} flex justify-between flex-row`}>
          <input placeholder="Title" value={tempTitle} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTempTitle(e.target.value)} />
          {isEditting && <div className={`${isEditting ? 'flex' : 'hidden'} justify-end`}>
            <button className="blue-button rounded px-4 py-1 text-xs md:text-sm font-bold shadow-sm ml-2" onClick={savePost}>Save</button>
            <button className="rounded px-4 py-1 text-xs md:text-sm shadow-sm text-gray-600 border-gray-300 border ml-2" onClick={() => setIsEditting(false)}>Cancel</button>
          </div>}
        </div>
          : <div className='font-bold text-xl my-4'>{title}</div>}
        {/* post options - edit/delete */}
        {(isMyPost && !isEditting) &&
          <div className="post-options-button relative" onClick={() => setIsOptionsOpened(!isOptionsOpened)}>
            <button className="w-8 h-8 flex justify-center items-center text-md rounded-full hover:bg-slate-100"><FontAwesomeIcon icon={faEllipsis} /></button>
            {isOptionsOpened && <div className="post-options bg-white flex flex-col border shadow absolute rounded top-8 right-0 w-36 box-border overflow-hidden">
              <button className="text-sm text-left py-2 px-3 text-gray-700 hover:bg-slate-100" onClick={() => {
                setIsEditting(true);
                setIsOptionsOpened(false);
              }}><FontAwesomeIcon className="mr-2" style={{ fontSize: 12 }} icon={faPen} />Edit</button>
              <button className="text-sm text-left py-2 px-3 text-red-400 hover:bg-slate-100" onClick={() => {
                setIsDeleting(true);
                setIsOptionsOpened(false);
              }}><FontAwesomeIcon className="mr-2" style={{ fontSize: 12 }} icon={faTrash} />Delete</button>
            </div>}
          </div>}
      </div>
      {/* post */}
      <div className="mb-4">
        {/* title, body & labels */}
        <div className="mt-4">
          {/* body */}
          {isEditting ?
            <div className="mt-2 flex md:flex-row flex-col">
              <div className={`${styles.inputGroup} flex-1`}><MarkdownEditor source={tempBody} setSource={setTempBody} /></div>
            </div>
            :
            <div className="mt-2">
              <UIWMarkdownEditor.Markdown className={styles.markdownContent} source={body} />
            </div>}
          {/* labels */}
          {!isEditting && <div className="flex flex-wrap mt-3">
            {selectedLabels.map((label: PostLabel, i: number) => <Label key={`${post.id}-${label.name}`} label={label} />)}
          </div>}
        </div>
      </div>

      {/* delete confirm popup */}
      {isDeleting && <div className='fixed top-0 left-0 w-dvw h-dvh flex justify-center' style={{ zIndex: 200 }}>
        <div className='w-5/6 max-w-md h-fit rounded-lg mt-32 box-border p-4 bg-white' style={{ boxShadow: '5px 10px 1000px 1000px #0003' }}>
          <div className='font-bold'>Delete this post?</div>
          <div className='text-sm mt-2'>It cannot be reversed once deleted. Are you sure??</div>
          <div className='flex justify-end mt-4'>
            <button className='rounded px-4 py-1 text-sm shadow-sm text-gray-600 border-gray-300 border mr-2 transition-all' onClick={() => setIsDeleting(false)}>Cancel</button>
            <button className='font-bold text-sm rounded text-white px-4 py-1 bg-red-400 hover:bg-red-300 transition-all' onClick={deletePost}>Delete</button>
          </div>
        </div>
      </div>}
    </>
  )
}

export default PostBody