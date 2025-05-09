import { useFormik } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";

const initData = {
  nom: "",
  prenom: "",
  email: "",
  is_moderator: "",
};

const MeetParticipant = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [meet, setMeet] = useState({});
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [refresh, setRefresh] = useState(0);
  const { slug } = useParams()
  const [userList, setUserList] = useState([])

  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    getUsers();
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
      values.nom = values.nom + " " + values.prenom
      values.is_moderator = 1
      console.log({
        users: [{ ...values }]
      })
      if (editId === "") {
        handleSubmit({
          users: [{ ...values }]
        });
      } else {
        values._method = "put";
        handleEditSubmit([values]);
      }
    },
  });

  const getAll = () => {
    request
      .get(endPoint.meets + "/" + slug + "/participants", header)
      .then((res) => {
        setDatas(res.data.data);
        setMeet(res.data.meet)
        console.log(res.data.data);
        console.log(res.data.meet);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUsers = () => {
    request
      .get(endPoint.utilisateurs, header)
      .then((res) => {
        //setDatas(res.data.data);
        //setMeet(res.data.meet)
        console.log(res.data.data);
        setUserList(res.data.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (data) => {
    //setShowModal(true)
    console.log(data)
    toast.promise(request.post(endPoint.meets + "/" + slug + "/participants-by-email", data, header), {
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
    toast.promise(request.post(endPoint.meets + "/" + editId, data, header), {
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
      request.delete(endPoint.meets + "/" + slug + "/participants/" + viewData.slug, header),
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

  const setEditData = (e, data) => {
    e.preventDefault()
    const name = data.name.split(' ');
    formik.setFieldValue("nom", name[0]);
    formik.setFieldValue("prenom", name[1]);
    formik.setFieldValue("email", data.email);
    setEditId(data.slug);
  }

  const copyToClipboard = (e, data) => {
    e.preventDefault()
    const url = meet.jitsi_meeting_link + "/" + meet.jitsi_room_name + "?jwt=" + data.meet_token
    navigator.clipboard.writeText(url).then(() => {
      alert("Lien copié !");
    }).catch(err => {
      console.error("Erreur lors de la copie :", err);
    });
  };

  return (
    <>
      <div className="card p-4 border">
        <div className="text-primary">
          <span className=" d-inline-block fs-1">{meet.title}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Date : </span>
          <span className="d-inline-block">{meet.date}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Heure : </span>
          <span className="d-inline-block">{meet.heure}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Durée : </span>
          <span className="d-inline-block">{meet.duration}</span>
        </div>
        <div>
          <span className="fw-bold d-inline-block me-2">Description : </span>
          <span className="d-inline-block">{meet.description}</span>
        </div>
      </div>
      <PageHeader title="Liste des participants"
        addModal={addModal}
        modal="form"
      ///canCreate={user.permissions?.includes("create lecon")}
      />
      <div className="d-flex">
        <div className="fw-bold me-auto">{datas.length} resultats</div>
        <button className="btn btn-primary me-1 mb-1"
          type="button"
          data-bs-toggle="modal"
          data-bs-target={"#" + "form"}
        >Ajouter une liste </button>
        <button className="btn btn-primary mb-1"
          type="button"
          data-bs-toggle="modal"
          data-bs-target={"#" + "createSessionModal"}
        >Selectionner une liste</button>

      </div>
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Nom Prénom</th>
          <th scope="col">Email</th>
          <th scope="col">Profile</th>
          <th scope="col">Liens</th>
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

                <td className="fw-bold1">{data.name}</td>
                <td className="fw-bold1">{data.email}</td>
                <td className="fw-bold1">{data.is_moderator === 1 ? <span className="badge text-bg-danger">Modérateur</span> : <span className="badge text-bg-secondary">Participant</span>}</td>
                <td className="fw-bold1">
                  <button onClick={e => copyToClipboard(e, data)} className="btn btn-primary">
                    Copier le lien
                  </button>
                </td>
                <td className="text-center">
                  <div className="btn-group">
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

      <ParticipantModal handleSubmit={handleSubmit} />
      <CreateSessionModal usersList={userList} onSubmit={handleSubmit} />
      <div className="modal fade" id="formUpdate">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {editId !== ""
                  ? "Modification d’informations du participant"
                  : "Ajout d’un participant"}
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
                  name="nom"
                  formik={formik}
                  placeholder="Nom du participant"
                  label={"Nom"}
                />
                <InputField
                  type={"text"}
                  name="prenom"
                  formik={formik}
                  placeholder="Prénom du participant"
                  label={"Prénom"}
                />
                <InputField
                  type={"email"}
                  name="email"
                  formik={formik}
                  placeholder="email du participant"
                  label={"Email"}
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

export default MeetParticipant;


const ParticipantModal = ({ handleSubmit }) => {
  const [participants, setParticipants] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const formik = useFormik({
    initialValues: {
      nom: "",
      prenom: "",
      email: "",
      is_moderator: false,
    },
    onSubmit: (values, { resetForm }) => {
      if (editIndex !== null) {
        const updated = [...participants];
        updated[editIndex] = values;
        setParticipants(updated);
        setEditIndex(null);
      } else {
        setParticipants([...participants, values]);
      }

      resetForm();
    },
  });

  const handleEdit = (index) => {
    setEditIndex(index);
    formik.setValues(participants[index]);
  };

  const handleDelete = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  return (
    <div className="modal fade" id="form">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h4 className="modal-title text-medium text-bold">
              {editIndex !== null
                ? "Modification d’informations du participant"
                : "Ajout d'une liste de participant"}
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
                type="text"
                name="nom"
                formik={formik}
                placeholder="Nom du participant"
                label="Nom"
              />
              <InputField
                type="text"
                name="prenom"
                formik={formik}
                placeholder="Prénom du participant"
                label="Prénom"
              />
              <InputField
                type="email"
                name="email"
                formik={formik}
                placeholder="Email du participant"
                label="Email"
              />

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="is_moderator"
                  name="is_moderator"
                  checked={formik.values.is_moderator}
                  onChange={formik.handleChange}
                  className="form-check-input"
                />
                <label htmlFor="is_moderator" className="form-check-label">
                  Est modérateur
                </label>
              </div>

              <div className="d-flex justify-content-start border-0 mb-3">

                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
                <button
                  type="reset"
                  className="btn btn-secondary ms-auto me-2"
                  onClick={() => {
                    formik.resetForm();
                    setEditIndex(null);
                  }}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" onClick={e => {
                  e.preventDefault()
                  handleSubmit({
                    users: participants
                  })
                }}>
                  Enregistrer
                </button>

              </div>
            </form>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Modérateur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.length > 0 ? (
                  participants.map((p, index) => (
                    <tr key={index}>
                      <td>{p.nom}</td>
                      <td>{p.prenom}</td>
                      <td>{p.email}</td>
                      <td>{p.is_moderator ? "Oui" : "Non"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => handleEdit(index)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Aucun participant ajouté
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

//export default ParticipantsModal;



const CreateSessionModal = ({ usersList, onSubmit }) => {
  const [selectedType, setSelectedType] = useState("all");

  const filteredUsers = usersList.filter(
    user => selectedType === "all" || user.profile === selectedType
  );

  return (
    <div className="modal fade" id="createSessionModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">Ajout d'une liste de participant</h5>
            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <Formik
              initialValues={{ participants: [] }}
              onSubmit={values => {
                const users = values.participants.map(p => JSON.parse(p));
                onSubmit({ users });
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  {/* Choix du rôle */}
                  <div className="mb-3">
                    <label className="form-label">Filtrer par profil</label>
                    <select
                      className="form-select"
                      onChange={e => setSelectedType(e.target.value)}
                    >
                      <option value="all">Tous</option>
                      <option value="ELEVE">Élève</option>
                      <option value="ENSEIGNANT">Enseignant</option>
                      <option value="GESTIONNAIRE">Gestionnaire</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  </div>

                  {/* Liste des utilisateurs */}
                  <div className="table-responsive mb-3">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Choix</th>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Classe</th>
                          <th>Modérateur ?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => {
                          const isChecked = values.participants.some(
                            p => JSON.parse(p).id === user.id
                          );
                          const participant = values.participants.find(
                            p => JSON.parse(p).id === user.id
                          );
                          const isModerator = participant ? JSON.parse(participant).is_moderator : false;

                          return (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => {
                                    const updated = [...values.participants];
                                    const index = updated.findIndex(
                                      p => JSON.parse(p).id === user.id
                                    );

                                    if (e.target.checked) {
                                      if (index === -1) {
                                        updated.push(
                                          JSON.stringify({
                                            id: user.id,
                                            nom: user.nom,
                                            prenom: user.prenom,
                                            email: user.email,
                                            classe: user.classe,
                                            is_moderator: false
                                          })
                                        );
                                      }
                                    } else {
                                      if (index !== -1) {
                                        updated.splice(index, 1);
                                      }
                                    }

                                    setFieldValue("participants", updated);
                                  }}
                                />
                              </td>
                              <td>{user.nom + " "+user.prenom}</td>
                              <td>{user.email}</td>
                              <td>{user.classe}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  disabled={!isChecked}
                                  checked={isModerator}
                                  onChange={e => {
                                    const updated = [...values.participants];
                                    const index = updated.findIndex(
                                      p => JSON.parse(p).id === user.id
                                    );

                                    if (index !== -1) {
                                      const parsed = JSON.parse(updated[index]);
                                      parsed.is_moderator = e.target.checked;
                                      updated[index] = JSON.stringify(parsed);
                                      setFieldValue("participants", updated);
                                    }
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Enregister la liste
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

//export default CreateSessionModal;
