/* eslint-disable no-undef */
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import request from "../../services/request";
import endPoint from "../../services/endPoint";
import { AppContext } from "../../services/context";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import TextEditor from "../../Components/TextEditor";
import InputField from "../../Components/InputField";
import DOMPurify from "dompurify";

const initData = {
  label: "",
  abreviation: "",
  type: "pdf",
  lecon: "",
  description: "",
};
const LeconDetail = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [lecon, setLecon] = useState({});
  const [editId, setEditId] = useState("");
  const { slug } = useParams();
  const [files, setFiles] = useState([]);
  const [cours, setCours] = useState("");
  const [file, setFile] = useState("");
  const fileSize = {
    video: "La taille maximale des vidéos ne doit pas dépasser 20 mégaoctets.",
    audio: "La taille maximale des audios ne doit pas dépasser 5 mégaoctets.",
    image: "La taille maximale des images ne doit pas dépasser 1 mégaoctets.",
    file: "La taille maximale des fichiers (PDF) ne doit pas dépasser 1 mégaoctets.",
  };
  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    get();
    getFile();
  }, [refresh]);
  const validateData = Yup.object({
    label: Yup.string()
      .min(3, "Le nom de la catégorie doit contenir 3 caractères ou moins")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    image: Yup.mixed()
      .required("Une image est requise")
      .test(
        "fileFormat",
        "Seuls les fichiers jpeg, png et gif sont autorisés",
        (value) => {
          return (
            value &&
            ["image/jpeg", "image/png", "image/gif"].includes(value.type)
          );
        }
      )
      .test("fileSize", "La taille maximale autorisée est de 2 Mo", (value) => {
        return value && value.size <= 2 * 1024 * 1024;
      }),
  });
  const formik = useFormik({
    initialValues: initData,
    //validationSchema: validateData,
    onSubmit: (values) => {
      values.label = lecon.label;
      values.abreviation = lecon.abreviation;
      values.lecon = lecon.slug;
      values.description = cours;
      if (values.slug) {
        values._method = "put";
        handleEditSubmit(values);
      } else {
        handleSubmit(values);
      }
    },
  });

  const formikFile = useFormik({
    initialValues: { type: "", files: "" },
    //validationSchema: validateData,
    onSubmit: (values) => {
      values.lecon = slug;
      sendFile(values);
    },
  });

  const get = () => {
    request
      .get(endPoint.lecons + "/" + slug, header)
      .then((res) => {
        setLecon(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getFile = () => {
    request
      .get(endPoint.files + "/lecon/" + slug, header)
      .then((res) => {
        setFiles(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.cours, data, header), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);
          const res = data;
          setRefresh(refresh + 1);
          return res.data.message;
        },
      },
      error: {
        render({ data }) {
          console.log(data);
          return data.response.data.errors
            ? data.response.data.errors
            : data.response.data.error;
        },
      },
    });
  };
  const handleEditSubmit = (data) => {
    toast.promise(
      request.post(endPoint.cours + "/" + data.slug, data, header),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            console.log(data);
            const res = data;
            setEditId("");
            setRefresh(refresh + 1);
            return res.data.message;
          },
        },
        error: {
          render({ data }) {
            console.log(data);
            return data.response.data.errors
              ? data.response.data.errors
              : data.response.data.error;
          },
        },
      }
    );
  };

  const sendFile = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.files, data, header), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);
          const res = data;
          setRefresh(refresh + 1);
          return res.data.message;
        },
      },
      error: {
        render({ data }) {
          console.log(data);
          return data.response.data.errors
            ? data.response.data.errors
            : data.response.data.error;
        },
      },
    });
  };

  return (
    <>
      <div className="card p-4 border">
        <div className="text-primary">
          <span className=" d-inline-block me-2 fs-1">Leçon : </span>
          <span className=" d-inline-block fs-1">{lecon.label}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Abreviation : </span>
          <span className="d-inline-block">{lecon.abreviation}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Chapitre : </span>
          <span className="d-inline-block">{lecon.chapitre?.label}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">
            Matière/Classe/Periode :{" "}
          </span>
          <span className="d-inline-block">
            {lecon.chapitre?.matiere_de_la_classe?.matiere?.abreviation +
              "/" +
              lecon.chapitre?.matiere_de_la_classe?.classe?.label +
              "/" +
              lecon.chapitre?.periode?.abreviation}
          </span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Description : </span>
          <span className="d-inline-block">{lecon.description}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-8">
          <div className="card p-4 my-2 border">
            {lecon.cours ? (
              <>
                <ViewCours
                  data={lecon.cours}
                  formik={formik}
                  setCours={setCours}
                  file={file}
                />
              </>
            ) : (
              <>
                <TextEditor
                  title={"Editeur de cours"}
                  setValue={setCours}
                  file={file}
                />
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-primary w-75"
                    onClick={formik.handleSubmit}
                  >
                    Enregistrer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card p-4 my-2 border">
            <div className="fs-4 text-primary text-center mb-4">
              Liste des resources
            </div>

            <div className="text-danger mb-3 fw-bold">
              {fileSize[formikFile.values.type]}
            </div>

            <InputField
              type="select"
              name={"type"}
              formik={formikFile}
              label={"Type de fichier"}
              placeholder={"Sélectionnez le type de fichier"}
              options={[
                { slug: "video", label: "Vidéos" },
                { slug: "audio", label: "Audios" },
                { slug: "image", label: "Images" },
                { slug: "file", label: "Fichiers" },
              ]}
            />
            <InputField
              type="files"
              name={"files"}
              formik={formikFile}
              label={"Fichier"}
            />
            <div className="d-flex justify-content-center">
              <button
                onClick={formikFile.handleSubmit}
                className="btn btn-primary w-75"
              >
                Enregistrer
              </button>
            </div>
            <div className="mt-5 border-top pt-1">
              <span className="fw-bold">Liste des fichiers</span>
              {files.map((data, idx) => {
                return (
                  <div
                    className="btn-secondary border border-primary rounded-2 pe-0 my-3"
                    key={data.slug}
                  >
                    <span className="text-primary fw-bold py-1 rounded">
                      {data.type}
                    </span>
                    <div className="d-flex justify-content-between rounded-5">
                      <div>
                        <span>{data.original_name}</span> <br />
                        <span className="fw-bold">{"Taille : " + data.taille}</span>
                      </div>
                      <br />
                      <div>
                        <span
                          className="bg-primary text-white px-2 rounded-2 fw-bold py-1 d-inline-block ms-1 mb-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setFile(data);
                          }}
                        >
                          <i class="bi bi-plus-circle-fill"></i>
                        </span>
                        <span className="bg-danger text-white px-2 rounded-2 fw-bold py-1 d-inline-block ms-1 mb-2">
                          <i class="bi bi-trash-fill"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ViewCours = ({ data, formik, setCours, file }) => {
  const [view, setView] = useState("view");
  useEffect(() => {
    formik.setFieldValue("slug", data.slug);
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("abreviation", data.abreviation);
    formik.setFieldValue("description", data.description);
    mediaConfig();
  }, [data]);
  const changeView = (e, name) => {
    e.preventDefault();
    setView(name);
  };

  const mediaConfig = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      video.controls = true;
      video.setAttribute("class", "w-100");
    });

    const audios = document.querySelectorAll("audio");
    audios.forEach((audio) => {
      audio.controls = true;
      audio.setAttribute("class", "w-100");
    });

    const images = document.querySelectorAll("image");
    images.forEach((image) => {
      image.setAttribute("class", "w-100");
    });

    console.log(videos);
  };
  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-outline-primary me-1"
          onClick={(e) => changeView(e, "view")}
        >
          Voir
        </button>
        <button
          className="btn btn-outline-warning me-1"
          onClick={(e) => changeView(e, "edit")}
        >
          Modifier
        </button>
        <button className="btn btn-outline-danger">De publier</button>
      </div>
      {view === "view" && (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data?.description),
            }}
          />
        </>
      )}
      {view === "edit" && (
        <>
          <TextEditor
            title={"Modification du cours"}
            replaceData={data?.description}
            setValue={setCours}
            file={file}
          />
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-primary w-75"
              onClick={formik.handleSubmit}
            >
              Enregistrer
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default LeconDetail;
