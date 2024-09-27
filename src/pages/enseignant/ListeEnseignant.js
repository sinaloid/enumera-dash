import React, { useContext, useEffect, useState } from "react";
import edit from "../../assets/images/icons/edit.png";
import PageHeader from "../../Components/PageHeader";
import Table from "../../Components/Table";
import TableContent from "../../Components/TableContent";
import TableHeader from "../../Components/TableHeader";
import request from "../../services/request";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AppContext } from "../../services/context";
import * as Yup from "yup";
import InputField from "../../Components/InputField";
import { useNavigate } from "react-router-dom";
import endPoint  from "../../services/endPoint";
const initData = {
  nom: "",
  prenom: "",
  date_de_naissance: "",
  genre: "",
  profile: "",
  telephone: "",
  email: "",
  password: "",
};

const profile = "ENSEIGNANT"

const ListEnseignant = ({ title }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();
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
      values.profile = profile;
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
      .get(endPoint.utilisateurs+ "/profile/" + profile, header)
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
    toast.promise(request.post(endPoint, data, header), {
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
    toast.promise(request.post(endPoint + "/" + editId, data, header), {
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

  const changeBblockStatut = (data) => {
    //setShowModal(true)
    toast.promise(
      request.post("users/change-block-statut", { email: data.email }, header),
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
            return data.response.data.errors
              ? data.response.data.errors
              : data.response.data.error;
          },
        },
      }
    );
  };

  const onDelete = () => {
    toast.promise(request.delete(endPoint.utilisateurs + "/" + viewData.slug, header), {
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
    });

    request
      .delete(endPoint + "/" + viewData.slug, header)
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
    console.log(data);
    setEditId(data.slug);
    formik.setFieldValue("nom", data.nom);
    formik.setFieldValue("prenom", data.prenom);
    formik.setFieldValue("date_de_naissance", data.date_de_naissance);
    formik.setFieldValue("genre", data.genre);
  };
  return (
    <>
      <PageHeader title={title} modal="form" addModal={addModal} />
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Nº matricule</th>
          <th scope="col">Nom prénom</th>
          <th scope="col">Date de naissance</th>
          <th scope="col">Genre</th>
          <th scope="col">Contact</th>
          <th scope="col">Classes</th>
          <th scope="col" className="text-center">
            Etat du compte
          </th>
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
                <td>{data.matricule}</td>
                <td>{data.nom + " " + data.prenom}</td>
                <td>{new Date(data.date_de_naissance).toLocaleDateString()}</td>
                <td>{data.genre === "M" ? "Homme" : "Femme"}</td>

                <td>
                  <div className="d-inline-block align-middle">
                    <span className="fs-14">Tél : {data.telephone}</span> <br />
                    <span className="fs-14">Email : {data.email}</span>
                  </div>
                </td>
                <td>
                  <span className="btn-sm bg-primary text-white px-1 rounded">
                    6 ème
                  </span>
                </td>
                <td className="text-center">
                  {data.isBlocked === 1 ? (
                    <span className="btn-sm bg-danger fw-bold rounded-2 text-white">
                      Le compte est bloqué
                    </span>
                  ) : (
                    <span className="btn-sm bg-success fw-bold rounded-2 text-white">
                      Le compte est actif
                    </span>
                  )}
                </td>

                <td className="text-center">
                  <div className="btn-group">
                    {/**
                     * <div className="d-inline-block mx-1">
                      <button className="btn btn-gray">
                        <img src={edit} alt="" />
                        <span> Voir</span>
                      </button>
                    </div>
                     */}
                    {profile !== "ELEVE" && (
                      <div className="d-inline-block mx-1">
                        <button
                          className="btn btn-primary-light"
                          //data-bs-toggle="modal"
                          //data-bs-target="#form"
                          //onClick={(e) => setEditeData(e, data)}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              "/dashboard/groupe-droits-utilisateur/" +
                                data.slug
                            );
                          }}
                        >
                          <img src={edit} alt="" />
                          <span> Droits</span>
                        </button>
                      </div>
                    )}

                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        onClick={(e) => {
                          e.preventDefault()
                          navigate('/dashboard/enseignants/'+data.slug)
                        }}               
                      >
                        <img src={edit} alt="" />
                        <span> Voir</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className="btn btn-primary-light"
                        data-bs-toggle="modal"
                        data-bs-target="#form"
                        onClick={(e) => setEditeData(e, data)}
                      >
                        <img src={edit} alt="" />
                        <span> Modifier</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button
                        className={`btn ${
                          data.isBlocked === 0 ? "btn-danger" : "btn-success"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          changeBblockStatut(data);
                        }}
                      >
                        {data.isBlocked === 1 ? (
                          <span>Débloquer</span>
                        ) : (
                          <span>Bloquer</span>
                        )}
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
                  ? "Modification du compte"
                  : "Ajout d’un nouveau compte"}
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
                  name="matricule"
                  formik={formik}
                  placeholder="Numéro matricule"
                  label={"Matricule"}
                />
                <InputField
                  type={"text"}
                  name="nom"
                  formik={formik}
                  placeholder="Nom de l'utilisateur"
                  label={"Nom"}
                />
                <InputField
                  type={"text"}
                  name="prenom"
                  formik={formik}
                  placeholder="Prénom de l'utilisateur"
                  label={"Prénom"}
                />
                <InputField
                  type={"date"}
                  name="date_de_naissance"
                  formik={formik}
                  placeholder=""
                  label={"Date de naissance"}
                />
                <InputField
                  type={"select"}
                  name="genre"
                  formik={formik}
                  placeholder="Sélectionnez le genre de l'utilisateur"
                  label={"Genre"}
                  options={[
                    { slug: "M", label: "Homme" },
                    { slug: "F", label: "Femme" },
                  ]}
                />

                {editId ? null : (
                  <>
                    <InputField
                      type={"text"}
                      name="telephone"
                      formik={formik}
                      placeholder="Numéro de téléphone de l'utilisateur"
                      label={"Téléphone"}
                    />
                    <InputField
                      type={"text"}
                      name="email"
                      formik={formik}
                      placeholder="Email de l'utilisateur"
                      label={"Email"}
                    />

                    <InputField
                      type={"password"}
                      name="password"
                      formik={formik}
                      placeholder="Mot de passe de l'utilisateur"
                      label={"Mot de passe"}
                    />
                  </>
                )}

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
    </>
  );
};

export default ListEnseignant;
