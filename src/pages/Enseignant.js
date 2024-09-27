import React from "react";
import InfosEnseignant from "./enseignant/InfosEnseignant";
import ListEnseignant from "./enseignant/ListeEnseignant";
import { Route, Routes } from "react-router-dom";

const Enseignant = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ListEnseignant />} />
        <Route path="/:slug" element={<InfosEnseignant />} />
      </Routes>
    </>
  );
};

export default Enseignant;
