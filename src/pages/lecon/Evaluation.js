/* eslint-disable no-undef */
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import request from "../../services/request";
import endPoint from "../../services/endPoint";
import { AppContext } from "../../services/context";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../Components/TextEditor";
import InputField from "../../Components/InputField";
import DOMPurify from "dompurify";
import PageHeader from "../../Components/PageHeader";
import Table from "../../Components/Table";
import TableHeader from "../../Components/TableHeader";
import TableContent from "../../Components/TableContent";
import Retour from "../../Components/Retour";

const initData = {
  label: "",
  abreviation: "",
  type_de_correction: "",
  type: "pdf",
  lecon: "",
  description: "",
};
const Evaluation = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [lecon, setLecon] = useState({});
  const [editId, setEditId] = useState("");
  const { slug } = useParams();
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState("")
  const [cours, setCours] = useState("");

  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    get();
  }, [refresh, editId]);
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


  return (
    <>
      <div className="card p-4 border">
        <div className="text-primary">
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
              lecon.periode?.abreviation}
          </span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Description : </span>
          <span className="d-inline-block">{lecon.description}</span>
        </div>
      </div>
      <EvaluationListe lecon={slug} />
    </>
  );
};

const EvaluationListe = ({ lecon }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [viewData, setViewData] = useState({});
  const [view, setView] = useState("liste");
  const [enonce, setEnonce] = useState("");
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState("");
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();
  const fileSize = {
    video: "La taille maximale des vidéos ne doit pas dépasser 20 mégaoctets.",
    audio: "La taille maximale des audios ne doit pas dépasser 5 mégaoctets.",
    image: "La taille maximale des images ne doit pas dépasser 1 mégaoctets.",
    file: "La taille maximale des fichiers (PDF) ne doit pas dépasser 1 mégaoctets.",
  };

  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    if (editId && editId.length !== 0) {
      getFile()
    }
  }, [refresh, editId]);
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
      values.lecon = lecon;
      values.enonce = enonce
      if (editId === "") {
        handleSubmit(values);
      } else {
        values._method = "put";
        handleEditSubmit(values);
      }
    },
  });

  const formikFile = useFormik({
    initialValues: { type: "", files: "" },
    //validationSchema: validateData,
    onSubmit: (values) => {
      values.evaluation = editId;
      sendFile(values);
    },
  });

  const getAll = () => {
    request
      .get(endPoint.evaluations_lecons + "/lecon/" + lecon, header)
      .then((res) => {
        setDatas(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getFile = () => {
    request
      .get(endPoint.files_evaluation_lecon + "/evaluation/" + editId, header)
      .then((res) => {
        setFiles(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const sendFile = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.files_evaluation_lecon, data, header), {
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

  const handleSubmit = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.evaluations_lecons, data, header), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          const res = data;
          setEditId(res.data.data.slug)
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
      request.post(endPoint.evaluations_lecons + "/" + editId, data, header),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            console.log(data);
            const res = data;
            //setEditId("");
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

  const onDelete = () => {
    toast.promise(
      request.delete(endPoint.evaluations_lecons + "/" + viewData.slug, header),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
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
      }
    );
  };

  const addModal = (e) => {
    e.preventDefault();
    setEditId("");
    formik.resetForm();
  };
  const setEditeData = (e, data) => {
    e.preventDefault();
    console.log(data);
    setView("form")
    setEditId(data.slug);

    formik.setFieldValue("label", data.label);
    formik.setFieldValue("enonce", data.enonce);
    formik.setFieldValue("abreviation", data.abreviation);
    formik.setFieldValue("description", data.description);
  };

  const goToDetail = (e, data) => {
    e.preventDefault();
    navigate(data);
  };

  const changeView = (type) => {
    setView(type)
    setEditId("");
    setFiles([])
  }

  return (
    <>
      {
        view === "liste" ? <>
          <PageHeader
            title=""
          //modal=""
          //addModal={addModal}
          //canCreate={user.permissions?.includes("create evaluationLecon")}

          />
          <div className="mt-3 fw-bold fs-4 text-primary">
            Liste des evaluations
          </div>
          <div className="d-flex mb-1">
            <div className="fw-bold me-auto">{datas.length} resultats</div>
            <div>
              {
                user.permissions?.includes("create evaluationLecon") && <button className="btn-sm btn-primary me-1 rounded" onClick={e => {
                  e.preventDefault()
                  setView("forme")
                }}>Ajouter</button>
              }

              <Retour />
            </div>
          </div>
          <Table>
            <TableHeader>
              <th scope="col" className="border-raduis-left">
                #
              </th>
              <th scope="col">Evaluation</th>
              <th scope="col">Abreviation</th>
              <th scope="col">Type de correction</th>
              <th scope="col">Description</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </TableHeader>
            <TableContent>
              {datas.map((data, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      <input type="checkbox" value="selected" />
                    </td>

                    <td className="fw-bold1">{data.label}</td>
                    <td className="fw-bold1">{data.abreviation}</td>
                    <td className="fw-bold text-danger">{data.type_de_correction}</td>

                    <td className="fw-bold1">{data.description}</td>
                    <td className="text-center">
                      <div className="btn-group">
                        {user.permissions?.includes("view questionLecon") && (
                          <div className="d-inline-block mx-1">
                            <button
                              className="btn btn-primary-light"
                              data-bs-toggle="modal"
                              data-bs-target="#view"
                              onClick={e => {
                                e.preventDefault()
                                setViewData(data);
                              }}
                            >
                              <span>Voir</span>
                            </button>
                          </div>
                        )}
                        {user.permissions?.includes("view questionLecon") && (
                          <div className="d-inline-block mx-1">
                            <button
                              className="btn btn-primary-light"
                              //data-bs-toggle="modal"
                              //data-bs-target="#view"
                              onClick={(e) => {
                                goToDetail(e, data.slug + "/reponses");
                              }}
                            >
                              <span>Réponses</span>
                            </button>
                          </div>
                        )}
                        {user.permissions?.includes("view questionLecon") && (
                          <div className="d-inline-block mx-1">
                            <button
                              className="btn btn-primary-light"
                              //data-bs-toggle="modal"
                              //data-bs-target="#view"
                              onClick={(e) => {
                                goToDetail(e, data.slug);
                              }}
                            >
                              <span> Questions</span>
                            </button>
                          </div>
                        )}
                        {user.permissions?.includes("update evaluationLecon") && (
                          <div className="d-inline-block mx-1">
                            <button
                              className="btn btn-primary-light"
                              //data-bs-toggle="modal"
                              //data-bs-target="#form"
                              onClick={(e) => {
                                setEditeData(e, data);
                              }}
                            >
                              <i class="bi bi-pencil-square"></i>
                            </button>
                          </div>
                        )}
                        {user.permissions?.includes("delete evaluationLecon") && (
                          <div className="d-inline-block mx-1">
                            <button
                              className="btn btn-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#delete"
                              onClick={(e) => {
                                setViewData(data);
                              }}
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </TableContent>
          </Table>
        </> : <>
          <div className="row">
            <div className="d-flex mb-1">
              <div className="ms-auto mt-3">
                <button className="btn-sm btn-primary me-1 rounded" onClick={e => {
                  e.preventDefault()
                  changeView("liste")
                }}>Annuler</button>
              </div>
            </div>
            <div className="col-12 col-md-8">
              <form className="card p-4 my-2 border" onSubmit={formik.handleSubmit}>
                <InputField
                  type={"text"}
                  name="label"
                  formik={formik}
                  placeholder="Intitulé de l'evaluation"
                  label={"Evaluation"}
                />
                <InputField
                  type={"text"}
                  name="abreviation"
                  formik={formik}
                  placeholder="Abreviation de l'intitulé"
                  label={"Abreviation"}
                />
                <InputField
                  type={"select"}
                  name="type_de_correction"
                  formik={formik}
                  placeholder="Sélectionnez le type correction"
                  label={"Type de correction"}
                  options={[
                    {
                      label: "Correction automatique", value: "Correction automatique",

                    },
                    {
                      label: "Correction manuelle", value: "Correction manuelle",

                    },
                  ]}
                />

                <TextEditor
                  title={"Enoncé de l'exercice"}
                  replaceData={formik.values['enonce'] && formik.values['enonce']}
                  setValue={setEnonce}
                  file={file}
                />

                <InputField
                  type={"textaera"}
                  name="description"
                  formik={formik}
                  placeholder="Description du chapitre"
                  label={"Description"}
                />

                <div className="d-flex justify-content-start border-0">
                  <button
                    type="reset"
                    className="btn btn-secondary me-2"
                    //data-bs-dismiss="modal"
                    onClick={e => {
                      e.preventDefault()
                      changeView("liste")
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Enregistrer
                  </button>
                  {user.permissions?.includes("view questionLecon") && (
                          <div className="d-inline-block mx-1">
                            <button
                              className="btn btn-primary-light"
                              //data-bs-toggle="modal"
                              //data-bs-target="#view"
                              onClick={(e) => {
                                goToDetail(e, data.slug);
                              }}
                            >
                              <span> Ajouter des Questions</span>
                            </button>
                          </div>
                        )}
                </div>
              </form>
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
                  {
                    (editId && editId.length !== 0) && <>
                      <button
                        onClick={formikFile.handleSubmit}
                        className="btn btn-primary w-75"
                      >
                        Enregistrer
                      </button>
                    </>
                  }
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
                            <span className="fw-bold">
                              {"Taille : " + data.taille}
                            </span>
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
      }

      <div className="modal fade" id="form">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {editId !== ""
                  ? "Modification d'une evaluation"
                  : "Ajout d’une evaluation"}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <InputField
                  type={"text"}
                  name="label"
                  formik={formik}
                  placeholder="Intitulé de l'evaluation"
                  label={"Evaluation"}
                />
                <InputField
                  type={"text"}
                  name="abreviation"
                  formik={formik}
                  placeholder="Abreviation de l'intitulé"
                  label={"Abreviation"}
                />
                <InputField
                  type={"select"}
                  name="type_de_correction"
                  formik={formik}
                  placeholder="Sélectionnez le type correction"
                  label={"Type de correction"}
                  options={[
                    {
                      label: "Correction automatique", value: "Correction automatique",

                    },
                    {
                      label: "Correction manuelle", value: "Correction manuelle",

                    },
                  ]}
                />
                <InputField
                  type={"files"}
                  name="abreviation"
                  formik={formik}
                  placeholder="Abreviation de l'intitulé"
                  label={"Images"}
                />
                <InputField
                  type={"textaera"}
                  name="enonce"
                  formik={formik}
                  placeholder="Enoncé de l'exercice"
                  label={"Enoncé"}
                />

                <InputField
                  type={"textaera"}
                  name="description"
                  formik={formik}
                  placeholder="Description du chapitre"
                  label={"Description"}
                />

                <div className="d-flex justify-content-start border-0">
                  <button
                    type="reset"
                    className="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="view">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Informations
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div>
                <span className="fw-bold d-inline-block me-2">Evaluation : </span>
                <span className="d-inline-block">{viewData.label}</span>
              </div>
              <div>
                <span className="fw-bold d-inline-block me-2">
                  Abreviation :{" "}
                </span>
                <span className="d-inline-block">{viewData.abreviation}</span>
              </div>
              <div>
                <span className="fw-bold d-inline-block me-2">Type de correction : </span>
                <span className="d-inline-block">
                  {viewData.type_de_correction}
                </span>
              </div>
              {
                viewData.enonce && <div>
                  <span className="fw-bold d-inline-block me-2">
                    Enoncé :{" "}
                  </span>
                  <div dangerouslySetInnerHTML={{ __html: viewData.enonce }} />
                </div>
              }
              <div>
                <span className="fw-bold d-inline-block me-2">
                  Description :{" "}
                </span>
                <span className="d-inline-block">{viewData.description}</span>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button className="btn btn-primary" data-bs-dismiss="modal">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="delete">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">Suppression</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div>Voulez-vous supprimer définitivement les données ?</div>
              <div className="mt-4 d-flex justify-content-end">
                <button
                  className="btn btn-primary me-2"
                  data-bs-dismiss="modal"
                >
                  Non
                </button>
                <button
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={onDelete}
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Evaluation;
