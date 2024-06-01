import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import edit from "../assets/images/icons/edit.png";
import InputField from "../Components/InputField";
import PageHeader from "../Components/PageHeader";
import Table from "../Components/Table";
import TableContent from "../Components/TableContent";
import TableHeader from "../Components/TableHeader";
import * as Yup from "yup";
import request, { URL } from "../services/request";
import endPoint from "../services/endPoint";
import { AppContext } from "../services/context";

const initProduit = {
  categorie: "",
  label: "",
  amount: "",
  description: "",
  information: "",
  image: "",
  //email: "dabonne@gmail.com",
  code: "prod-451",
  status: "",
};
const Matiere = () => {
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
    initialValues: initProduit,
    validationSchema: validateData,
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
      .get(endPoint.produits, header)
      .then((res) => {
        setDatas(res.data.produits);
        getAllCategorie();
        console.log(res.data.produits);
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
      .post(endPoint.produits, data, header)
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
      .put(endPoint.produits + "/" + editId, data, header)
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
      .delete(endPoint.produits + "/" + id, header)
      .then((res) => {
        console.log(res.data);
        setRefresh(refresh + 1)
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
    console.log(data)
    formik.setFieldValue("categorie", data.categorieId);
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("amount", data.amount);
    formik.setFieldValue("description", data.description);
    formik.setFieldValue("information", data.information);
    formik.setFieldValue("image", data.image);
    formik.setFieldValue("status", data.status);
    formik.setFieldValue("code", data.code);
  }
  return (
    <>
      <PageHeader
        title="Liste des matières"
        modal="produitModal#"
        addModal={addModal}
      />
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Code</th>
          <th scope="col">Matière</th>
          <th scope="col">Matière</th>
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
                <td>PX-001</td>
                <td>
                  <div className="d-inline-block me-2">
                    <img
                      width="80px"
                      height="80px"
                      className="rounded-circle1"
                      src={URL+endPoint.produits+"/images/"+data.image}
                      alt=""
                    />
                  </div>
                  <div className="d-inline-block align-middle ps-2">
                    <span className="fw-bold">{data.label}</span> <br />
                    <span className="fw-14">{data.categorieId}</span>
                  </div>
                </td>
                <td>{data.amount} FCFA</td>
                <td>{data.information}</td>
                <td className="text-center">
                  <div className="btn-group">
                    <div className="d-inline-block mx-1">
                      <button className="btn btn-gray">
                        <img src={edit} alt="" />
                        <span> Voir</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-target="#produitModal"
                        data-bs-toggle="modal"
                        onClick={(e) => {
                          setEditId(data.id)
                          setEditeData(data)
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
      <div className="modal fade" id="produitModal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {editId !== ""
                  ? "Modification d’un produit"
                  : "Ajout d’un produit"}
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
                  placeholder="Nom du produit"
                  label={"Nom du produit"}
                />
                <InputField
                  type={"text"}
                  name="amount"
                  formik={formik}
                  placeholder="Prix du produit"
                  label={"Prix du produit"}
                />
                <InputField
                  type={"text"}
                  name="information"
                  formik={formik}
                  placeholder="Information du produit"
                  label={"Information du produit"}
                />
                <InputField
                  type={"text"}
                  name="status"
                  formik={formik}
                  placeholder="status du produit"
                  label={"status du produit"}
                />
                <InputField
                  type={"select"}
                  name="categorie"
                  formik={formik}
                  placeholder="Sélectionnez la catégorie du produit"
                  label={"Catégorie du produit"}
                  options={categories}
                />
                <InputField
                  type={"textarea"}
                  name="description"
                  formik={formik}
                  placeholder="Description du produit"
                  label={"Description du produit"}
                />

                <InputField
                  type={"file"}
                  name="image"
                  formik={formik}
                  placeholder="Choisir une image"
                  label={"Image"}
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

export default Matiere;
