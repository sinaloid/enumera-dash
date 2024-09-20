import React from "react";
import Utilisateur from "./../utilisateur/Utilisateur";
import endPoint from "../../services/endPoint";


const Admin = () => {

  return (
    <>
      <Utilisateur endPoint={endPoint.utilisateurs} profile={"ADMIN"} title={"Liste des administrateurs"} />
    </>
  );
};

export default Admin;
