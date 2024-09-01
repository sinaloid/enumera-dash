import React, { useContext, useState } from "react";
import edit from "../assets/images/icons/edit.png";
import PageHeader from "../Components/PageHeader";
import Table from "../Components/Table";
import TableContent from "../Components/TableContent";
import TableHeader from "../Components/TableHeader";
import Utilisateur from "./utilisateur/Utilisateur";
import endPoint from "../services/endPoint";
import { AppContext } from "../services/context";

const Eleve = () => {
  const [datas, setDatas] = useState([]);
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;

  return (
    <>
      <Utilisateur endPoint={endPoint.utilisateurs} profile={user.profile ==="ADMIN" ? "ELEVE" : ""} title={"Liste des élèves"} />
    </>
  );
};

export default Eleve;
