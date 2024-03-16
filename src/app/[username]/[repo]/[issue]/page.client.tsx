'use client'

import styles from '../../../../styles/post.module.css';
import CommentItem from "@/components/CommentItem";
import UIWMarkdownEditor from '@uiw/react-markdown-editor';
import { closeIssue, updateIssue } from "@/utils/github";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getTimeFromNow, isDark } from "@/utils/functions";
import { faCheck, faEllipsis, faPen, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import MarkdownEditor from "@/components/MarkdownEditor";
import { labelColors, labels } from "@/utils/constants";
import Label from '@/components/Label';

interface Props {
  owner: any
  authUser: any
  post: any
  comments: any[]
}

const PostClient: React.FC<Props> = ({ owner, authUser, post, comments }) => {

  const router = useRouter();
  // auth
  const isMyPost = owner ? owner?.login === authUser?.login : false;
  // edit
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
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[1],
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[2],
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
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[1],
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[2],
      post.number,
    );
    router.push(`/${owner.login}`);
  }


  return (
    (owner && post) &&
    <>
      <div className="flex justify-center pb-16 px-4">
        <div className="w-full" style={{ maxWidth: 720 }}>
          <div className='w-full flex justify-between items-center my-4'>
            {/* title */}
            {isEditting ? <div className={styles.inputGroup}><input placeholder="Title" value={tempTitle} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTempTitle(e.target.value)} /></div>
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
            {/* picture, name and time */}
            <div className={`flex justify-between items-start cursor-pointer`} onClick={() => router.push(`/${owner.login}`)}>
              <div className="flex items-center">
                <div className={`w-10 h-10 overflow-hidden rounded-full border`}>
                  <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={owner.avatar_url} width={512} height={512} />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <div className={"text-sm font-bold"} >{owner.name || owner.login}</div>
                    <div className="text-xs text-slate-400 ml-2">{getTimeFromNow(post.updated_at)}</div>
                  </div>
                  <div className="text-xs text-slate-400">{post.repository_url.replace('https://api.github.com/repos/', '')}</div>
                </div>
              </div>
              {isEditting && <div>
                <button className="blue-button rounded px-4 py-1 text-sm font-bold shadow-sm" onClick={savePost}>Save</button>
                <button className="rounded px-4 py-1 text-sm shadow-sm text-gray-600 border-gray-300 border ml-2" onClick={() => setIsEditting(false)}>Cancel</button>
              </div>}
            </div>
            {/* title, body & labels */}
            <div className="mt-8">
              {/* body */}
              {isEditting ?
                <div className="mt-2 flex">
                  <div className={`${styles.inputGroup} flex-1`}><MarkdownEditor source={tempBody} setSource={setTempBody} /></div>
                  <div className="w-40 ml-8 box-border">
                    {/* selected */}
                    <div className="flex flex-wrap">
                      {tempSelectedLabels.map((label, i) => <div className="flex rounded-full items-center m-1 text-xs cursor-default border py-1 px-2" key={`selected-${i}`}
                        style={{
                          borderColor: label.color,
                          background: label.color + '88',
                          color: isDark(`#${label.color}`) ? '#fff' : '#000'
                        }}
                      >
                        {label.name}
                        <FontAwesomeIcon className="ml-1 p-0.5 cursor-pointer" icon={faTimes} onClick={() => setTempSelectedLabels(prev => prev.filter(l => l.name !== label.name))} />
                      </div>)}
                    </div>
                    {/* all */}
                    <div className="text-xs font-bold mt-2">Labels</div>
                    <div className="flex flex-col mt-1 border rounded-md shadow-sm overflow-hidden">
                      {labels.slice(0, 9).map((label, i) => <button className={`${tempSelectedLabels.find(l => l.name === label) ? styles.selected : ''} flex justify-between items-center py-2 px-3 text-left text-xs`} key={`label-${i}`} onClick={() => setTempSelectedLabels(prev => prev.find(l => l.name === label) ? prev.filter(l => l.name !== label) : [...prev, { name: label, color: labelColors[i] }])}>
                        <div className="flex items-center">
                          <div className='rounded-full w-3 h-3 border border-slate-300 mr-2' style={{ background: labelColors[i] }} />
                          {label}
                        </div>
                        {tempSelectedLabels.find(l => l.name === label) && <FontAwesomeIcon icon={faCheck} color="#0E8A16" />}
                      </button>)}
                    </div>
                    <div className={`flex mt-2`}>
                      <input className={`${styles.input} border text-xs py-1 px-2 rounded flex-1 min-w-0`} placeholder="Add your own label" value={customLabelInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setCustomLabelInput(e.target.value)} />
                      <button className={`blue-button text-xs px-4 ml-1 rounded`} onClick={() => (customLabelInput.length > 0 && !selectedLabels.find(l => l.name === customLabelInput)) && setTempSelectedLabels(prev => [...prev, { name: customLabelInput, color: '#e0e4e8' }])}>Add</button>
                    </div>
                  </div>
                </div>
                :
                <div className="mt-2">
                  <UIWMarkdownEditor.Markdown className={styles.markdownContent} source={body} />
                </div>}
              {/* labels */}
              {!isEditting && <div className="flex flex-wrap mt-3">
                {selectedLabels.map((label: any, i: number) => <Label key={`${post.id}-${label.name}`} label={label} />)}
              </div>}
            </div>
          </div>

          {/* comments */}
          <div className="mt-8">
            <div className="text-slate-400 text-sm py-2 font-bold mx-4"><FontAwesomeIcon className="mr-2" icon={faComment} />{post.comments} Comment{post.comments === 1 ? '' : 's'}</div>
            <div>
              {comments.map((comment, i) => <CommentItem
                key={`comment-${i}`}
                comment={comment}
              />)}
            </div>
          </div>
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
  );
}

export default PostClient;