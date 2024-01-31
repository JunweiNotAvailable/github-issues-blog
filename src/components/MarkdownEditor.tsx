"use client"

import React, { useRef, useState } from "react";
import styles from '../styles/newpost.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faCode, faHeading, faItalic, faLink, faListOl, faListUl, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import UIWMarkdownEditor from '@uiw/react-markdown-editor';

interface Props {
  source: string
  setSource: React.Dispatch<React.SetStateAction<string>>
}

const MarkdownEditor: React.FC<Props> = ({ source, setSource }) => {

  const textareaRef = useRef(null);
  // the current mode of editor - write/preview
  const [mode, setMode] = useState('write');

  return (
    <div className="flex-1 flex flex-col border rounded-lg min-h-72 p-2" style={{ borderColor: '#dadbdc' }}>
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <button className={`${styles.mdEditorButton}`} style={{ color: mode === 'write' ? '#444' : '#888', background: mode === 'write' ? 'var(--color-secondary-hover)' : '' }} onClick={() => setMode('write')}>Write</button>
          <button className={`${styles.mdEditorButton} ml-2`} style={{ color: mode === 'preview' ? '#444' : '#888', background: mode === 'preview' ? 'var(--color-secondary-hover)' : '' }} onClick={() => setMode('preview')}>Preview</button>
        </div>
        {mode === 'write' && <div className={styles.actionBar}>
          <button onClick={() => {

          }}><FontAwesomeIcon icon={faHeading} /></button>
          <button onClick={() => {

          }}><FontAwesomeIcon icon={faBold} /></button>
          <button onClick={() => {

          }}><FontAwesomeIcon icon={faItalic} /></button>
          <button onClick={() => {

          }}><FontAwesomeIcon icon={faCode} /></button>
          <button onClick={() => {

          }}><FontAwesomeIcon icon={faLink} /></button>
          <button onClick={() => {

          }}><FontAwesomeIcon icon={faListOl} /></button>
          <button onClick={() => {

          }}><FontAwesomeIcon icon={faListUl} /></button>
        </div>}
      </div>
      {/* text area */}
      {mode === 'write' ? <textarea ref={textareaRef} className="resize-none border mt-2 w-full flex-1" placeholder="Add description..." value={source} onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSource(e.target.value)} />
        : <div className="mt-2 w-full flex-1 p-2"><UIWMarkdownEditor.Markdown source={source} /></div>}
    </div>
  );
}

export default MarkdownEditor;