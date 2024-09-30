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
const GroupeDroitUtilisateur = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [lecon, setLecon] = useState({});
  const [evaluation, setEvaluation] = useState({});
  const [editId, setEditId] = useState("");
  const { slug, evaluationSlug } = useParams();
  const [files, setFiles] = useState([]);
  const [cours, setCours] = useState("");
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
    getRoles();
    //getEvaluation();
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

  const getRoles = () => {
    request
      .get(endPoint.roles, header)
      .then((res) => {
        //setLecon(res.data.data);
        const tab = res.data.map((data) => {
          return {
            ...data,
            label: data.display_name,
          };
        });
        setRoles(tab);
        //setSelectedPermissions(res.data.data.permissions);
        console.log(tab);
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
          <span className=" d-inline-block me-2 fs-1">Utilisateur : </span>
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
          <span className="fw-bold d-inline-block me-2">
            Groupe d'utilisateur :{" "}
          </span>
          <div className="d-inline-block d-flex">
            <span className="text-primary fw-bold">
              {utilisateur?.roles !== undefined && (
                <>
                  {utilisateur?.roles.length !== 0
                    ? utilisateur?.roles[0]?.display_name
                    : "Pas groupe"}
                </>
              )}
            </span>
            {user.permissions?.includes("assign role") && (
              <button
                data-bs-toggle="modal"
                data-bs-target="#roleForm"
                className="ms-auto btn-sm btn-primary"
              >
                Modifier le groupe
              </button>
            )}
          </div>
        </div>

        <div className="d-flex">
          <div className="me-3">
            <span className="fw-bold d-inline-block me-2">Date : </span>
            <span className="d-inline-block">
              {new Date(utilisateur.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <DroitListe
        permissionList={permissionList}
        userPermissions={userPermissions}
      />
      <div className="modal fade" id="roleForm">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {"Modification du groupe d'utilisateur"}
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
                  type={"select"}
                  name="groupe"
                  formik={formik}
                  placeholder="Sélectionnez un groupe d'utilisateur"
                  label={"Groupe d'utilisateur"}
                  options={roles}
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
const DroitListe = ({ permissionList, userPermissions }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [viewData, setViewData] = useState({});
  const { slug } = useParams();
  const [refresh, setRefresh] = useState(0);
  const [selectedPermissionNames, setSelectedPermissionNames] =
    useState(userPermissions);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    setSelectedPermissionNames(userPermissions);
  }, [userPermissions]);

  const formik = useFormik({
    initialValues: initQuest,
    //validationSchema: validateData,
    onSubmit: (values) => {
      handleSubmit();
    },
  });

  const getAll = () => {
    request
      .get(endPoint.utilisateurs + "/" + slug, header)
      //.get(endPoint.questions+"/evaluation/"+slug, header)
      .then((res) => {
        if (res.data.data.roles.length !== 0) {
          setDatas(res.data.data.roles[0].permissions);
        }
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    //setShowModal(true)
    toast.promise(
      request.post(
        endPoint.utilisateurs + "/" + slug + "/droits",
        { permissions: selectedPermissionNames, _method: "put" },
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

  return (
    <>
      <PageHeader title="" modal="form" addModal={addModal} />
      <div className="mt-3 fw-bold fs-4 text-primary">Liste des droits</div>
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
          {permissionList?.map((data, idx) => {
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

export default GroupeDroitUtilisateur;
