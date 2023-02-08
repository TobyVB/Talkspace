import React, { useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

export default function TextEditor(props) {
  const [value, setValue] = useState("");

  const modules = {
    toolbar: [
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
      ["link", "image", "video"],
      ["clean"],
    ],
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };

  useEffect(() => {
    setValue(props.foundValue);
  }, [props.foundValue]);

  useEffect(() => {
    props.captureValue(value);
    props.createPost === false &&
      props.setPostObj((prev) => {
        return { ...prev, text: value };
      });
  }, [value]);

  return (
    <>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
      />
    </>
  );
}
