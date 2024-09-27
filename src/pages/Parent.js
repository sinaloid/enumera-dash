import React from "react";
import Utilisateur from "./utilisateur/Utilisateur";
import endPoint from "../services/endPoint";


const Parent = () => {

  return (
    <>
      <Utilisateur endPoint={endPoint.utilisateurs} profile={"PARENT"} title={"Liste des parents"} />
    </>
  );
};

export default Parent;
