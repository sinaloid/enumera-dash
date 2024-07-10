import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";
import { locales } from "@blocknote/core";

const TextEditor = () => {
  const editor = useCreateBlockNote({
    dictionary: locales.fr,
  });
  const [html, setHTML] = useState("");
  console.log(editor);

  const onChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const html = await editor.blocksToHTMLLossy(editor.document);
    setHTML(html);
  };
  return (
    <>
      <div className="w-100">
        <div className="wrapper">
          <div className="fs-4 text-primary">Editeur de cours :</div>
          <div className="item">
            <BlockNoteView editor={editor} onChange={onChange} />
          </div>
          {/**
           * <div>Output (HTML):</div>
          <div className="item bordered">
            <pre>
              <code>{html}</code>
            </pre>
          </div>
           */}
        </div>
      </div>
    </>
  );
};

export default TextEditor;
