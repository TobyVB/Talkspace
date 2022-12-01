import React, { useEffect, useState } from "react";
import Quill from "quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";

export default function TextEditor() {
  const TOOLBAR_OPTIONS = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  const [value, setValue] = useState("");

  return (
    <>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <p>{parse(value)}</p>
    </>
  );
}
