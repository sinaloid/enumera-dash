import React, { useState } from "react";
import edit from "../assets/images/icons/edit.png";
import PageHeader from "../Components/PageHeader";
import Table from "../Components/Table";
import TableContent from "../Components/TableContent";
import TableHeader from "../Components/TableHeader";
import Utilisateur from "./utilisateur/Utilisateur";
import endPoint from "../services/endPoint";

const Eleve = () => {
  const [datas, setDatas] = useState([]);
  return (
    <>
      <Utilisateur endPoint={endPoint.utilisateurs} profile={"ELEVE"} title={"Liste des élèves"} />
    </>
  );
};

export default Eleve;
