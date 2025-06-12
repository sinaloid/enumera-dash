import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { URL as ur } from "../services/request";
import ReactDOMServer from "react-dom/server";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

const Tinymce = ({
  title,
  setValue,
  replaceData,
  file,
  editable = true,
  onInsertFile,
}) => {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      //console.log(editorRef.current.getContent());
      editorRef.current.setContent(replaceData);
    }
  };

  useEffect(() => {
    if (onInsertFile) {
      //onInsertFile(insertFile);
      console.log(onInsertFile);
      insertFile(ur + "" + onInsertFile.url, onInsertFile.type);
    }
  }, [onInsertFile]);

  /*useEffect(() => {
        if (replaceData) {
            //replaceBlocks();
        }
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
            editorRef.current = replaceData;
        }
    }, [replaceData]);*/

  const handleSave = () => {
    if (editorRef.current) {
      //console.log("Contenu de TinyMCE:", editorRef.current.getContent());
      setValue(editorRef.current.getContent());
    }
  };

  const insertFile = async (fileUrl, fileType) => {
    if (!editorRef.current) return;

    let html = "";

    switch (fileType) {
      case "image":
        html = `<img src="${fileUrl}" alt="image" style="max-width: 100%;" />`;
        break;
      case "audio":
        html = `<audio controls><source src="${fileUrl}" type="audio/mpeg">Votre navigateur ne supporte pas l'audio.</audio>`;
        break;
      case "video":
        html = `<video controls style="max-width:100%;"><source src="${fileUrl}" type="video/mp4">Votre navigateur ne supporte pas la vidéo.</video>`;
        break;
      case "pdf":
        //html = `<iframe src="${fileUrl}" width="100%" height="500px" style="border:none;"></iframe>`;
        //html = ReactDOMServer.renderToStaticMarkup(<PDFViewer url={fileUrl} />);
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        html = `<iframe src="${blobUrl}" width="100%" height="500px"></iframe>`;
        break;
      default:
        html = `<a href="${fileUrl}" target="_blank">Télécharger le fichier</a>`;
    }
    console.log("HTML to insert:", html);
    editorRef.current.insertContent(html);
  };

  return (
    <>
      <Editor
        tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={replaceData}
        init={{
          selector: "textarea#full-featured",
          plugins:
            "code preview casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown revisionhistory",
          tinydrive_token_provider: "URL_TO_YOUR_TOKEN_PROVIDER",
          tinydrive_dropbox_app_key: "YOUR_DROPBOX_APP_KEY",
          tinydrive_google_drive_key: "YOUR_GOOGLE_DRIVE_KEY",
          tinydrive_google_drive_client_id: "YOUR_GOOGLE_DRIVE_CLIENT_ID",
          paste_data_images: true,
          mobile: {
            plugins:
              "code preview casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate",
          },
          menu: {
            tc: {
              title: "Comments",
              items: "addcomment showcomments deleteallconversations",
            },
          },
          menubar: "file edit view insert format tools table tc help",
          toolbar:
            "code undo redo | revisionhistory | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table math media pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | charmap emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck", // Note: if a toolbar item requires a plugin, the item will not present in the toolbar if the plugin is not also loaded.
          autosave_ask_before_unload: true,
          autosave_interval: "30s",
          autosave_prefix: "{path}{query}-{id}-",
          autosave_restore_when_empty: false,
          autosave_retention: "2m",
          image_advtab: true,
          typography_rules: [
            "common/punctuation/quote",
            "en-US/dash/main",
            "common/nbsp/afterParagraphMark",
            "common/nbsp/afterSectionMark",
            "common/nbsp/afterShortWord",
            "common/nbsp/beforeShortLastNumber",
            "common/nbsp/beforeShortLastWord",
            "common/nbsp/dpi",
            "common/punctuation/apostrophe",
            "common/space/delBeforePunctuation",
            "common/space/afterComma",
            "common/space/afterColon",
            "common/space/afterExclamationMark",
            "common/space/afterQuestionMark",
            "common/space/afterSemicolon",
            "common/space/beforeBracket",
            "common/space/bracket",
            "common/space/delBeforeDot",
            "common/space/squareBracket",
            "common/number/mathSigns",
            "common/number/times",
            "common/number/fraction",
            "common/symbols/arrow",
            "common/symbols/cf",
            "common/symbols/copy",
            "common/punctuation/delDoublePunctuation",
            "common/punctuation/hellip",
          ],
          typography_ignore: ["code"],
          advtemplate_list: () => {
            return Promise.resolve([
              {
                id: "1",
                title: "Resolving tickets",
                content:
                  "<p>As we have not heard back from you in over a week, we have gone ahead and resolved your ticket.</p>",
              },
              {
                id: "2",
                title: "Quick replies",
                items: [
                  {
                    id: "3",
                    title: "Message received",
                    content:
                      "<p>Just a quick note to say we have received your message, and will get back to you within 48 hours.</p>",
                  },
                  {
                    id: "4",
                    title: "Progress update",
                    content:
                      "</p>Just a quick note to let you know we are still working on your case</p>",
                  },
                ],
              },
            ]);
          },
          link_list: [
            { title: "My page 1", value: "https://www.tiny.cloud" },
            { title: "My page 2", value: "http://www.moxiecode.com" },
          ],

          importcss_append: true,
          height: 600,
          image_caption: true,
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
          noneditable_class: "mceNonEditable",
          toolbar_mode: "sliding",
          spellchecker_ignore_list: [
            "Ephox",
            "Moxiecode",
            "tinymce",
            "TinyMCE",
          ],
          tinycomments_mode: "embedded",
          content_style: ".mymention{ color: gray; }",
          contextmenu: "link image editimage table configurepermanentpen",
          a11y_advanced_options: true,
          //skin: useDarkMode ? 'oxide-dark' : 'oxide',
          //content_css: useDarkMode ? 'dark' : 'default',
          /*
                    The following settings require more configuration than shown here.
                    For information on configuring the mentions plugin, see:
                    https://www.tiny.cloud/docs/tinymce/6/mentions/.
                    */
          mentions_selector: ".mymention",
          //  mentions_fetch: mentions_fetch, // TODO: Implement mentions_fetch
          //mentions_menu_hover: mentions_menu_hover, // TODO: Implement mentions_menu_hover
          //mentions_menu_complete: mentions_menu_complete, // TODO: Implement mentions_menu_complete
          //mentions_select: mentions_select, // TODO: Implement mentions_select
          images_upload_handler: function (blobInfo, success, failure) {
            // Gérer l'upload des images ici si vous voulez les télécharger sur un serveur
            //alert('ok')
          },
          automatic_uploads: true,
          mentions_item_type: "profile",
          autocorrect_capitalize: true,
          mergetags_list: [
            {
              title: "Client",
              menu: [
                {
                  value: "Client.LastCallDate",
                  title: "Call date",
                },
                {
                  value: "Client.Name",
                  title: "Client name",
                },
              ],
            },
            {
              title: "Proposal",
              menu: [
                {
                  value: "Proposal.SubmissionDate",
                  title: "Submission date",
                },
              ],
            },
            {
              value: "Consultant",
              title: "Consultant",
            },
            {
              value: "Salutation",
              title: "Salutation",
            },
          ],
          revisionhistory_fetch: () => {
            // Implement the fetch function for the revision history plugin
            return Promise.resolve([
              {
                revisionId: "1",
                createdAt: "2023-11-24T22:26:21.578Z",
                content: "<p>Initial content</p>",
              },
            ]);
          },
          image_uploadtab: true,
          images_file_types: "jpeg,jpg,png",
          images_upload_handler: (blobInfo) => {
            const base64str =
              "data:" + blobInfo.blob().type + ";base64," + blobInfo.base64();
            return Promise.resolve(base64str);
          },
        }}
        onEditorChange={handleSave}
      />
      {/**
       * <PDFViewer url={"https://api.enumera.tech/storage/uploads/8URhjDwcmEbTJTderNLOV86oM1hnfOxM2NTafhIP.pdf"} />
          <iframe src="https://api.enumera.tech/storage/uploads/8URhjDwcmEbTJTderNLOV86oM1hnfOxM2NTafhIP.pdf" width="100%" height="500px"></iframe>
       */}
    </>
  );
};

export default Tinymce;

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min4.js`;
function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={url}
        onLoadError={console.error}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
}
