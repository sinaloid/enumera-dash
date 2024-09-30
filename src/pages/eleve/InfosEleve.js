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
const InfosEleve = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const { slug } = useParams();

  const [utilisateur, setUtilisateur] = useState({});
  const [roles, setRoles] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

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
        //setLecon(res.data.data);
        setUtilisateur(res.data.data);
        //setSelectedPermissions(res.data.data.permissions);
        if (res.data.data.roles.length !== 0) {
          setPermissionList(res.data.data.roles[0].permissions);
          const tabPermi = res.data.data.permissions?.map(
            (permission) => permission.name
          );
          setUserPermissions(tabPermi);
          console.log(tabPermi);
        }

        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formik = useFormik({
    initialValues: { role: "" },
    //validationSchema: validateData,
    onSubmit: (values) => {
      values.utilisateur = slug;
      console.log(values);
      updateRole(values);
    },
  });
  const updateRole = () => {
    //setShowModal(true)
    toast.promise(
      request.post(
        endPoint.utilisateurs + "/" + slug + "/groupe",
        { groupe: formik.values["groupe"], _method: "put" },
        header
      ),
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
            return data?.response?.data?.errors
              ? data.response?.data?.errors
              : data.response?.data?.error;
          },
        },
      }
    );
  };
  return (
    <>
      <div className="card p-4 border">
        <div className="text-primary">
          <span className=" d-inline-block me-2 fs-1">Elève : </span>
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
              Classe
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Progressions
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Notes
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Bulletins
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

const initQuest = {
  question: "",
  choix: "",
  reponses: "",
  point: "",
  evaluation_lecon: "",
  type: "",
};
const UtilisateurClasse = ({ classeList, refresh }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [editId, setEditId] = useState("");
  const [viewData, setViewData] = useState({});
  const { slug } = useParams();

  const [classeSelected, setClasseSelected] = useState([]);

  const [classes, setClasses] = useState([]);

  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getClasse();
  }, []);

  const formik = useFormik({
    initialValues: initQuest,
    //validationSchema: validateData,
    onSubmit: (values) => {
      const tab = classeSelected.map((data) => data.slug);
      handleSubmit(tab);
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
          <th scope="col">Classe</th>
          <th scope="col">Description</th>
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

                <td className="fw-bold1">{data.classe.description}</td>
                <td className="text-center">
                  <div className="btn-group">
                    {user.permissions?.includes("assign classe") && (
                      <div className="d-inline-block mx-1">
                        <button
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#delete"
                          onClick={(e) => {
                            e.preventDefault();
                            setViewData(data.classe);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                    {/**
                     * <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#form"
                        onClick={(e) => {
                          setEditeData(e, data);
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
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
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                     */}
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
                <span className="fw-bold d-inline-block me-2">Droit : </span>
                <span className="d-inline-block">{viewData.display_name}</span>
              </div>
              <div>
                <span className="fw-bold d-inline-block me-2">nom : </span>
                <span className="d-inline-block">{viewData.name}</span>
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
    </>
  );
};

export default InfosEleve;
