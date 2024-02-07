import { getTimeFromNow, isDark, removeDuplicate } from "@/utils/functions";
import { faCheck, faEllipsis, faPen, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UiwMarkdownEditor from "@uiw/react-markdown-editor";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import styles from '../styles/post.module.css';
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import CommentItem from "./CommentItem";
import MarkdownEditor from "./MarkdownEditor";
import { labelColors, labels } from "@/utils/constants";
import { closeIssue, updateIssue } from "@/utils/github";

interface Props {
  post: any
  owner: any
  isMyPost: boolean
  showComments?: boolean
  hasUserLink?: boolean
  hasPostLink?: boolean
}

const PostItem: React.FC<Props> = ({ post, owner, isMyPost, showComments, hasUserLink, hasPostLink }) => {

  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [isOptionsOpened, setIsOptionsOpened] = useState(false);
  // edit
  const [isEditting, setIsEditting] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [selectedLabels, setSelectedLabels] = useState<any[]>(post.labels);
  // the text when editting, reset when cancel or finish editting
  const [tempTitle, setTempTitle] = useState(post.title);
  const [tempBody, setTempBody] = useState(post.body);
  const [tempSelectedLabels, setTempSelectedLabels] = useState<any[]>(post.labels);
  const [customLabelInput, setCustomLabelInput] = useState('');
  // delete
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // get comments and owner
    (async () => {
      if (showComments) {
        const commentsData = (await axios.get(`${post.comments_url}`)).data;
        setComments(commentsData.sort((a: any, b: any) => a.updated_at < b.updated_at ? 1 : -1));
      }
    })();
    // register event
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

  // get post route - /user/repo/issue_number
  const getRoute = () => `/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[1]}/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[2]}/${post.number}`;

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
    router.push(`/${owner.login}`);
    await closeIssue(
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[1],
      post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[2],
      post.number,
    );
  }

  return (
    <>
      <div className="mb-4 py-4 border border-slate-200 rounded-lg shadow-sm bg-gray-50">
        {/* picture, name and time */}
        <div className={`flex justify-between items-start px-4`}>
          <div className="flex items-center">
            <div className={`w-10 h-10 overflow-hidden rounded-full border${hasUserLink ? ' cursor-pointer' : ''}`} onClick={() => hasUserLink && router.push(`/${owner.login}`)}>
              <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={owner.avatar_url} width={512} height={512} />
            </div>
            <div className="ml-2">
              <div className="flex items-center">
                <div className={hasUserLink ? "text-sm hover:underline cursor-pointer font-bold" : "text-sm font-bold"} onClick={() => hasUserLink && router.push(`/${owner.login}`)}>{owner.name || owner.login}</div>
                <div className="text-xs text-slate-400 ml-2">{getTimeFromNow(post.updated_at)}</div>
              </div>
              <div className="text-xs text-slate-400">{post.repository_url.replace('https://api.github.com/repos/', '')}</div>
            </div>
          </div>
          {/* post options - edit/delete */}
          {(isMyPost && !isEditting) && <div className="post-options-button relative" onClick={() => setIsOptionsOpened(!isOptionsOpened)}>
            <button className="w-6 h-6 flex justify-center items-center text-sm rounded-full"><FontAwesomeIcon icon={faEllipsis} /></button>
            {isOptionsOpened && <div className="post-options flex flex-col border shadow absolute rounded top-7 right-0 w-28 box-border overflow-hidden">
              <button className="text-xs text-left py-2 px-3 text-gray-700" onClick={() => {
                setIsEditting(true);
                setIsOptionsOpened(false);
              }}><FontAwesomeIcon className="mr-2" style={{ fontSize: 10 }} icon={faPen} />Edit</button>
              <button className="text-xs text-left py-2 px-3 text-red-400" onClick={() => {
                setIsDeleting(true);
                setIsOptionsOpened(false);
              }}><FontAwesomeIcon className="mr-2" style={{ fontSize: 10 }} icon={faTrash} />Delete</button>
            </div>}
          </div>}
          {isEditting && <div>
            <button className="blue-button rounded px-4 py-1 text-sm font-bold shadow-sm" onClick={savePost}>Save</button>
            <button className="rounded px-4 py-1 text-sm shadow-sm text-gray-600 border-gray-300 border ml-2" onClick={() => setIsEditting(false)}>Cancel</button>
          </div>}
        </div>
        {/* title, body & labels */}
        <div className="mt-1 px-4">
          {/* title */}
          {isEditting ? <div className={styles.inputGroup}><input placeholder="Title" value={tempTitle} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setTempTitle(e.target.value)} /></div>
            : <div className={!hasPostLink ? "font-semibold" : "font-semibold hover:underline cursor-pointer w-fit"} onClick={() => hasPostLink && router.push(getRoute())}>{title}</div>}
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
              <UiwMarkdownEditor.Markdown className={styles.markdownContent} source={body} />
            </div>}
          {/* labels */}
          {!isEditting && <div className="flex flex-wrap mt-3">
            {selectedLabels.map((label: any, i: number) =>
              <button
                onClick={() => router.push(`/label/${label.name}`)}
                className="text-xs mr-2 my-1 px-3 py-1 rounded-full border"
                key={`${post.id}-label${i}`}
                style={{ borderColor: `#${label.color}`, background: `#${label.color}88`, color: isDark(`#${label.color}`) ? '#fff' : '#000' }}
              >{label.name}</button>)}
          </div>}
        </div>
        {/* comments */}
        {showComments ?
          // show all comments
          <div className="mt-3">
            <div className="text-slate-400 text-sm py-2 font-bold mx-4"><FontAwesomeIcon className="mr-2" icon={faComment} />{post.comments} Comment{post.comments === 1 ? '' : 's'}</div>
            <div>
              {comments.map((comment, i) => <CommentItem
                key={`comment-${i}`}
                comment={comment}
              />)}
            </div>
          </div>
          :
          // comments button if showComment is false
          <div className="px-4">
            <button className="mt-3 text-slate-400 py-1 px-3 text-xs font-bold rounded-full hover:bg-slate-200" onClick={() => router.push(getRoute())}><FontAwesomeIcon className="mr-2" icon={faComment} />{post.comments} Comment{post.comments === 1 ? '' : 's'}</button>
          </div>}
      </div>

      {/* delete window */}
      {isDeleting && <div className="fixed w-dvw h-dvh flex justify-center top-0 left-0" style={{ zIndex: 100 }}>
        <div className="bg-white max-w-sm w-11/12 h-fit mt-40 box-border p-3 rounded-lg" style={{ boxShadow: '0px 0px 1000px 1000px #00000033' }}>
          <div className="flex font-bold items-center"><FontAwesomeIcon className="mr-4 text-2xl text-red-400" icon={faTimes} />Delete this post?</div>
          <div className="m-2 text-sm">This cannot be undone</div>
          <div className="flex mt-4">
            <button onClick={() => setIsDeleting(false)} className="flex-1 rounded-md py-1 text-sm shadow-sm transition-all text-gray-600 border-gray-300 border mr-2">Cancel</button>
            <button onClick={deletePost} className="flex-1 rounded-md py-1 text-sm shadow-sm transition-all text-white border-red-400 bg-red-400 hover:bg-red-300 hover:border-red-300 border mr-2">Delete</button>
          </div>
        </div>
      </div>}
    </>
  );
}

export default PostItem;