import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "./assets/images/login.png";
import eHide from "./assets/images/icons/eyeHide.png";
import eView from "./assets/images/icons/eye.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import request from "./services/request";
import endPoint from "./services/endPoint";
import { AppContext } from "./services/context";
import InputField from "./Components/InputField";

const initValue = {
  user: "ounoid@gmail.com",
  password: "12345678",
};
const Login = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [inputType, setInputType] = useState("password");
  const [viewContent, setViewContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    isAuth();
  }, [user.isAuth]);

  const validateData = Yup.object({
    login: Yup.string()
      .email("Adresse e-mail invalide")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir 8 caractères ou moins")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
  });

  const formik = useFormik({
    initialValues: initValue,
    //validationSchema: validateData,
    onSubmit: (values) => {
      //console.log(values);
      handleSubmit(values);
    },
  });

  const handleSubmit = (data) => {
    
    request
      .post(endPoint.login, data)
      .then((res) => {
        console.log(res.data);
        onUserChange({
          isAuth: true,
          isActive: res.data.user.isActive,
          isBlocked: res.data.user.isBlocked,
          profile: res.data.user.profile,
          slug: res.data.user.slug,
          name: res.data.user.nom+" "+res.data.user.prenom,
          token: res.data.access_token,
          token_refresh: null,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isAuth = () => {
    if (user.isAuth === true && user.token != null && user.token !== "") {
      console.log(`connexion reussi, isAuth: ${user}`);
      console.log(user);

      return navigate("/dashboard/");
    }
  };

  return (
    <div className="row">
      <div className="col-12 col-md-10 mx-auto">
        <div className="row">
          <div className="col-12 col-lg-5 mx-auto pt-5">
            <div className="text-center">
              <img width="50%" src={login} alt="" />
            </div>
            <form onSubmit={formik.handleSubmit} className="mt-3">
              <h1 className="fs-48 fw-bold text-primary m-0 text-center m-0">Connexion</h1>
              <div className="mb-4 text-center">
                Heureux de vous revoir
              </div>

              <InputField
                type="email"
                name="user"
                formik={formik}
                placeholder="Entrer votre email"
              />

              <div className="position-relative">
                <InputField
                  type={inputType}
                  name="password"
                  formik={formik}
                  placeholder="Entrer votre mot de passe"
                >
                  <img
                    className="position-absolute eye-position"
                    src={viewContent ? eView : eHide}
                    alt=""
                    onClick={(e) => {
                      e.preventDefault();
                      if (inputType === "password") {
                        setInputType("text");
                        setViewContent(!viewContent);
                      } else {
                        setInputType("password");
                        setViewContent(!viewContent);
                      }
                    }}
                  />
                </InputField>
              </div>

              <div className="checkbox mb-3 position-relative">
                <label className="text-small align-middle">
                  <input
                    className="d-inline-block"
                    type="checkbox"
                    value="remember-me"
                    style={{ height: "fit-content" }}
                  />{" "}
                  <span>Se souvenir de moi</span>
                </label>
                <Link
                  to="#"
                  className="fs-14 text-black link text-decoration-none position-absolute top-0 end-0"
                  data-bs-toggle="modal"
                  data-bs-target="#forgetPassword"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <button
                type="submit"
                className="w-100 btn btn-lg btn-primary text-uppercase p-0"
              >
                Se connecter
              </button>
              <div className="text-center my-2">
                <span>
                  <span>Vous n'avez pas de compte ?</span>
                  <Link to={"#"} className="fs-14 text-black">
                    {" "}
                    Inscrivez-vous
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
