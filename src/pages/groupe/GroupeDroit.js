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
const GroupeDroit = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [lecon, setLecon] = useState({});
  const [evaluation, setEvaluation] = useState({});
  const [editId, setEditId] = useState("");
  const { slug, evaluationSlug } = useParams();
  const [files, setFiles] = useState([]);
  const [cours, setCours] = useState("");
  const [groupe, setGroupe] = useState({});

  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    get();
    //getEvaluation();
  }, [refresh]);

  const get = () => {
    request
      .get(endPoint.roles + "/" + slug, header)
      .then((res) => {
        //setLecon(res.data.data);
        setGroupe(res.data.data);
        //setSelectedPermissions(res.data.data.permissions);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEvaluation = () => {
    request
      .get(endPoint.evaluations + "/" + slug, header)
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
          <span className=" d-inline-block me-2 fs-1">Groupe : </span>
          <span className=" d-inline-block fs-1">{groupe.display_name}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Nom : </span>
          <span className="d-inline-block">{groupe?.name}</span>
        </div>

        <div className="d-flex">
          <div className="me-3">
            <span className="fw-bold d-inline-block me-2">Date : </span>
            <span className="d-inline-block">
              {new Date(groupe.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <span className="fw-bold d-inline-block me-2">Description : </span>
          <span className="d-inline-block">{groupe.description}</span>
        </div>
      </div>
      <DroitListe
        evaluation={evaluationSlug}
        permissions={groupe.permissions}
      />
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
const DroitListe = ({ evaluation, permissions }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [viewData, setViewData] = useState({});
  const { slug } = useParams();
  const [refresh, setRefresh] = useState(0);
  const [selectedPermissionNames, setSelectedPermissionNames] = useState([]);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    const tabPermi = permissions?.map((permission) => permission.name);
    setSelectedPermissionNames(tabPermi);
    console.log(tabPermi);
  }, [permissions]);

  const formik = useFormik({
    initialValues: initQuest,
    //validationSchema: validateData,
    onSubmit: (values) => {
      values.evaluation = slug;
      console.log(values);
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
      .get(endPoint.permissions, header)
      //.get(endPoint.questions+"/evaluation/"+slug, header)
      .then((res) => {
        setDatas(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    //setShowModal(true)
    toast.promise(
      request.post(
        endPoint.roles + "/" + slug + "/permissions",
        { permission: selectedPermissionNames, _method: "put" },
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
  const handleEditSubmit = (data) => {
    toast.promise(
      request.post(endPoint.questions + "/" + editId, data, header),
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

  const addModal = (e) => {
    e.preventDefault();
    setEditId("");
    formik.resetForm();
  };

  // Fonction pour gérer la sélection des permissions
  const handlePermissionChange = (permissionName) => {
    if (selectedPermissionNames?.includes(permissionName)) {
      // Retirer la permission si elle est déjà sélectionnée
      setSelectedPermissionNames(
        selectedPermissionNames.filter((name) => name !== permissionName)
      );
    } else {
      // Ajouter la permission si elle n'est pas encore sélectionnée
      const oldPermi = selectedPermissionNames ? selectedPermissionNames : [];
      setSelectedPermissionNames([...oldPermi, permissionName]);
    }
  };

  const setAllPermission = (e) => {
    if (selectedPermissionNames.length === datas.length) {
      setSelectedPermissionNames([]);
    } else {
      const tabPermi = datas?.map((permission) => permission.name);
      setSelectedPermissionNames(tabPermi);
    }
  };

  return (
    <>
      <PageHeader title="Liste des droits" modal="form" addModal={addModal} />
      <div className="mt-3 fw-bold fs-4 text-primary">Liste des droits</div>
      <div className="mb-2">
        <button className="btn-sm btn-primary" onClick={setAllPermission}>
          Tout sélectionné
        </button>
      </div>
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
          <th scope="col">Droits</th>
          <th scope="col">Nom</th>
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
                  {/**<input type="checkbox" value="selected" /> */}
                  <input
                    type="checkbox"
                    value={data.name}
                    checked={selectedPermissionNames?.includes(data.name)}
                    onChange={() => handlePermissionChange(data.name)}
                  />
                </td>

                <td className="fw-bold1">{data.display_name}</td>
                <td className="fw-bold1">{data.name}</td>

                <td className="fw-bold1">{data.description}</td>
                <td className="text-center">
                  <div className="btn-group">
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#view"
                        onClick={(e) => {
                          setViewData(data);
                        }}
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                    </div>
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
                        <i class="bi bi-pencil-square"></i>
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
                        <i class="bi bi-trash"></i>
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
      <div className="d-flex justify-content-center mt-5">
        <button className="btn btn-primary w-75" onClick={handleSubmit}>
          Enregistrer
        </button>
      </div>
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
    </>
  );
};

export default GroupeDroit;
