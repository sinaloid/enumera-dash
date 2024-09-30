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
import Select from "react-select";

const initData = {
  label: "",
  abreviation: "",
  type: "pdf",
  lecon: "",
  description: "",
};
const InfosEnseignant = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const { slug } = useParams();

  const [utilisateur, setUtilisateur] = useState({});

  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    get();
  }, [refresh]);

  const get = () => {
    request
      .get(endPoint.utilisateurs + "/" + slug, header)
      .then((res) => {
        setUtilisateur(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="card p-4 border">
        <div className="text-primary">
          <span className=" d-inline-block me-2 fs-1">Enseignant : </span>
          <span className=" d-inline-block fs-1">
            {utilisateur?.nom + " " + utilisateur?.prenom}
          </span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">
            Email - telephone :{" "}
          </span>
          <span className="d-inline-block">
            {utilisateur?.email + " - " + utilisateur?.telephone}
          </span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Matricule : </span>
          <span>{utilisateur?.matricule}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">
            Date de naissance :{" "}
          </span>
          <span>
            {new Date(utilisateur?.date_de_naissance).toLocaleDateString()}
          </span>
        </div>

        <div className="d-flex">
          <div className="me-3">
            <span className="fw-bold d-inline-block me-2">Genre : </span>
            <span className="d-inline-block">
              {utilisateur.genre === "M" ? "Homme" : "Femme"}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 mt-5">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" ariaCurrent="page" href="#">
              Classes
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Progressions
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Gestion des notes
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" aria-disabled="true">
              Paiements
            </a>
          </li>
        </ul>
        <UtilisateurClasse
          classeList={utilisateur.user_classes}
          refresh={get}
        />
      </div>
    </>
  );
};

const initValue = {
  classes: "",
  matieres: "",
  type: "",
};
const UtilisateurClasse = ({ classeList, refresh }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [editId, setEditId] = useState("");
  const [viewData, setViewData] = useState({});
  const { slug } = useParams();

  const [classeSelected, setClasseSelected] = useState([]);
  const [matiereSelected, setMatiereSelected] = useState([]);

  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);

  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getClasse();
    getMatiere();
  }, []);

  const formik = useFormik({
    initialValues: initValue,
    //validationSchema: validateData,
    onSubmit: (values) => {
      console.log(values);
      if (values.type !== "matieres") {
        const tab = classeSelected.map((data) => data.slug);
        handleSubmit(tab);
      } else {
        const tab = matiereSelected.map((data) => data.slug);
        handleSubmitMatiere(tab);
      }
    },
  });

  const getClasse = () => {
    request
      .get(endPoint.classes, header)
      .then((res) => {
        //console.log(res.data.data);
        const tab = res.data.data.map((data) => {
          return {
            ...data,
            value: data.slug,
          };
        });
        setClasses(tab);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMatiere = () => {
    request
      .get(endPoint.matieres, header)
      .then((res) => {
        //console.log(res.data.data);
        const tab = res.data.data.map((data) => {
          return {
            ...data,
            value: data.slug,
          };
        });
        setMatieres(tab);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (values) => {
    //setShowModal(true)
    toast.promise(
      request.post(
        endPoint.utilisateurs + "/" + slug + "/classes",
        { classes: values },
        header
      ),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            console.log(data);
            const res = data;
            refresh();
            return res.data.message;
          },
        },
        error: {
          render({ data }) {
            console.log(data);
            return data?.response?.data?.errors
              ? data.response?.data?.errors
              : data.response?.data?.error;
          },
        },
      }
    );
  };

  const handleSubmitMatiere = (values) => {
    //setShowModal(true)
    toast.promise(
      request.post(
        endPoint.utilisateurs +
          "/utilisateur-classe/" +
          viewData.slug +
          "/matieres",
        { matieres: values },
        header
      ),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            console.log(data);
            const res = data;
            refresh();
            return res.data.message;
          },
        },
        error: {
          render({ data }) {
            console.log(data);
            return data?.response?.data?.errors
              ? data.response?.data?.errors
              : data.response?.data?.error;
          },
        },
      }
    );
  };

  const onDelete = () => {
    toast.promise(
      request.delete(
        endPoint.utilisateurs + "/" + slug + "/classe/" + viewData.slug,
        header
      ),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            const res = data;
            refresh();
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

  const onDeleteMatiere = () => {
    console.log(viewData);
    toast.promise(
      request.delete(
        endPoint.utilisateurs + "/utilisateur-classe-matiere/" + viewData.slug,
        header
      ),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            const res = data;
            refresh();
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

  return (
    <>
      <PageHeader
        title=""
        modal="form"
        addModal={addModal}
        canCreate={user.permissions?.includes("assign classe")}
      />
      <div className="mt-3 fw-bold fs-4 text-primary">Liste des classes</div>
      <div className="d-flex align-items-center">
        {/**
         * <button
          className="btn btn-primary ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#importFile"
        >
          Importer une liste
        </button>
         */}
      </div>

      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Classes</th>
          <th scope="col">Liste des Matières</th>
          <th scope="col" className="text-center">
            Actions
          </th>
        </TableHeader>
        <TableContent>
          {classeList?.map((data, idx) => {
            return (
              <tr key={idx}>
                <td>
                  <input type="checkbox" value="selected" />
                </td>
                <td className="fw-bold1">{data.classe.label}</td>

                <td className="fw-bold1">
                  {data.user_classe_matieres.map((data) => {
                    return (
                      <div key={data.slug} className="d-inline-block m-1">
                        <div
                          className="btn btn-primary-light"
                          data-bs-toggle="modal"
                          data-bs-target="#delete"
                          onClick={(e) => {
                            e.preventDefault();
                            setViewData(data);
                            formik.setFieldValue("type", "matieres");
                          }}
                        >
                          <div className="d-flex">
                            <span className="me-2">{data.matiere_label}</span>
                            <span className="text-danger">
                              <i className="bi bi-trash"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </td>

                <td className="text-center">
                  <div className="btn-group">
                    {user.permissions?.includes("assign matiere") && (
                      <>
                        <div className="d-inline-block mx-1">
                          <button
                            className="btn btn-primary-light"
                            data-bs-toggle="modal"
                            data-bs-target="#formMatiere"
                            onClick={(e) => {
                              e.preventDefault();
                              setViewData(data);
                              formik.setFieldValue("type", "matieres");
                            }}
                          >
                            matières
                          </button>
                        </div>
                        <div className="d-inline-block mx-1">
                          <button
                            className="btn btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#delete"
                            onClick={(e) => {
                              e.preventDefault();
                              setViewData(data);
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </>
                    )}
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
                {"Ajout de classe"}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <Select
                  //defaultValue={[colourOptions[2], colourOptions[3]]}
                  isMulti
                  name="colors"
                  options={classes}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder={"Sélectionnez les classes"}
                  onChange={(e) => {
                    //console.log(e)
                    setClasseSelected(e);
                  }}
                />

                <div className="d-flex justify-content-start border-0 mt-4">
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
      <div className="modal fade" id="formMatiere">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {"Ajout de matières"}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <Select
                  //defaultValue={[colourOptions[2], colourOptions[3]]}
                  isMulti
                  name="colors"
                  options={matieres}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder={"Sélectionnez les matières"}
                  onChange={(e) => {
                    //console.log(e)
                    setMatiereSelected(e);
                  }}
                />

                <div className="d-flex justify-content-start border-0 mt-4">
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
                  onClick={
                    formik.values.type !== "matieres"
                      ? onDelete
                      : onDeleteMatiere
                  }
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

export default InfosEnseignant;
