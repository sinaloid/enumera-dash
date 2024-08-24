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
import { toast } from "react-toastify";

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
  const [matieres, setMatieres] = useState([]);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [classes, setClasses] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    ///getAll("","");
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
      console.log(values);
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
        if (isFirstTime) {
          onSelectChange(res.data.data[0].slug);
          getMatiere(res.data.data[0].slug);
          formik.setFieldValue("classeSelected", res.data.data[0].slug);
          sessionStorage.setItem("classeSelected",res.data.data[0].slug)
          setIsFirstTime(false);
        }
        //console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClasseChange = (slug) => {
    getMatiere(slug);
  };

  const getMatiere = (slug) => {
    request
      .get(endPoint.matieres + "/classe/" + slug, header)
      .then((res) => {
        console.log(res.data.data);
        setMatieres(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAll = (endpoint) => {
    request
      .get(endpoint, header)
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
    toast.promise(request.post(endPoint.chapitres, data, header), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);
          const res = data;
          setRefresh(refresh + 1);
          onSelectChange(sessionStorage.getItem('classeSelected','matiereSelected'))
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
      request.post(endPoint.chapitres + "/" + editId, data, header),
      {
        pending: "Veuillez patienté...",
        success: {
          render({ data }) {
            console.log(data);
            const res = data;
            setEditId("");
            setRefresh(refresh + 1);
            //getAll()
            onSelectChange(sessionStorage.getItem('classeSelected','matiereSelected'))

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

  const handleSubmitFile = (e) => {
    e.preventDefault()
    //setShowModal(true)
    const data = {
      classe:formik.values.classe,
      matiere:formik.values.matiere,
      file:formik.values.file,
    }
    toast.promise(request.post(endPoint.chapitres+"/import", data, header), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);
          const res = data;
          setRefresh(refresh + 1);
          onSelectChange(sessionStorage.getItem('classeSelected','matiereSelected'))
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
      request.delete(endPoint.chapitres + "/" + viewData.slug, header),
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
    //console.log(data);
    setEditId(data.slug);
    formik.setFieldValue("matiere", data.matiere_de_la_classe.matiere.slug);
    formik.setFieldValue("classe", data.matiere_de_la_classe.classe.slug);
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("abreviation", data.abreviation);
    formik.setFieldValue("description", data.description);
  };

  const changeClasse = (classe) => {
    sessionStorage.setItem("classeSelected",classe)
    onSelectChange(classe, formik.values.matiereSelected);
    getMatiere(classe);
  };

  const changeMatiere = (matiere) => {
    sessionStorage.setItem("matiereSelected",matiere)
    onSelectChange(formik.values.classeSelected, matiere);
  };

  const onSelectChange = (classe, matiere) => {
    let url = endPoint.chapitres + "/classe/" + classe;
    //sessionStorage()

    if (matiere) {
      url += "/matiere/" + matiere;
    }

    getAll(url);
  };

  return (
    <>
      <PageHeader title="Liste des sections" modal="form" addModal={addModal} />
      <div className="d-flex mt-3">
        <div className="me-2">
          <InputField
            type={"select"}
            name="classeSelected"
            formik={formik}
            placeholder="Sélectionnez une classe"
            label={"Sélectionnez une classe"}
            options={classes}
            callback={changeClasse}
          />
        </div>
        <div>
          <InputField
            type={"select"}
            name="matiereSelected"
            formik={formik}
            placeholder="Sélectionnez une matiere"
            label={"Sélectionnez une matière"}
            options={matieres}
            callback={changeMatiere}
          />
        </div>
        <div className="mt-2 ms-auto">
        <button className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#import">Importer une liste</button>
        </div>
      </div>
      <div className="fw-bold">{datas.length} resultats</div>
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Section</th>
          <th scope="col">Classe</th>
          <th scope="col">Matière</th>
          <th scope="col">Coefficient</th>
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
                  {data.matiere_de_la_classe.matiere.abreviation}
                </td>
                <td className="fw-bold1">
                  {data.matiere_de_la_classe.coefficient}
                </td>
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
                  ? "Modification de la section"
                  : "Ajout d’une section"}
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
                  placeholder="Nom de la section : chapitre, partie, thème, catégorie, rubrique..."
                  label={"Section"}
                />
                <InputField
                  type={"text"}
                  name="abreviation"
                  formik={formik}
                  placeholder="Abreviation de la section"
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
                  formik={formik}
                  placeholder="Sélectionnez une matière"
                  label={"Matière"}
                  options={matieres}
                />
                <InputField
                  type={"textaera"}
                  name="description"
                  formik={formik}
                  placeholder="Description de la section"
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
      <div className="modal fade" id="import">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {"Importation de fichier"}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmitFile}>
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
                  formik={formik}
                  placeholder="Sélectionnez une matière"
                  label={"Matière"}
                  options={matieres}
                />
                <InputField
                  type={"file"}
                  name="file"
                  formik={formik}
                  placeholder=""
                  label={"Fichier excel ou csv"}
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
      <Notify showModal={showModal} />
    </>
  );
};

export default Chapitre;
