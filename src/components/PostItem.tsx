import { getTimeFromNow, isDark } from "@/utils/functions";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MarkdownEditor from "@uiw/react-markdown-editor";
import Image from "next/image";
import React from "react";
import styles from '../styles/post.module.css';
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";

interface Props {
  post: any
  user: any
  isMyPost: boolean
}

const PostItem: React.FC<Props> = ({ post, user, isMyPost }) => {
  
  const router = useRouter();

  return (
    <div className="mt-4 p-4 border border-slate-200 rounded-lg shadow-sm bg-gray-50">
      {/* picture, name and time */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-10 h-10 overflow-hidden rounded-full border">
            <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={user.avatar_url} width={512} height={512} />
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <div className="text-sm">{user.name}</div>
              <div className="text-xs text-slate-400 ml-2">{getTimeFromNow(post.updated_at)}</div>
            </div>
            <div className="text-xs text-slate-400">{post.repository_url.replace('https://api.github.com/repos/', '')}</div>
          </div>
        </div>
        {isMyPost && <button className="w-6 h-6 flex justify-center items-center text-sm rounded-full"><FontAwesomeIcon icon={faEllipsis} /></button>}
      </div>
      {/* title, body & labels */}
      <div className="mt-1">
        <div className="font-bold hover:underline cursor-pointer w-fit" onClick={() => router.push(`/${user.login}/${post.id}`)}>{post.title}</div>
        <div className="mt-2">
          <MarkdownEditor.Markdown className={styles.markdownContent} source={post.body} />
        </div>
        <div className="flex flex-wrap mt-3">
          {post.labels.map((label: any, i: number) =>
            <button
              className="text-xs mr-2 px-3 py-1 rounded-full border"
              key={`${post.id}-label${i}`}
              style={{ borderColor: `#${label.color}`, background: `#${label.color}88`, color: isDark(`#${label.color}`) ? '#fff' : '#000' }}
            >{label.name}</button>)}
        </div>
      </div>
      {/* comments */}
      <button className="mt-3 text-slate-400 py-1 px-3 text-xs font-bold rounded-full hover:bg-slate-200" onClick={() => router.push(`/${user.login}/${post.id}`)}><FontAwesomeIcon className="mr-2" icon={faComment} />{post.comments} Comment{post.comments === 1 ? '' : 's'}</button>
    </div>
  );
}

export default PostItem;