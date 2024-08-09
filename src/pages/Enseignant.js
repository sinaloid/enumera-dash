import React from "react";
import Utilisateur from "./utilisateur/Utilisateur";
import endPoint from "../services/endPoint";


const Enseignant = () => {

  return (
    <>
      <Utilisateur endPoint={endPoint.utilisateurs} profile={"ENSEIGNANT"} title={"Liste des enseignants"} />
    </>
  );
};

export default Enseignant;
