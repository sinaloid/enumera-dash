import { useFormik } from "formik";
import request, { URL } from "../services/request";
import endPoint from "../services/endPoint";
import { useContext, useEffect, useRef, useState } from "react";
import profile from "../assets/images/logo.jpg";
import { AppContext } from "../services/context";
import InputField from "../Components/InputField";
import { toast } from "react-toastify";

const initdata = {
  email: "",
  password: "",
  oldPassword: "",
  numeroTelephone: "",
};
export const MonCompte = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [userInfo, setUserInfo] = useState({})
  const [message, setMessage] = useState({})
  const closeEditImage = useRef()

  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };


  useEffect(() => {
    get();
  }, []);

  const formik = useFormik({
    initialValues: initdata,
    onSubmit: (values) => {
      values.email = userInfo.user.email
      values.numeroTelephone = userInfo.user.numeroTelephone
      console.log(values);

      update(values);
    },
  });

  const formikImage = useFormik({
    initialValues: initdata,
    onSubmit: (values) => {
      console.log(values);
      updateImage(values);
    },
  });
  const formikPassword = useFormik({
    initialValues: {password:"",oldPassword:""},
    onSubmit: (values) => {
      updatePassword(values);
    },
  });

  const get = () => {
    request
      .get(endPoint.utilisateurs + "/auth/infos", header)
      .then((res) => {
        console.log(res.data.data);
        setUserInfo(res.data.data)
        formik.setFieldValue("id", res.data.data.slug);
        formik.setFieldValue("nom", res.data.data.nom);
        formik.setFieldValue("prenom", res.data.data.prenom);
        formik.setFieldValue("genre", res.data.data.genre);
        formik.setFieldValue("email", res.data.data.email);
        formik.setFieldValue("date_de_naissance", res.data.data.date_de_naissance);
        formik.setFieldValue("matricule", res.data.data.matricule);
        formik.setFieldValue(
          "telephone",
          res.data.data.telephone
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const update = (values) => {
    request
      .put(endPoint.users + "/" + values.id, values, header)
      .then((res) => {
        console.log(res.data);
        setMessage({
          isSuccess: true,
          message: res.data.message
        })
        get()
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          isSuccess: false,
          message: "Echec lors de la modification des données"
        })
      });
  };

  const updateImage = (values) => {
    toast.promise(request.post(endPoint.utilisateurs + "/auth/image", values, header), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);

          closeEditImage.current.click()

          get()
          const res = data;
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

  const updatePassword = (values) => {
    toast.promise(request.post(endPoint.utilisateurs + "/auth/password", values, header), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          get()
          const res = data;
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

  return (
    <>
      <div className="row">
        <h1 className="h2">Paramètres de mon compte</h1>
      </div>
      <div className="row my-4">
        <div className="col-12 col-md-5 col-lg-4 ">
          <div className="border p-4 bg-white">
            <img
              width="100%"
              src={userInfo.image ? URL + "/" + userInfo.image : profile}
              alt=""
            />
            <div className="my-3 d-flex justify-content-center">
              <button
                className="btn btn-primary me-2 w-75"
                data-bs-toggle="modal"
                data-bs-target="#editimage"
              >
                Modifier la photo
              </button>
              <img src={"del"} alt="" />
            </div>
          </div>

          <div className="border border-1 p-4 mt-4 bg-white">
            <p className="text-16 text-bold">Changement de mot de passe</p>
            <div className={` fw-bold text-white mb-3 ${message.isSuccess ? "bg-success" : "bg-danger"}`}>
              {message.message}
            </div>
            <p className="text-start">Ancien mot de passe</p>
            <InputField
              type={"password"}
              placeholder="Entrer votre ancien mot de passe"
              name={"oldPassword"}
              formik={formikPassword}
            />
            <p className="text-start">Nouveau mot de passe</p>
            <InputField
              type={"password"}
              placeholder="Entrer votre nouveau mot de passe"
              name={"password"}
              formik={formikPassword}
            />
            <p className="text-start">Confirmation de votre nouveau mot de passe</p>
            <InputField
              type={"password"}
              placeholder="Entrer votre nouveau mot de passe"
              name={"confPassword"}
              formik={formikPassword}
            />
            {
              formikPassword.values['confPassword'] !== formikPassword.values['password'] && <div className="text-danger">
                Le nouveau mot de passe ne correspond pas à la confirmation
              </div>
            }
            <button
              className="btn btn-primary border border-1 my-2 w-100"
              onClick={formikPassword.handleSubmit}
              disabled={formikPassword.values['confPassword'] !== formikPassword.values['password'] || formikPassword.values['oldPassword'].length === 0}
            >
              Modification du mot de passe
            </button>
            {/*<button
              className="btn border border-1 my-2 w-100"
              data-bs-dismiss="modal"
            
              >
              Aide et support
            </button>
            <button
              className="btn border border-1 my-2 w-100"
              data-bs-dismiss="modal"
            >
              Conditions d’utilisation
            </button>*/}
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-6 bg-white mx-auto border border-1 p-4">
          <p className="text-16 text-bold">Mes informations personnelles</p>
          <form className="w-100" action="">
            <>
              <p className="text-start">Nom</p>
              <InputField
                type={"text"}
                placeholder="nom"
                name={"nom"}
                formik={formik}
              />
              <p className="text-start">Prenom</p>
              <InputField
                type={"text"}
                placeholder="prenom"
                name={"prenom"}
                formik={formik}
              />
              <p className="text-start">Date de naissance</p>
              <InputField
                type={"date"}
                placeholder="Date de naissance"
                name={"date_de_naissance"}
                formik={formik}
              />
              <p className="text-start">Numéro matricule</p>
              <InputField
                type={"text"}
                placeholder="Numéro matricule"
                name={"matricule"}
                formik={formik}
              />
              <p className="text-start">Email</p>
              <InputField
                type={"text"}
                placeholder="email"
                name={"email"}
                formik={formik}
              />

              <p className="text-start">Genre</p>
              <InputField
                type={"text"}
                placeholder="genre"
                name={"genre"}
                formik={formik}
              />
              <p className="text-start">Téléphone</p>
              <InputField
                type={"text"}
                placeholder="Numéro de téléphone"
                name={"telephone"}
                formik={formik}
              />
              <div className="d-flex justify-content-center1">
                {
                  /**
                   * <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  // onClick={formik.handleSubmit}
                >
                  Enregistrer
                </button>
                   */
                }
              </div>
            </>
          </form>
        </div>
      </div>
      <div
        className="modal fade"
        id="editimage"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modification de l'image de profile
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-start">
              <span className="d-block mb-3">
                Choisissez une image de profile
              </span>
              <InputField
                type={"file"}
                placeholder="Image de profile"
                name={"image"}
                formik={formikImage}
              />

            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeEditImage}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={formikImage.handleSubmit}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
