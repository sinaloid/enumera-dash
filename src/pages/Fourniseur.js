import React, { useState, useContext, useEffect } from "react";
import edit from "../assets/images/icons/edit.png";
import PageHeader from "../Components/PageHeader";
import Table from "../Components/Table";
import TableContent from "../Components/TableContent";
import TableHeader from "../Components/TableHeader";
import request from "../services/request";
import endPoint from "../services/endPoint";
import { useFormik } from "formik";
import { AppContext } from "../services/context";
import * as Yup from "yup";
import InputField from "../Components/InputField";

const initLivreur = {};
const Fournisseur = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState("");
  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
  }, [refresh]);

  const validateData = Yup.object({
    label: Yup.string()
      .min(3, "Le nom du produit doit contenir 3 caractères ou moins")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    amount: Yup.string()
      .min(3, "Le prix du produit doit contenir 3 caractères ou moins")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    information: Yup.string()
      .min(
        3,
        "L'information sur le produit doit contenir 3 caractères ou moins"
      )
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    categorie: Yup.string()
      .min(1, "La categorie du produit doit contenir 3 caractères ou moins")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    description: Yup.string()
      .min(3, "La description du produit doit contenir 3 caractères ou moins")
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
    initialValues: initLivreur,
    //validationSchema: validateData,
    onSubmit: (values) => {
      console.log(values);
      if (editId === "") {
        handleSubmit(values);
      } else {
        handleEditSubmit(values);
      }
    },
  });

  const getAll = () => {
    request
      .get(endPoint.fournisseurs, header)
      .then((res) => {
        setDatas(res.data.fournisseurs);
        /// getAllCategorie();
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllCategorie = () => {
    request
      .get(endPoint.categories, header)
      .then((res) => {
        const datas = res.data.categories.map((data) => {
          return {
            id: data.id,
            label: data.label,
          };
        });
        setCategories(datas);
        console.log(datas);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (data) => {
    //setShowModal(true)
    request
      .post(endPoint.fournisseurs, data, header)
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
      .put(endPoint.fournisseurs + "/" + editId, data, header)
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

  const onDelete = (id) => {
    request
      .delete(endPoint.fournisseurs + "/" + id, header)
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
  const setEditeData = (data) => {
    console.log(data);
    formik.setFieldValue("firstName", data.firstName);
    formik.setFieldValue("lastName", data.lastName);
    formik.setFieldValue("sex", data.sex);
    formik.setFieldValue("email", data.email);
    formik.setFieldValue("idNumber", data.idNumber);
    formik.setFieldValue("phone", data.phone);
    formik.setFieldValue("birthDay", data.birthDay);
    formik.setFieldValue("living", data.living);
    formik.setFieldValue("photo", data.photo);
    formik.setFieldValue("status", data.status);
  };

  return (
    <>
      <PageHeader
        title="Liste des fournisseurs"
        modal="livreurModal"
        addModal={addModal}
      />
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Nom Prénom</th>
          <th scope="col">Contact</th>
          <th scope="col">Adresse</th>
          <th scope="col">genre</th>
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
                <td>{data.lastName + " " + data.firstName}</td>
                <td>
                  <span>{data.phone}</span> <br />
                  <span>{"email"}</span> <br />
                </td>
                <td>{data.living}</td>
                <td>{data.sex}</td>
                <td className="text-center">
                  <div className="btn-group">
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#livreurModal"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditId(data.id);
                          setEditeData(data);
                        }}
                      >
                        <img src={edit} alt="" />
                        <span> Modifier</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-danger"
                        onClick={(e) => {
                          onDelete(data.id);
                        }}
                      >
                        <img src={edit} alt="" />
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
      <div className="modal fade" id="livreurModal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {editId !== ""
                  ? "Modification d’un fournisseur"
                  : "Ajout d’un fournisseur"}
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
                  name="firstName"
                  formik={formik}
                  placeholder="Nom"
                  label={"Nom"}
                />
                <InputField
                  type={"text"}
                  name="lastName"
                  formik={formik}
                  placeholder="Prénom"
                  label={"Prénom"}
                />
                <InputField
                  type={"text"}
                  name="email"
                  formik={formik}
                  placeholder="Email"
                  label={"Email"}
                />
                <InputField
                  type={"text"}
                  name="phone"
                  formik={formik}
                  placeholder="Téléphone"
                  label={"Téléphone"}
                />
                <InputField
                  type={"date"}
                  name="birthDay"
                  formik={formik}
                  placeholder="Date de naissance"
                  label={"Date de naissance"}
                />
                <InputField
                  type={"text"}
                  name="living"
                  formik={formik}
                  placeholder="Lieu de résidence"
                  label={"Lieu de résidence"}
                />
                <InputField
                  type={"text"}
                  name="sex"
                  formik={formik}
                  placeholder="Sexe"
                  label={"Sexe"}
                />
                <InputField
                  type={"text"}
                  name="idNumber"
                  formik={formik}
                  placeholder="Numéro. ID"
                  label={"Numéro. ID"}
                />
                <InputField
                  type={"file"}
                  name="photo"
                  formik={formik}
                  placeholder="Date de fin"
                  label={"Date de fin"}
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

export default Fournisseur;
