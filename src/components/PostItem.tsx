import { getTimeFromNow, isDark } from "@/utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UiwMarkdownEditor from "@uiw/react-markdown-editor";
import styles from '../styles/post.module.css';
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import React from "react";
import Label from "./Label";
import { PostLabel, Post } from "@/utils/interfaces";

interface Props {
  post: Post
}

const PostItem: React.FC<Props> = React.memo(({ post }) => {

  const router = useRouter();

  // get post route - /user/repo/issue_number
  const getRoute = () => `/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)?.[1]}/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)?.[2]}/${post.number}`;

  return (
    <div className={`${styles.postItem} mb-4 py-4 rounded-lg cursor-pointer`} onClick={() => router.push(getRoute())}>
      {/* title, body & labels */}
      <div className="mt-1 px-4">
        {/* title */}
        <div className="flex justify-between items-start">
          <div className="font-semibold text-lg ">{post.title}</div>
          <div className="text-xs text-gray-400">{getTimeFromNow(post.updated_at)}</div>
        </div>
        {/* body */}
        <div className="mt-2">
          <UiwMarkdownEditor.Markdown className={styles.markdownContent} source={post.body} />
        </div>
        {/* labels */}
        <div className="flex flex-wrap mt-3">
          {post.labels.map((label: PostLabel, i: number) => <Label key={`${post.id}-${label.name}`} label={label} />)}
        </div>
      </div>
      {/* comments button */}
      <div className="px-4">
        <div className="mt-3 text-slate-400 py-1 px-3 text-xs font-bold rounded-full"><FontAwesomeIcon className="mr-2" icon={faComment} />{post.comments} Comment{post.comments === 1 ? '' : 's'}</div>
      </div>
    </div>
  );
})

PostItem.displayName = 'PostItem';

export default PostItem;