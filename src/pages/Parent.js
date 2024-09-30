import React from "react";
import endPoint from "../services/endPoint";
import ListParent from "./utilisateur/ListParent";


const Parent = () => {

  return (
    <>
      <ListParent endPoint={endPoint.utilisateurs} profile={"PARENT"} title={"Liste des parents"} />
    </>
  );
};

export default Parent;
