import React from "react";
import { Editor } from "@tinymce/tinymce-react";


const TextEditor = ({ name, onChange, height = 500, width = "100%", value = "<p>This is the initial content of the editor</p>" }) => <div style={{ marginTop: 10 }}>
  <Editor
    tagName={name}
    initialValue={value}
    init={{
      height,
      width,
      menubar: true,
      // toolbar: false,
      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
      ],
      // toolbar:
      //   "undo redo | formatselect | bold italic backcolor | \
      //        alignleft aligncenter alignright alignjustify | \
      //        bullist numlist outdent indent | removeformat | help",
    }}
    onEditorChange={(content) => onChange(name, content)}
  />
</div>

export default TextEditor;