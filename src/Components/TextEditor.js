/* eslint-disable react/prop-types */

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
//import { useState } from "react";
import { locales } from "@blocknote/core";
import { useEffect } from "react";
import { URL } from "../services/request";

const TextEditor = ({ title, setValue, replaceData, file, editable=true }) => {
  const editor = useCreateBlockNote({
    dictionary: locales.fr,
  });

  useEffect(() => {
    if (replaceData) {
      replaceBlocks();
    }
  }, [replaceData]);

  useEffect(() => {
    if (file) {
      addBlocks();
    }
  }, [file]);

  const onChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const html = await editor.blocksToHTMLLossy(editor.document);
    //setHTML(html);
    setValue(html);
  };

  const replaceBlocks = async () => {
    const blocks = await editor.tryParseHTMLToBlocks(replaceData);
    editor.replaceBlocks(editor.document, blocks);
    console.log(blocks);
  };

  const addBlocks = () => {
    console.log(editor?.getTextCursorPosition());
    const data = {
      type: file.type,
      props: {
        url: URL+""+ file.url,
        caption:
        file.original_name,
      },
    };
    console.log(editor)
    if (editor.isEditable) {
      editor?.insertBlocks(
        [data],
        editor?.getTextCursorPosition()?.block?.id,
        "after"
      );
    }
  };
  return (
    <>
      <div className="w-100">
        <div className="wrapper">
          <div className="text-primary fw-bold">{title} :</div>
          <div className="item my-3">
            <BlockNoteView editor={editor} onChange={onChange} editable={editable} />
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
