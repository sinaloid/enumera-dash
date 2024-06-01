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
  "dateDebut": "",
  "dateFin": "",
  "prix": "",
  "produit": ""
};
const Periode = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [produits, setProduits] = useState([]);
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
    getAllProduit()
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
      .get(endPoint.promotions, header)
      .then((res) => {
        setDatas(res.data.promotions);
        console.log(res.data.promotions);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllProduit = () => {
    request
      .get(endPoint.produits, header)
      .then((res) => {

        const tab = res.data.produits.map((data) => {
          return {id:data.id,label:data.produitLabel}
        })
        
        setProduits(tab);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (data) => {
    //setShowModal(true)
    request
      .post(endPoint.promotions, data, header)
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
      .put(endPoint.promotions + "/" + editId, data, header)
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
    formik.setFieldValue("produit", data.produitId);
    formik.setFieldValue("prix", data.prix);
    formik.setFieldValue("debut", data.debut);
    formik.setFieldValue("fin", data.fin);

  }
  return (
    <>
      <PageHeader
        title="Liste des periodes"
        modal="produitModal#"
        addModal={addModal}
      />
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">code</th>
          <th scope="col">Periode</th>
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
                <td>{data.produit}</td>
                <td>
                  {data.prix}
                </td>
                <td>{data.status}</td>
                <td>{data.debut}</td>
                <td>{data.fin}</td>
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
                          setEditId(data.promotionId)
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
                  ? "Modification d’une promotion"
                  : "Ajout d’un promotion"}
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
                  name="produit"
                  formik={formik}
                  placeholder="Nom du produit"
                  label={"Nom du produit"}
                  options={produits}
                />
                <InputField
                  type={"text"}
                  name="prix"
                  formik={formik}
                  placeholder="Prix du produit"
                  label={"Prix du produit"}
                />
                <InputField
                  type={"date"}
                  name="debut"
                  formik={formik}
                  placeholder="Date de début"
                  label={"Date de début"}
                />
                <InputField
                  type={"date"}
                  name="fin"
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

export default Periode;
