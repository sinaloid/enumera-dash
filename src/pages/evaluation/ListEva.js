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
import Retour from "../../Components/Retour";
import { useNavigate } from "react-router-dom";

const initData = {
  label: "",
  abreviation: "",
  date: "",
  heure_debut: "",
  heure_fin: "",
  description: "",
};
const ListEva = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const navigate = useNavigate();
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    getClasse();
    getMatiere();
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
      values.abreviation = values.label;
      if (editId === "") {
        handleSubmit(values);
      } else {
        values._method = "put";
        handleEditSubmit(values);
      }
    },
  });

  const getClasse = () => {
    request
      .get(endPoint.classes, header)
      .then((res) => {
        setClasses(res.data.data);
        console.log(res.data.data);
        getAll(res.data.data[0].slug);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMatiere = () => {
    request
      .get(endPoint.matieres, header)
      .then((res) => {
        setMatieres(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAll = () => {
    request
      .get(endPoint.evaluations, header)
      .then((res) => {
        setDatas(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.evaluations, data, header), {
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
      request.post(endPoint.evaluations + "/" + editId, data, header),
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

  const onDelete = () => {
    toast.promise(
      request.delete(endPoint.evaluations + "/" + viewData.slug, header),
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
      .delete(endPoint.classes + "/" + viewData.slug, header)
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

  const setEditeData = (e, data) => {
    e.preventDefault();
    setEditId(data.slug);
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("abreviation", data.abreviation);
    formik.setFieldValue("description", data.description);
    formik.setFieldValue("date", data.date);
    formik.setFieldValue("heure_debut", data.heure_debut);
    formik.setFieldValue("heure_fin", data.heure_fin);
    formik.setFieldValue("classe", data.matiere_de_la_classe.classe.slug);
    formik.setFieldValue("matiere", data.matiere_de_la_classe.matiere.slug);
  };
  const goToDetail = (e, data) => {
    e.preventDefault();
    navigate("/dashboard/evaluations/" + data + "/questions");
  };
  return (
    <>
      <PageHeader
        title="Liste des evaluations"
        modal="form"
        addModal={addModal}
        canCreate={user.permissions?.includes("create evaluation")}
      />
      <div className="d-flex mb-1">
        <div className="fw-bold me-auto">{datas.length} resultats</div>
        <Retour />
      </div>

      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Intitulé</th>
          <th scope="col">Classe</th>
          <th scope="col">Matière</th>
          <th scope="col">Date</th>
          <th scope="col">Heure de début</th>
          <th scope="col">Heure de fin</th>
          <th scope="col">Etat</th>
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
                <td className="fw-bold1">
                  {data.matiere_de_la_classe.classe.label}
                </td>
                <td className="fw-bold1">
                  {data.matiere_de_la_classe.matiere.label}
                </td>
                <td className="fw-bold1">{data.date}</td>
                <td className="fw-bold1">{data.heure_debut}</td>
                <td className="fw-bold1">{data.heure_fin}</td>
                <td className="fw-bold1">{data.etat}</td>
                <td className="fw-bold1">{data.description}</td>
                <td className="text-center">
                  <div className="btn-group">
                    {user.permissions?.includes("view question") && (
                      <div className="d-inline-block mx-1">
                        <button
                          className="btn btn-primary-light"
                          onClick={(e) => {
                            goToDetail(e, data.slug);
                          }}
                        >
                          <span>Questions</span>
                        </button>
                      </div>
                    )}
                    {user.permissions?.includes("update evaluation") && (
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
                    )}
                    {user.permissions?.includes("delete evaluation") && (
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
                {editId !== ""
                  ? "Modification d’une classe"
                  : "Ajout d’une classe"}
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
                  placeholder="Intitulé de l'évaluation"
                  label={"Intitulé"}
                />
                <InputField
                  type={"date"}
                  name="date"
                  formik={formik}
                  placeholder="Date de l'évaluation"
                  label={"Date de l'évaluation"}
                />
                <div className="d-flex">
                  <InputField
                    type={"time"}
                    name="heure_debut"
                    formik={formik}
                    placeholder="Heure de début de l'évaluation"
                    label={"Heure de début de l'évaluation"}
                  />
                  <div className="mx-4"></div>
                  <InputField
                    type={"time"}
                    name="heure_fin"
                    formik={formik}
                    placeholder="Heure de fin de l'évaluation"
                    label={"Heure de fin de l'évaluation"}
                  />
                </div>
                <InputField
                  type={"select"}
                  name="classe"
                  formik={formik}
                  placeholder="Sélectionnez la classe"
                  label={"Classe"}
                  options={classes}
                />
                <InputField
                  type={"select"}
                  name="matiere"
                  formik={formik}
                  placeholder="Sélectionnez la matière"
                  label={"Matière"}
                  options={matieres}
                />
                <InputField
                  type={"textaera"}
                  name="description"
                  formik={formik}
                  placeholder="Description de la classe"
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
                <span className="fw-bold d-inline-block me-2">Classe : </span>
                <span className="d-inline-block">{viewData.label}</span>
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

export default ListEva;
