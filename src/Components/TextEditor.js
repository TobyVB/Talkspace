import React, { useEffect, useRef, useCallback } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export default function TextEditor() {

    const TOOLBAR_OPTIONS = [
        ['bold', 'italic', 'underline', 'strike', 'clean'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video']
    ]

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper === null) return

        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        new Quill(editor, { theme: "snow", modules: {
            toolbar: TOOLBAR_OPTIONS
        } })
    }, [])
    return <div className="container" ref={wrapperRef}></div>
}