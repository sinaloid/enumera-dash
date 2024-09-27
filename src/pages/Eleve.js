import React, { useContext, useState } from "react";

import { AppContext } from "../services/context";
import ListeEleve from "./eleve/ListeEleve";
import { Route, Routes } from "react-router-dom";
import InfosEleve from "./eleve/InfosEleve";

const Eleve = () => {
  const [datas, setDatas] = useState([]);
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;

  return (
    <>
      <Routes>
        <Route path="/" element={<ListeEleve />} />
        <Route path="/:slug" element={<InfosEleve />} />
      </Routes>
    </>
  );
};

export default Eleve;
