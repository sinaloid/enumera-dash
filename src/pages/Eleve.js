import React, { useContext, useState } from "react";

import { AppContext } from "../services/context";
import ListeEleve from "./eleve/ListeEleve";
import { Route, Routes } from "react-router-dom";
import InfosEleve from "./eleve/InfosEleve";

const Eleve = () => {
  

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
