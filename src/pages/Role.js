import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import Select from "react-select";
import Groupe from "./groupe/Groupe";
import GroupeDroit from "./groupe/GroupeDroit";
import { Route, Routes } from "react-router-dom";

const initData = {
  name: "",
  display_name: "",
  description: "",
};
const Role = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    getAll();
    getPermission();
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
      .get(endPoint.roles, header)
      .then((res) => {
        setDatas(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getPermission = () => {
    request
      .get(endPoint.permissions, header)
      .then((res) => {
        const tab = res.data.map((data) => {
          return { value: data.name, label: data.name };
        });
        setPermissions(tab);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (data) => {
    //setShowModal(true)
    toast.promise(request.post(endPoint.roles, data, header), {
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
    toast.promise(request.post(endPoint.roles + "/" + editId, data, header), {
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
      request.delete(endPoint.classes + "/" + viewData.slug, header),
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

    request
      .delete(endPoint.roles + "/" + viewData.id, header)
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
  return (
    <>
      <Routes>
        <Route path="/" element={<Groupe />} />
        <Route path="/:slug" element={<GroupeDroit />} />
      </Routes>
    </>
  );
};

export default Role;
