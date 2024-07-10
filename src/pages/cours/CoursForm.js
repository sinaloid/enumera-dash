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
import { useNavigate } from "react-router-dom";

const initData = {
  label: "",
  abreviation: "",
  type: "",
  lecon: "",
  description: "",
};
const CoursForm = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [lecons, setLecons] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();
  const typeCours = [
    { slug: "pdf", label: "Cours PDF" },
    { slug: "audio", label: "Cours AUDIO" },
    { slug: "video", label: "Cours VIDEO" },
    { slug: "saisie", label: "Cours SAISIE" },
  ];
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    getLecon();
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

  const getLecon = () => {
    request
      .get(endPoint.lecons, header)
      .then((res) => {
        const tab = res.data.data.map((data) => {
          return {
            slug: data.slug,
            label:
              data.label +
              " : " +
              data.chapitre.label +
              " /" +
              data.chapitre.matiere_de_la_classe.matiere.abreviation +
              "/" +
              data.chapitre.matiere_de_la_classe.classe.label +
              "/" +
              data.chapitre.periode.abreviation,
          };
        });
        setLecons(tab);

        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAll = () => {
    request
      .get(endPoint.cours, header)
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
      .post(endPoint.cours, data, header)
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
      .post(endPoint.cours + "/" + editId, data, header)
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
      .delete(endPoint.cours + "/" + viewData.slug, header)
      .then((res) => {
        console.log(res.data);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const coursForm = (e) => {
    e.preventDefault();
    navigate("cours-form");
    /*setEditId("");
    formik.resetForm();*/
  };
  const setEditeData = (e, data) => {
    e.preventDefault();
    //console.log(data);
    setEditId(data.slug);
    formik.setFieldValue("lecon", data.lecon.slug);
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("abreviation", data.abreviation);
    formik.setFieldValue("description", data.description);
  };

  return (
    <>
      <PageHeader title="Liste des cours" addModal={coursForm} />
      <div className="row">
        <div className="col-12 col-md-8 mx-auto">
        <form onSubmit={formik.handleSubmit}>
                <InputField
                  type={"text"}
                  name="label"
                  formik={formik}
                  placeholder="Nom du cours"
                  label={"Cours"}
                />
                <InputField
                  type={"text"}
                  name="abreviation"
                  formik={formik}
                  placeholder="Abreviation du cours"
                  label={"Abreviation"}
                />
                <InputField
                  type={"select"}
                  name="chapitre"
                  formik={formik}
                  placeholder="Sélectionnez une classe"
                  label={"Classe"}
                  options={[]}
                />
                <InputField
                  type={"select"}
                  name="chapitre"
                  label={"Matière"}
                  formik={formik}
                  placeholder="Sélectionnez une matière"
                  options={[]}
                />
                <InputField
                  type={"select"}
                  name="chapitre"
                  formik={formik}
                  placeholder="Sélectionnez un chapitre"
                  label={"Chapitre"}
                  options={[]}
                />
                <InputField
                  type={"select"}
                  name="lecon"
                  formik={formik}
                  placeholder="Sélectionnez un leçon"
                  label={"Leçon"}
                  options={lecons}
                />
                <InputField
                  type={"select"}
                  name="type"
                  formik={formik}
                  placeholder="Sélectionnez un type de cours"
                  label={"Type de cours"}
                  options={typeCours}
                />
                <InputField
                  type={"file"}
                  name="type"
                  formik={formik}
                  placeholder="Sélectionnez un type de cours"
                  label={"Fichiers du cours"}
                  options={typeCours}
                />
                <InputField
                  type={"textaera"}
                  name="description"
                  formik={formik}
                  placeholder="Description du cours"
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

      <Notify showModal={showModal} />
    </>
  );
};

export default CoursForm;
