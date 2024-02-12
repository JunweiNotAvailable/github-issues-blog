import { isDark } from "@/utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UiwMarkdownEditor from "@uiw/react-markdown-editor";
import styles from '../styles/post.module.css';
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  post: any
}

const PostItem: React.FC<Props> = React.memo(({ post }) => {

  const router = useRouter();

  // get post route - /user/repo/issue_number
  const getRoute = () => `/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[1]}/${post.repository_url.match(/\/repos\/([^\/]+)\/([^\/]+)/)[2]}/${post.number}`;

  return (
    <div className="mb-4 py-4 border border-slate-200 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => router.push(getRoute())}>
      {/* title, body & labels */}
      <div className="mt-1 px-4">
        {/* title */}
        <div className={"font-semibold"}>{post.title}</div>
        {/* body */}
        <div className="mt-2">
          <UiwMarkdownEditor.Markdown className={styles.markdownContent} source={post.body} />
        </div>
        {/* labels */}
        <div className="flex flex-wrap mt-3">
          {post.labels.map((label: any, i: number) =>
            <div
              className="text-xs mr-2 my-1 px-3 py-1 rounded-full border"
              key={`${post.id}-label${i}`}
              style={{ borderColor: `#${label.color}`, background: `#${label.color}88`, color: isDark(`#${label.color}`) ? '#fff' : '#000' }}
            >{label.name}</div>)}
        </div>
      </div>
      {/* comments button */}
      <div className="px-4">
        <div className="mt-3 text-slate-400 py-1 px-3 text-xs font-bold rounded-full"><FontAwesomeIcon className="mr-2" icon={faComment} />{post.comments} Comment{post.comments === 1 ? '' : 's'}</div>
      </div>
    </div>
  );
})

export default PostItem;