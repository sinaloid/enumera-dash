import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../../assets/images/login.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import request from "../../services/request";
import endPoint from "../../services/endPoint";
import { AppContext } from "../../services/context";
import { toast } from "react-toastify";
import InputField from "../../Components/InputField";

const initValue = {
  nom: "",
  prenom: "",
  date_de_naissance: "",
  genre: "",
  profile: "",
  telephone: "",
  email: "",
  password: "",
};
const GetOtp = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const validateData = Yup.object({
    email: Yup.string()
      .email("Adresse e-mail invalide")
      .required("Ce champ est obligatoire. Veuillez le remplir pour continuer"),
  });

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validateData,
    onSubmit: (values) => {
      //console.log(values);
      //alert(url)
      handleSubmit(values);
    },
  });

  const handleSubmit = (values) => {
    //console.log(data);

    toast.promise(request.post(endPoint.getOtp, values), {
      pending: "Veuillez patienté...",
      success: {
        render({ data }) {
          console.log(data);
          const res = data;
          
          if (pathname === "/mot-de-passe-oublie") {
            onUserChange({
              ...user,
              user: values.email,
            });
            navigate("/modification-du-mot-de-passe");
          } else {
            onUserChange({
              ...user,
              user: null,
            });
            navigate("/connexion");
          }

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
              <div className="text-center bg-white border py-2 rounded-3">
                <img className="rounded-3" width="50%" src={login} alt="" />
              </div>
              <form onSubmit={formik.handleSubmit} className="mt-3">
                <h1 className="fs-48 fw-bold text-primary m-0 text-center mb-3">
                  Mot de passe oublié ?
                </h1>
                <div className="mb-4 text-center">
                  {
                    "Entrez votre adresse e-mail pour recevoir un code OTP de réinitialisation"
                  }{" "}
                </div>

                <InputField
                  type="text"
                  name="email"
                  label="Email"
                  formik={formik}
                  placeholder="Entrez votre email"
                />

                <div className="checkbox mb-4 position-relative"></div>
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

export default GetOtp;
