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

const initData = {
  label: "",
  abreviation: "",
  type: "pdf",
  lecon: "",
  description: "",
};
const ReponseLeconEleve = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [lecon, setLecon] = useState({});
  const [evaluation, setEvaluation] = useState({});
  const [editId, setEditId] = useState("");
  const { slug, evaluationSlug } = useParams();
  const [files, setFiles] = useState([]);
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
    getEvaluation();
  }, [refresh]);

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

  const getEvaluation = () => {
    request
      .get(endPoint.evaluations_lecons + "/" + evaluationSlug, header)
      .then((res) => {
        setEvaluation(res.data.data);
        //console.log(res.data.data);
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

  return (
    <>
      <div className="card p-4 border">
        <div className="text-primary">
          <span className=" d-inline-block me-2 fs-1">Evaluation : </span>
          <span className=" d-inline-block fs-1">{evaluation.label}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">leçon : </span>
          <span className="d-inline-block">{lecon.label}</span>
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
          <span className="fw-bold d-inline-block me-2">Type de correction : </span>
          <span className="d-inline-block fw-bold text-danger">
            {evaluation?.type_de_correction}
          </span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Description : </span>
          <span className="d-inline-block">{lecon.description}</span>
        </div>
      </div>
      <ReponseListe evaluation={evaluationSlug} />
    </>
  );
};

const initQuest = {
  question: "",
  choix: "",
  reponses: "",
  point: "",
  evaluation_lecon: "",
  type: "",
};
const ReponseListe = ({ evaluation }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const { evaluationSlug } = useParams();
  const [viewData, setViewData] = useState({});
  const [viewQuestion, setViewQuestion] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [view, setView] = useState("liste");
  const [correctionMode, setCorrectionMode] = useState(false);

  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
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
    initialValues: initQuest,
    //validationSchema: validateData,
    onSubmit: (values) => {
      //values.evaluation_lecon = evaluation;
      const tab = viewData.user_response.map((data) => {
        data.commentaire = values["commentaire" + data.slug] ? values["commentaire" + data.slug] : data.commentaire
        data.user_point = values["point" + data.slug] ? values["point" + data.slug] : data.user_point
        //const user_response = JSON.parse(data.user_response);
        return data
      })

      handleEditSubmit({
        _method: "put",
        slug_res_lecons_eleves: viewData.slug,
        user_response: tab
      });

      /*if (editId === "") {
        //handleSubmit(values);
      } else {
        values._method = "put";
        handleEditSubmit(values);
      }*/
    },
  });

  const formikFile = useFormik({
    initialValues: initQuest,
    //validationSchema: validateData,
    onSubmit: (values) => {
      values.evaluation_lecon = evaluation;
      handleSubmitFile(values);
    },
  });

  const getAll = () => {
    request
      //.get(endPoint.res_lecons_eleves + "/evaluation/" + evaluationSlug, header)
      .get(endPoint.res_lecons_eleves, header)
      .then((res) => {
        setDatas(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  const handleEditSubmit = (data) => {
    console.log(data)
    toast.promise(
      request.post(endPoint.res_lecons_eleves + "/" + data.slug_res_lecons_eleves, data, header),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            const res = data;
            setView("liste");
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

  const onDelete = () => {
    toast.promise(
      request.delete(endPoint.res_lecons_eleves + "/" + viewData.slug, header),
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

  const handleSubmitFile = (data) => {
    //setShowModal(true)
    toast.promise(
      request.post(endPoint.questions_lecons_import, data, header),
      {
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
      }
    );
  };

  const getUserDetailNote = (e,data) => {
    e.preventDefault()
    //console.log(data.user_response);
    //console.log(JSON.parse(data.user_response));
    setView("detail");
    data.user_response = JSON.parse(
      data.user_response
    );
    setViewData(data);
    formik.resetForm()
  }

  return (
    <>
      {view === "liste" ? (
        <>
          <PageHeader title="" />
          <div className="my-3 fw-bold fs-4 text-primary">
            Liste des réponses des élèves
          </div>

          <Table>
            <TableHeader>
              <th scope="col" className="border-raduis-left">
                #
              </th>
              <th scope="col">Nom Prénom</th>
              <th scope="col">Note</th>
              <th scope="col">Date</th>
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

                    <td className="fw-bold1">
                      {data.user?.nom + " " + data.user?.prenom}
                    </td>
                    <td className="fw-bold1">{data.point_obtenu}</td>

                    <td className="fw-bold1">
                      {new Date(data.created_at).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <div className="btn-group">
                        <div className="d-inline-block mx-1">
                          <button
                            className="btn btn-primary-light"
                            onClick={e => getUserDetailNote(e,data)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>

                        {user.permissions?.includes("delete questionLecon") && (
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
        </>
      ) : (
        <>
          <PageHeader title="" />
          <div className="d-flex my-3 fw-bold align-items-center">
            <div className="fs-4">
              <span>Réponse de : </span>{" "}
              <span className="text-danger">
                {viewData?.user?.nom + " " + viewData?.user?.prenom}
              </span>{" "}
              <br />
              <span>Point obtenu : </span>{" "}
              <span className="text-primary">{viewData?.point_obtenu}</span>
            </div>
            <div className="ms-auto">
              <button
                className="btn-sm btn-primary rounded"
                onClick={(e) => {
                  e.preventDefault();
                  setView("liste");
                }}
              >
                Fermer
              </button>
            </div>
          </div>
          <div className="card border p-4">
            {viewData?.user_response?.map((data, idx) => {
              //formik.setFieldValue("point"+data.slug,data?.user_point)
              //formik.setFieldValue("commentaire"+data.slug,data?.user_point)
              return (
                <div className="border-bottom mb-3 pb-3" key={data.slug}>

                  <div className="d-flex">
                    <div className="w-50">
                      <div>
                        <span className="fw-bold">Question : </span> <br />
                        <div className="ps-3">{data.question}</div>
                      </div>
                      <div>
                        <span className="fw-bold">Type : </span> <br />
                        <div className="ps-3">{data.type}</div>
                      </div>
                      <div>
                        <span className="fw-bold">Choix : </span> <br />
                        <div className="ps-3">
                          {data.choix.map((item, idx) => {
                            const inclus = data?.user_reponse.join(";").includes(idx + 1)
                            return (
                              <div key={"choix" + idx} className={inclus ? "text-success" : ""}>
                                {idx + 1} - {item}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="fw-bold">Réponses : </span> <br />
                        <span>{data.reponses}</span>
                      </div>
                      <div className="text-danger fw-bold">
                        <span className="fw-bold d-inline-block me-2">
                          Reponse de l'élève :{" "}
                        </span>
                        <span className="d-inline-block">
                          {data?.user_reponse.join(" et ")}
                        </span>
                      </div>
                    </div>
                    <div className="w-50">
                      <InputField
                        type={"text"}
                        name={"point" + data.slug}
                        formik={formik}
                        placeholder="Point obtenu par l'élève"
                        label={"Point obtenu"}
                      />
                      <InputField
                        type={"textaera"}
                        name={"commentaire" + data.slug}
                        formik={formik}
                        placeholder="Commentaire"
                        label={"Commentaire"}
                      />
                      <div className="fw-bold">
                        <span>Point de l'élève :</span>
                        <span className="text-danger"> {data?.user_point} pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <button
                          className="btn btn-primary-light"
                          onClick={formik.submitForm}
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex mt-3">
            <button onClick={formik.submitForm} className="btn btn-primary w-75 mx-auto">
              Enregistrer
            </button>
          </div>
        </>
      )}
      <div className="modal fade" id="form">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {editId !== ""
                  ? "Modification d'une question"
                  : "Ajout d’une question"}
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
                  name="question"
                  formik={formik}
                  placeholder="Intitulé de la question"
                  label={"Question"}
                />
                <InputField
                  type={"select"}
                  name="type"
                  formik={formik}
                  placeholder="Intitulé de la question"
                  label={"Type de question"}
                  options={[
                    { slug: "CHOIX_MULTIPLE", label: "Choix multiple" },
                    { slug: "VRAI_OU_FAUX", label: "Vrais ou faux" },
                  ]}
                />
                <InputField
                  type={"text"}
                  name="choix"
                  formik={formik}
                  placeholder="Entrez une reponse possible"
                  label={
                    "Liste des reponses possibles ( exemple : question 1; question 2; question 3; question 4)"
                  }
                />
                <InputField
                  type={"text"}
                  name="point"
                  formik={formik}
                  placeholder="Nombre de point de la question"
                  label={"Nombre de point"}
                />

                <InputField
                  type={"text"}
                  name="reponses"
                  formik={formik}
                  placeholder="Entrez le numéro des bonnes réponses"
                  label={"Liste des bonne réponses ( exemple : 1; 4 )"}
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
      <div className="modal fade" id="importFile">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Importation d'une liste de question
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={formikFile.handleSubmit}>
                <InputField
                  type={"file"}
                  name="qcm"
                  formik={formikFile}
                  placeholder="Intitulé de la question"
                  label={"Choisissez un fichier Excel"}
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
        <div className="modal-dialog modal-dialog-centered modal-md">
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
                <span className="fw-bold d-inline-block me-2">Question : </span>
                <span className="d-inline-block">{viewQuestion.question}</span>
              </div>
              <div>
                <span className="fw-bold d-inline-block me-2">Type : </span>
                <span className="d-inline-block">{viewQuestion.type}</span>
              </div>
              <div>
                <div>
                  <span className="fw-bold d-inline-block me-2">Choix : </span>
                </div>
                <div className="d-inline-block ps-4">
                  {viewQuestion?.choix?.map((data, idx) => {
                    return (
                      <div key={idx}>
                        {idx + 1} - {data}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-success">
                <span className="fw-bold d-inline-block me-2">
                  Reponse de la question :{" "}
                </span>
                <span className="d-inline-block  fw-bold">
                  {viewQuestion.reponses}
                </span>
              </div>
              <div className="text-danger fw-bold">
                <span className="fw-bold d-inline-block me-2">
                  Reponse de l'élève :{" "}
                </span>
                <span className="d-inline-block">
                  {viewQuestion?.user_reponse?.join(";")}
                </span>
              </div>
              {correctionMode && (
                <>
                  <hr />

                  <InputField
                    type={"text"}
                    name="point"
                    formik={formik}
                    placeholder="Point obtenu par l'élève"
                    label={"Point obtenu"}
                  />
                  <InputField
                    type={"textaera"}
                    name="commentaire"
                    formik={formik}
                    placeholder="Commentaire"
                    label={"Commentaire"}
                  />
                </>
              )}

              <div className="mt-4 d-flex justify-content-end">
                {correctionMode ? (
                  <>
                    <button
                      className="btn btn-primary-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Fermer
                    </button>
                    <button className="btn btn-primary" data-bs-dismiss="modal">
                      Enregistrer
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary me-2"
                      data-bs-dismiss="modal"
                    >
                      Fermer
                    </button>
                  </>
                )}
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

export default ReponseLeconEleve;
