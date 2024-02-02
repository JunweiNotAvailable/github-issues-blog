import { getTimeFromNow, isDark, removeDuplicate } from "@/utils/functions";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MarkdownEditor from "@uiw/react-markdown-editor";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from '../styles/post.module.css';
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import CommentItem from "./CommentItem";

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

  // get comments and owner
  useEffect(() => {
    (async () => {
      if (showComments) {
        const commentsData = (await axios.get(`${post.comments_url}`)).data;
        setComments(commentsData.sort((a: any, b: any) => a.updated_at < b.updated_at ? 1 : -1));
      }
    })();
  }, []);

  // get post route - /user/repo/issue_number
  const getRoute = () => `/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[1]}/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[2]}/${post.number}`;

  return (
    <div className="mt-4 py-4 border border-slate-200 rounded-lg shadow-sm bg-gray-50">
      {/* picture, name and time */}
      <div className={`flex justify-between items-start px-4`}>
        <div className="flex items-center">
          <div className={`w-10 h-10 overflow-hidden rounded-full border${hasUserLink ? ' cursor-pointer' : ''}`} onClick={() => hasUserLink && router.push(`/${owner.login}`)}>
            <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={owner.avatar_url} width={512} height={512} />
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <div className={hasUserLink ? "text-sm hover:underline cursor-pointer font-bold" : "text-sm font-bold"} onClick={() => hasUserLink && router.push(`/${owner.login}`)}>{owner.login}</div>
              <div className="text-xs text-slate-400 ml-2">{getTimeFromNow(post.updated_at)}</div>
            </div>
            <div className="text-xs text-slate-400">{post.repository_url.replace('https://api.github.com/repos/', '')}</div>
          </div>
        </div>
        {isMyPost && <button className="w-6 h-6 flex justify-center items-center text-sm rounded-full"><FontAwesomeIcon icon={faEllipsis} /></button>}
      </div>
      {/* title, body & labels */}
      <div className="mt-1 px-4">
        {/* title */}
        <div className={!hasPostLink ? "font-semibold" : "font-semibold hover:underline cursor-pointer w-fit"} onClick={() => hasPostLink && router.push(getRoute())}>{post.title}</div>
        {/* body */}
        <div className="mt-2">
          <MarkdownEditor.Markdown className={styles.markdownContent} source={post.body} />
        </div>
        {/* labels */}
        <div className="flex flex-wrap mt-3">
          {post.labels.map((label: any, i: number) =>
            <button
              className="text-xs mr-2 my-1 px-3 py-1 rounded-full border"
              key={`${post.id}-label${i}`}
              style={{ borderColor: `#${label.color}`, background: `#${label.color}88`, color: isDark(`#${label.color}`) ? '#fff' : '#000' }}
            >{label.name}</button>)}
        </div>
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
  );
}

export default PostItem;