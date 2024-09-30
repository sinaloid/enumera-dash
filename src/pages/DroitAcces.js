import React, { useContext } from "react";
import Utilisateur from "./utilisateur/Utilisateur";
import endPoint from "../services/endPoint";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../services/context";

const DroitAcces = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const navigate = useNavigate();

  const droitMenu = [
    {
      name: "view utilisateur",
      url: "/dashboard/u-admin",
      display_name: "Utilisateurs",
    },
    {
      name: "view permission",
      url: "/dashboard/droits-access",
      display_name: "Droits d'accès",
    },
    {
      name: "view role",
      url: "/dashboard/groupes-utilisateurs",
      display_name: "Groupes d'utilisateurs",
    },
  ];

  const goTo = (e, url) => {
    e.preventDefault();
    navigate(url);
  };
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4">
        <h1 className="">Gestion des utilisateurs</h1>
      </div>
      <div className="row">
        <div className="col-12 mb-5">
          <div className="bg-primary-light border p-2 fw-bold">
            Gestion des accès
          </div>
          {droitMenu.map((data, idx) => {
            if(!user.permissions?.includes(data.name)){
              return null
            }
            return (
              <div
                className="d-flex bg-white border p-2 cursor"
                onClick={(e) => goTo(e, data.url)}
                key={idx}
              >
                <span>{data.display_name}</span>
                <span className="ms-auto">
                  <i className="bi bi-chevron-right"></i>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DroitAcces;
