import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../Components/PageHeader";
import Table from "../Components/Table";
import TableContent from "../Components/TableContent";
import TableHeader from "../Components/TableHeader";
import * as Yup from "yup";
import InputField from "../Components/InputField";
import request from "../services/request";
import endPoint from "../services/endPoint";
import { AppContext } from "../services/context";
import Notify from "../Components/Notify";

const initData = {
  label: "",
  periode: "",
  matiereClasse: "",
  abreviation: "",
  description: "",
};
const Chapitre = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [periodes, setPeriodes] = useState([]);
  const [matiereClasses, setMatiereClasses] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    getPeriode();
    getMatiereClasse();
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

  const getPeriode = () => {
    request
      .get(endPoint.periodes, header)
      .then((res) => {
        setPeriodes(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMatiereClasse = () => {
    request
      .get(endPoint.matiereClasse, header)
      .then((res) => {
        const tab = res.data.data.map((data) => {
          return {
            slug: data.slug,
            label: <>{data.matiere.abreviation + "/" + data.classe.label}</>,
          };
        });
        setMatiereClasses(tab);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAll = () => {
    request
      .get(endPoint.chapitres, header)
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
    request
      .post(endPoint.chapitres, data, header)
      .then((res) => {
        console.log("Enregistrer avec succès");
        setRefresh(refresh + 1);
        console.log(res.data);
      })
      .catch((error) => {
        console.log("Echec !");
        console.log(error);
      });
  };
  const handleEditSubmit = (data) => {
    //setShowModal(true)
    request
      .post(endPoint.chapitres + "/" + editId, data, header)
      .then((res) => {
        console.log("Enregistrer avec succès");
        setEditId("");
        setRefresh(refresh + 1);
        console.log(res);
      })
      .catch((error) => {
        console.log("Echec !");
        console.log(error);
      });
  };

  const onDelete = () => {
    request
      .delete(endPoint.chapitres + "/" + viewData.slug, header)
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
    //console.log(data);
    setEditId(data.slug);
    formik.setFieldValue("matiereClasse", data.matiere_de_la_classe.slug);
    formik.setFieldValue("periode", data.periode.slug);
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("abreviation", data.abreviation);
    formik.setFieldValue("description", data.description);
  };

  return (
    <>
      <PageHeader
        title="Liste des chapitres"
        modal="form"
        addModal={addModal}
      />
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Chapitre</th>
          <th scope="col">Abreviation</th>
          <th scope="col">Matière/Classe</th>
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
                  {data.matiere_de_la_classe.matiere.abreviation +
                    "/" +
                    data.matiere_de_la_classe.classe.label}
                </td>
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
                        <span> Voir</span>
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
                  ? "Modification du chapitre"
                  : "Ajout d’un chapitre"}
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
                  placeholder="Nom du chapitre"
                  label={"Chapitre"}
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
                  name="periode"
                  formik={formik}
                  placeholder="Sélectionnez une periode"
                  label={"Periode"}
                  options={periodes}
                />
                <InputField
                  type={"select"}
                  name="matiereClasse"
                  formik={formik}
                  placeholder="Sélectionnez une matière et la classe"
                  label={"Matière de la classe"}
                  options={matiereClasses}
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
                <span className="fw-bold d-inline-block me-2">
                  Matière / Classe :{" "}
                </span>
                <span className="d-inline-block">
                  {viewData.matiere_de_la_classe?.matiere?.abreviation +
                    "/" +
                    viewData.matiere_de_la_classe?.classe?.label}
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

export default Chapitre;
