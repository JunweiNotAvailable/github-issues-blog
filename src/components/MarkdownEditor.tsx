"use client"

import React, { useEffect, useRef, useState } from "react";
import styles from '../styles/newpost.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faCode, faHeading, faItalic, faLink, faListOl, faListUl } from "@fortawesome/free-solid-svg-icons";
import UIWMarkdownEditor from '@uiw/react-markdown-editor';
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";

interface Props {
  source: string
  setSource: React.Dispatch<React.SetStateAction<string>>
}

const MarkdownEditor: React.FC<Props> = ({ source, setSource }) => {

  const textareaRef = useRef(null);
  const [mode, setMode] = useState('write'); // the current mode of editor - write/preview
  const [history, setHistory] = useState<string[]>([source]);

  useEffect(() => {
    // save the history
    setHistory(prev => [...prev, source]);
  }, [source]);

  // insert markdown format 
  const insertMarkdownFormat = (format: string) => {
    const easyFormats = {
      heading: { start: '### ', end: '' },
      bold: { start: '**', end: '**' },
      italic: { start: '*', end: '*' },
      code: { start: '`', end: '`' },
      link: { start: '[', end: '](url)' },
    }
    const textarea = textareaRef.current as any as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (format === 'ol' || format === 'ul') {
      // insert list
      const lines = textarea.value.split('\n'); // array of all lines
      const currLineIndex = textarea.value.substring(0, start).split('\n').length - 1; // get index of line the cursor is on
      // combine all lines with list format
      const newText = lines.reduce((prev, currLine, i) => {
        if (i === currLineIndex) {
          if (format === 'ol') { // numeric list
            if (/^[-*]\s/.test(currLine)) currLine = currLine.replace(/^[-*]\s/, '');
            currLine = (/^\d+\.\s/.test(currLine) ? currLine.replace(/^\d+\.\s/, '') : `1. ${currLine}`);
          } else { // bullet list
            if (/^\d+\.\s/.test(currLine)) currLine = currLine.replace(/^\d+\.\s/, '');
            currLine = (/^[-*]\s/.test(currLine) ? currLine.replace(/^[-*]\s/, '') : `- ${currLine}`);
          }
        }
        return `${prev}\n${currLine}`;
      });
      setSource(newText);
      // Focus on the textarea and set the cursor position
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(start, end), 10);
    } else {
      // insert easy format
      const selectedText = textarea.value.substring(start, end);
      const newText = `${textarea.value.slice(0, start)}${easyFormats[format as keyof typeof easyFormats].start}${selectedText}${easyFormats[format as keyof typeof easyFormats].end}${textarea.value.slice(end)}`;
      setSource(newText);
      // Set the new selection range (end of selected text)
      const newSelectionStart = start + easyFormats[format as keyof typeof easyFormats].start.length;
      const newSelectionEnd = newSelectionStart + selectedText.length;
      // Focus on the textarea and set the cursor position
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(newSelectionStart, newSelectionEnd), 10);
    }
  };

  // generate list format when pressing enter
  const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = textareaRef.current as any as HTMLTextAreaElement;
      let lines = textarea.value.split('\n');
      const prevLineIndex = textarea.value.substring(0, textarea.selectionStart).split('\n').length - 2;
      if (/^[-*]\s/.test(lines[prevLineIndex].trim())) { // the previous line is ul
        lines[prevLineIndex + 1] = (' '.repeat(/^(\s*)[-*]\s/.exec(lines[prevLineIndex])?.[1].length || 0)) + '- ' + lines[prevLineIndex + 1];
        const newText = lines.reduce((prev, currLine, i) => prev + '\n' + currLine);
        setSource(newText);
      } else if (/^\d+\.\s/.test(lines[prevLineIndex].trim())) {
        const match = /^(\s*)\d+\.\s/.exec(lines[prevLineIndex]);
        lines[prevLineIndex + 1] = (' '.repeat(match?.[1].length || 0)) + `${parseInt(match?.[0] || '1') + 1}. ` + lines[prevLineIndex + 1];
        const newText = lines.reduce((prev, currLine, i) => prev + '\n' + currLine);
        setSource(newText);
      }
      const newPosition = lines.slice(0, prevLineIndex + 2).reduce((prev, currLine, i) => prev + currLine.length + 1, 0) - 1;
      textarea.focus();
      setTimeout(() => textarea.setSelectionRange(newPosition, newPosition), 10);
    }
  }

  return (
    <div className="flex-1 flex flex-col border rounded-lg min-h-72 p-2" style={{ borderColor: '#dadbdc' }}>
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <button className={`${styles.mdEditorButton}`} style={{ color: mode === 'write' ? '#444' : '#888', background: mode === 'write' ? 'var(--color-secondary-hover)' : '' }} onClick={() => setMode('write')}>Write</button>
          <button className={`${styles.mdEditorButton} ml-2`} style={{ color: mode === 'preview' ? '#444' : '#888', background: mode === 'preview' ? 'var(--color-secondary-hover)' : '' }} onClick={() => setMode('preview')}>Preview</button>
        </div>
        {mode === 'write' && <div className={styles.actionBar}>
          <button onClick={() => insertMarkdownFormat('heading')}><FontAwesomeIcon icon={faHeading} /></button>
          <button onClick={() => insertMarkdownFormat('bold')}><FontAwesomeIcon icon={faBold} /></button>
          <button onClick={() => insertMarkdownFormat('italic')}><FontAwesomeIcon icon={faItalic} /></button>
          <button onClick={() => insertMarkdownFormat('code')}><FontAwesomeIcon icon={faCode} /></button>
          <button onClick={() => insertMarkdownFormat('link')}><FontAwesomeIcon icon={faLink} /></button>
          <button onClick={() => insertMarkdownFormat('ol')}><FontAwesomeIcon icon={faListOl} /></button>
          <button onClick={() => insertMarkdownFormat('ul')}><FontAwesomeIcon icon={faListUl} /></button>
        </div>}
      </div>
      {/* textarea / preview */}
      {mode === 'write' ?
        <div className="flex flex-col flex-1">
          <textarea ref={textareaRef} className="resize-none border mt-2 w-full flex-1" placeholder="Add description... (At least 30 characters)" value={source} onKeyDown={(e) => setTimeout(() => handlePressEnter(e), 10)} onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSource(e.target.value)} />
          <div className="text-xs text-gray-400 mt-1"><FontAwesomeIcon icon={faMarkdown} className="mr-1" />Markdown</div>
        </div>
        : <div className="mt-2 w-full flex-1 p-2"><UIWMarkdownEditor.Markdown source={source} /></div>}
    </div>
  );
}

export default MarkdownEditor;