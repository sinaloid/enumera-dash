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
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const initData = {
  name: "",
  display_name: "",
  description: "",
};
const Groupe = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate()
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    getPermission();
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
      .get(endPoint.roles, header)
      .then((res) => {
        setDatas(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getPermission = () => {
    request
      .get(endPoint.permissions, header)
      .then((res) => {
        const tab = res.data.map((data) => {
          return { value: data.name, label: data.name };
        });
        setPermissions(tab);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.roles, data, header), {
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
    toast.promise(request.post(endPoint.roles + "/" + editId, data, header), {
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
      request.delete(endPoint.classes + "/" + viewData.slug, header),
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

    request
      .delete(endPoint.roles + "/" + viewData.id, header)
      .then((res) => {
        console.log(res.data);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addModal = (e) => {
    e.preventDefault();
    setEditId("");
    formik.resetForm();
  };

  const goTo = (e, data) => {
    e.preventDefault()
    navigate(data.slug)
  }
  return (
    <>
      <PageHeader title="Liste des groupes d'utilisateurs" modal="form" addModal={addModal} />
      <div className="fw-bold">{datas.length} resultats</div>
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Groupes</th>
          <th scope="col">Nom</th>
          <th scope="col">Description</th>
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

                <td className="fw-bold1">{data.display_name}</td>
                <td className="fw-bold1">{data.name}</td>
                <td className="fw-bold1">{data.description}</td>
                <td className="fw-bold1">
                  {new Date(data.created_at).toLocaleDateString()}
                </td>
                <td className="text-center">
                  <div className="btn-group">
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        //data-bs-toggle="modal"
                        //data-bs-target="#permissions"
                        onClick={e => goTo(e,data)}
                      >
                        <span>Droits d'accès</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#view"
                        onClick={(e) => {
                          setViewData(data);
                        }}
                      >
                        <span> Voir</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#form"
                        onClick={(e) => {
                          formik.setFieldValue("name", data.name);
                          formik.setFieldValue("display_name", data.display_name);
                          formik.setFieldValue("description", data.description);
                          setEditId(data.id);
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
      <div className="modal fade" id="permissions">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {"Gestion des permissions"}
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
                  options={permissions}
                  //defaultValue={[colourOptions[2], colourOptions[3]]}
                  isMulti
                  name="colors"
                  //options={colourOptions}
                  isSearchable={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />

                <div className="d-flex justify-content-start border-0 pt-3">
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
      <div className="modal fade" id="form">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {editId !== "" ? "Modification d’un groupe" : "Ajout d’un groupe"}
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
                  name="display_name"
                  formik={formik}
                  placeholder="Groupe"
                  label={"Nom du groupe"}
                />
                <InputField
                  type={"text"}
                  name="name"
                  formik={formik}
                  placeholder="Nom"
                  label={"Nom"}
                />
                <InputField
                  type={"textaera"}
                  name="description"
                  formik={formik}
                  placeholder="Description"
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
                <span className="fw-bold d-inline-block me-2">Nom : </span>
                <span className="d-inline-block">{viewData.name}</span>
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

export default Groupe;
