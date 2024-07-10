import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../../assets/images/login.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import request from "../../services/request";
import endPoint from "../../services/endPoint";
import { AppContext } from "../../services/context";

import { toast } from "react-toastify";
import InputField from "../../Components/InputField";
import LogoContainer from "./component/LogoContainer";

const initValue = {
  email: "",
  password: "",
  otp: "",
};
const ResetPassword = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [inputType, setInputType] = useState("password");
  const [viewContent, setViewContent] = useState(false);
  const navigate = useNavigate();

  const validateData = Yup.object({
    otp: Yup.string()
      .min(6, "Le code doit contenir 8 chiffres au moins")
      .max(6, "Le code doit contenir 8 chiffres au plus")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir 8 caractères ou moins")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
  });

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validateData,
    onSubmit: (values) => {
      console.log(values);
      values.email = user.user;
      handleSubmit(values);
    },
  });

  const handleSubmit = (data) => {
    //console.log(data);

    toast.promise(request.post(endPoint.editPassword, data), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);
          const res = data;
          onUserChange({
            ...user,
            user: null,
          });
          navigate("/");
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

  const getOtp = (e) => {
    e.preventDefault();
    toast.promise(request.post(endPoint.getOtp, { email: user.user }), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);
          const res = data;

          return res.data.message;
        },
      },
      error: {
        render({ data }) {
          console.log(data);
          if(data?.response?.data?.message){
            return data?.response?.data?.message
          }
          return data?.response?.data?.errors
            ? data?.response?.data?.errors
            : data?.response?.data?.error;
        },
      },
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-10 mx-auto">
          <div className="row">
            <div className="col-12 col-lg-5 mx-auto pt-5">
              <LogoContainer />
              <form onSubmit={formik.handleSubmit} className="mt-3">
                <h1 className="fs-48 fw-bold text-primary m-0 text-center m-0">
                  Modification de votre mot de passe
                </h1>
                <div className="mb-4 text-center">
                  {
                    "Entrez le nouveau mot de passe et le code OTP que vous avez reçu dans votre boîte mail à l'adresse"
                  }{" "}
                  <br />
                  <span className="text-primary fw-bold">{user.user}</span>
                </div>
                <div className="mb-2">Mot de passe</div>
                <div className="position-relative">
                  <InputField
                    type={inputType}
                    name="password"
                    formik={formik}
                    placeholder="Entrer votre mot de passe"
                  >
                    <span
                      className="position-absolute"
                      style={{ right: "2%", top: "20%" }}
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
                    >
                      {viewContent ? (
                        <>
                          <i className="bi bi-eye-fill"></i>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-eye-slash-fill"></i>
                        </>
                      )}
                    </span>
                  </InputField>
                </div>

                <InputField
                  type="text"
                  label="Code OTP"
                  name="otp"
                  formik={formik}
                  placeholder="Entrez le code OTP"
                />

                <div className="checkbox mb-3 position-relative">
                  <label className="text-small align-middle">
                    <span className="text-primary" onClick={getOtp}>
                      Cliquez ici pour renvoyer le code
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-100 btn btn-lg btn-primary text-uppercase p-0"
                >
                  Valider
                </button>
                <div className="text-center my-3">
                  <span>
                    <span>{"Vous avez déjà un compte ?"}</span>
                    <Link to={"/"} className="fs-14 text-black">
                      {" "}
                      connectez-vous
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
