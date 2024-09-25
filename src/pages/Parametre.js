import React from "react";
import Utilisateur from "./utilisateur/Utilisateur";
import endPoint from "../services/endPoint";
import { useNavigate } from "react-router-dom";

const Parametre = () => {
  const navigate = useNavigate()

  const goTo = (e,url) => {
    e.preventDefault()
    navigate(url)
  }
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4">
        <h1 className="">Paramètres</h1>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="bg-primary-light border p-2 fw-bold">
            Configurations
          </div>
          <div className="d-flex bg-white border p-2 cursor" onClick={ e => goTo(e,'/dashboard/classes')}>
            <span>Classes</span>
            <span className="ms-auto">
              <i className="bi bi-chevron-right"></i>
            </span>
          </div>
          <div className="d-flex bg-white border p-2 cursor" onClick={ e => goTo(e,'/dashboard/matieres')}>
            <span>Matières</span>
            <span className="ms-auto">
              <i className="bi bi-chevron-right"></i>
            </span>
          </div>
          <div className="d-flex bg-white border p-2 cursor" onClick={ e => goTo(e,'/dashboard/periodes')}>
            <span>Periodes</span>
            <span className="ms-auto">
              <i className="bi bi-chevron-right"></i>
            </span>
          </div>
          <div className="d-flex bg-white border p-2 cursor" onClick={ e => goTo(e,'/dashboard/matieres-d-une-classe')}>
            <span>Matière d'une classe</span>
            <span className="ms-auto">
              <i className="bi bi-chevron-right"></i>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Parametre;
