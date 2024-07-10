import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../../Components/PageHeader";
import Table from "../../Components/Table";
import TableContent from "../../Components/TableContent";
import TableHeader from "../../Components/TableHeader";
import * as Yup from "yup";
import InputField from "../../Components/InputField";
import request from "../../services/request";
import endPoint from "../../services/endPoint";
import { AppContext } from "../../services/context";
import Notify from "../../Components/Notify";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initData = {
  label: "",
  abreviation: "",
  chapitre: "",
  description: "",
};
const LeconListe = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [chapitres, setChapitres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classeMatiere, setClasseMatiere] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate =  useNavigate()

  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    getClasse();
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
      if (editId === "") {
        handleSubmit(values);
      } else {
        values._method = "put";
        handleEditSubmit(values);
      }
    },
  });

  const getAll = () => {
    request
      .get(endPoint.lecons, header)
      .then((res) => {
        setDatas(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClasse = () => {
    request
      .get(endPoint.classes, header)
      .then((res) => {
        setClasses(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClasseChange = (slug) => {
    setMatieres([])
    setChapitres([])
    getMatiere(slug);
  };

  const getMatiere = (slug) => {
    request
      .get(endPoint.classes + "/" + slug + "/matieres", header)
      .then((res) => {
        console.log(res.data.data);
        const matierelList = res.data.data.matiere_de_la_classe.map((data) => {
          return data.matiere;
        });
        setMatieres(matierelList);
        // console.log(res.data.data);
        setClasseMatiere(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onMatiereChange = (slug,classeSlug = "") => {
    setChapitres([])
    getChapitre(slug,classeSlug);
  };

  const getChapitre = (matiereSlug, classeSlug = "") => {
    classeSlug = formik.values["classe"] ? formik.values["classe"] : classeSlug;
    request
      .get(
        endPoint.classes +
          "/" +
          classeSlug +
          "/matieres/" +
          matiereSlug +
          "/chapitres",
        header
      )
      .then((res) => {
        console.log(res.data.data);

        setChapitres(res.data.data.chapitres);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.lecons, data, header), {
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
    toast.promise(request.post(endPoint.lecons + "/" + editId, data, header), {
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
    });
  };

  const onDelete = () => {
    toast.promise(
      request.delete(endPoint.lecons + "/" + viewData.slug, header),
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
    setEditId(data.slug);
    formik.setFieldValue(
      "classe",
      data.chapitre.matiere_de_la_classe.classe.slug
    );
    onClasseChange(data.chapitre.matiere_de_la_classe.classe.slug);
    formik.setFieldValue(
      "matiere",
      data.chapitre.matiere_de_la_classe.matiere.slug
    );
    onMatiereChange(
      data.chapitre.matiere_de_la_classe.matiere.slug,
      data.chapitre.matiere_de_la_classe.classe.slug
    );
    formik.setFieldValue("chapitre", data.chapitre.slug);
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("abreviation", data.abreviation);
    formik.setFieldValue("description", data.description);
  };

  const goToDetail = (e,data) => {
    e.preventDefault()
    navigate(data.slug)
  }

  return (
    <>
      <PageHeader title="Liste des leçons" modal="form" addModal={addModal} />
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Leçon</th>
          <th scope="col">Abreviation</th>
          <th scope="col">Chapitre</th>
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
                <td className="fw-bold1">
                  {data.chapitre?.label +
                    " : " +
                    data.chapitre?.matiere_de_la_classe.matiere.abreviation +
                    "/" +
                    data.chapitre?.matiere_de_la_classe.classe.label +
                    "/" +
                    data.chapitre?.periode.abreviation}
                </td>
                <td className="fw-bold1">{data.description}</td>
                <td className="text-center">
                  <div className="btn-group">
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        //data-bs-toggle="modal"
                        //data-bs-target="#view"
                        onClick={(e) => {
                          goToDetail(e,data);
                        }}
                      >
                        <span> Cours</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        //data-bs-toggle="modal"
                        //data-bs-target="#view"
                        onClick={(e) => {
                          goToDetail(e,data);
                        }}
                      >
                        <span> Evaluations</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#form"
                        onClick={(e) => {
                          setEditeData(e, data);
                        }}
                      >
                        <span> Modifier</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#delete"
                        onClick={(e) => {
                          setViewData(data);
                        }}
                      >
                        <span> Supprimer</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </TableContent>
      </Table>
      <div className="modal fade" id="form">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {editId !== ""
                  ? "Modification d'une leçon"
                  : "Ajout d’une leçon"}
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
                  placeholder="Nom de la leçon"
                  label={"Leçon"}
                />
                <InputField
                  type={"text"}
                  name="abreviation"
                  formik={formik}
                  placeholder="Abreviation du chapitre"
                  label={"Abreviation"}
                />

                <InputField
                  type={"select"}
                  name="classe"
                  formik={formik}
                  placeholder="Sélectionnez une classe"
                  label={"Classe"}
                  options={classes}
                  callback={onClasseChange}
                />
                <InputField
                  type={"select"}
                  name="matiere"
                  label={"Matière"}
                  formik={formik}
                  placeholder="Sélectionnez une matière"
                  options={matieres}
                  callback={onMatiereChange}
                />
                <InputField
                  type={"select"}
                  name="chapitre"
                  formik={formik}
                  placeholder="Sélectionnez un chapitre"
                  label={"Chapitre"}
                  options={chapitres}
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
                <span className="fw-bold d-inline-block me-2">Chapitre : </span>
                <span className="d-inline-block">{viewData.label}</span>
              </div>
              <div>
                <span className="fw-bold d-inline-block me-2">
                  Abreviation :{" "}
                </span>
                <span className="d-inline-block">{viewData.abreviation}</span>
              </div>
              <div>
                <span className="fw-bold d-inline-block me-2">Chapitre : </span>
                <span className="d-inline-block">
                  {viewData.chapitre?.label +
                    " : " +
                    viewData.chapitre?.matiere_de_la_classe?.matiere
                      ?.abreviation +
                    "/" +
                    viewData.chapitre?.matiere_de_la_classe?.classe?.label +
                    "/" +
                    viewData.chapitre?.periode?.abreviation}
                </span>
              </div>
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
      <Notify showModal={showModal} />
    </>
  );
};

export default LeconListe;
