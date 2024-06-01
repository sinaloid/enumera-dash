import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import edit from "../assets/images/icons/edit.png";
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

const initCategorie = {
  label: "",
  image: "",
  //code: "09_dsfdO0_fssdfsd",
};
const Classe = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId,setEditId] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [refresh,setRefresh] = useState(0)
  const header = {
    headers: { Authorization: `Bearer ${user.token}`,
      "Content-Type":"multipart/form-data"
   },
  };

  useEffect(() => {
    getAll()
  },[refresh])
  const validateData = Yup.object({
    label: Yup.string()
      .min(3, "Le nom de la catégorie doit contenir 3 caractères ou moins")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    image: Yup.mixed()
      .required('Une image est requise')
      .test('fileFormat', 'Seuls les fichiers jpeg, png et gif sont autorisés', (value) => {
        return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', 'La taille maximale autorisée est de 2 Mo', (value) => {
        return value && value.size <= 2 * 1024 * 1024;
      }),
  });
  const formik = useFormik({
    initialValues: initCategorie,
    validationSchema: validateData,
    onSubmit: (values) => {
      
      if(editId === ""){
        handleSubmit(values)
      }else{
        handleEditSubmit(values)
      }
    },
  });

  const getAll = () => {
    request.get(endPoint.categories, header).then((res) =>{
      setDatas(res.data.categories)
      console.log(res.data.categories)
    }).catch((error) => {
      console.log(error)
    })
  }
  const handleSubmit = (data) => {
    //setShowModal(true)
    request.post(endPoint.categories,data,header).then((res) =>{
      console.log("Enregistrer avec succès")
      setRefresh(refresh + 1)
      console.log(res.data)
    }).catch((error) => {
      console.log("Echec !")
      console.log(error)
    })
  }
  const handleEditSubmit = (data) => {
    //setShowModal(true)
    request.put(endPoint.categories+"/"+editId,data,header).then((res) =>{
      console.log("Enregistrer avec succès")
      setEditId("")
      setRefresh(refresh + 1)
      console.log(res)
    }).catch((error) => {
      console.log("Echec !")
      console.log(error)
    })
  }

  const onDelete = (id) => {
    request.delete(endPoint.categories + "/"+id,header).then((res) =>{
      console.log(res.data)
      setRefresh(refresh + 1)
    }).catch((error) => {
      console.log(error)
    })
  }

  const addModal = (e) => {
    e.preventDefault()
    setEditId("")
    formik.resetForm()
  }
  return (
    <>
      <PageHeader title="Liste des classes" modal="categorieModal#" addModal={addModal}/>
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Image</th>
          <th scope="col">Nom de la classe</th>
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
                <td className="fw-bold">
                  <img
                    width="80px"
                    height="80px"
                    className="rounded-circle"
                    src={URL + endPoint.produits + "/images/" + data.image}
                    alt=""
                  />
                </td>
                <td className="fw-bold">{data.label}</td>
                <td className="text-center">
                  <div className="btn-group">
                    <div className="d-inline-block mx-1">
                      <button className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#categorieModal"
                        onClick={(e) => {
                          formik.setFieldValue("label",data.label)
                          setEditId(data.id)
                        }}
                      >
                        <img src={edit} alt="" />
                        <span> Modifier</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button className="btn btn-danger"
                        onClick={(e) => {
                          onDelete(data.id)
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
      <div className="modal fade" id="categorieModal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {
                  editId !=="" ? "Modification d’une catégorie" : "Ajout d’une catégorie"
                }
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
                  placeholder="Nom de la catégorie"
                  label={"Catégorie"}
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
      <Notify showModal={showModal}/>
    </>
  );
};

export default Classe;
