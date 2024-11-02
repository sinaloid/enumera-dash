import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import supp from "./assets/imgs/supp.png";
import logo from "./assets/images/login.png";
import home from "./assets/imgs/home.png";
import employe from "./assets/imgs/employe.png";
import rendv from "./assets/imgs/rendezvous.png";
import agenda from "./assets/imgs/agenda.png";
import patient from "./assets/imgs/patient.png";
import { deleteUser } from "./services/storage";
import { AppContext, initialUser } from "./services/context";
import Classe from "./pages/Classe";
import Matiere from "./pages/Matiere";
import Periode from "./pages/Periode";
import Eleve from "./pages/Eleve";
import Enseignant from "./pages/Enseignant";
import Parent from "./pages/Parent";
import MatiereClasse from "./pages/MatiereClasse";
import Chapitre from "./pages/Chapitre";
import Lecon from "./pages/Lecon";
import Cours from "./pages/Cours";
import Evaluation from "./pages/Evaluation";
import CoursEnLigne from "./pages/CoursEnLigne";
import Retour from "./Components/Retour";
import Role from "./pages/Role";
import Permission from "./pages/Permission";
import GroupeDroitUtilisateur from "./pages/utilisateur/GroupeDroitUtilisateur";
import UAdmin from "./pages/UAdmin";
import DroitAcces from "./pages/DroitAcces";
import Parametre from "./pages/Parametre";
import { MonCompte } from "./pages/MonCompte";
const Dashboard = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const navigate = useNavigate();

  const tabMenu = [
    {
      droit: "view classe",
      url: "/dashboard/classes",
      display_name: "Classes",
    },
    {
      droit: "view matiere",
      url: "/dashboard/matieres",
      display_name: "Matières",
    },
    {
      droit: "view periode",
      url: "/dashboard/periodes",
      display_name: "Periodes",
    },
    {
      droit: "view matiereDeLaclasse",
      url: "/dashboard/matieres-d-une-classe",
      display_name: "Matières d'une classe",
    },
    {
      droit: "view chapitre",
      url: "/dashboard/chapitres",
      display_name: "Sections",
    },
    {
      droit: "view lecon",
      url: "/dashboard/lecons",
      display_name: "Leçons",
    },
    {
      droit: "view evaluation",
      url: "/dashboard/evaluations",
      display_name: "Evaluations",
    },
    {
      droit: "view discussion",
      url: "/dashboard/discussions",
      display_name: "Discussions",
    },
    {
      droit: "view classeVirtuelle",
      url: "/dashboard/cours-en-ligne",
      display_name: "Classes Virtuelles",
    },
    {
      droit: "view eleve",
      url: "/dashboard/eleves",
      display_name: "Élèves",
    },
    {
      droit: "view enseignant",
      url: "/dashboard/enseignants",
      display_name: "Enseignants",
    },
    {
      droit: "view parent",
      url: "/dashboard/parents",
      display_name: "Parents",
    },
    {
      droit: "view utilisateur",
      url: "/dashboard/utilisateurs",
      display_name: "Utilisateurs",
    },
    {
      droit: "view parametre",
      url: "/dashboard/user-compte",
      display_name: "Mon compte",
    },
    {
      droit: "view parametre",
      url: "/dashboard/parametres",
      display_name: "Paremètres",
    },
  ];

  useEffect(() => {
    isAuth();
  }, [user.isAuth]);

  const isAuth = () => {
    if (user.isAuth == false || user.token == null || user.token == "") {
      console.log(`connexion échoué, isAuth`);
      console.log(user);

      return navigate("/");
    } else {
      console.log("isAuth true");
    }
  };

  const deconnect = () => {
    deleteUser();
    onUserChange(initialUser);
  };

  return (
    <>
      <header className="container-fluid navbar navbar-dark bg-white sticky-top1 flex-md-nowrap px-0 py-2 shadow1 d-md-none">
        <div className="d-flex align-items-center justify-content-between w-100">
          <a className="navbar-brand1 bg-white me-auto px-3" href="#">
            <img width="64px" src={logo} alt="" />
          </a>
          <button
            className="navbar-toggler ms-auto mx-0 d-md-none collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="bi bi-list text-primary icon-size"></i>
          </button>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-1 col-lg-2 d-md-block bg-white sidebar overflow-y-scroll collapse p-0"
          >
            <div className="position-sticky h-100 text-small">
              <div className="col-12 d-none d-md-block text-center pt-4 pb-2 m-0">
                <img width={"30%"} src={logo} alt="" />
              </div>
              <div className="d-md-none py-2"></div>
              <ul className="nav flex-column">
                <li className="nav-item my-1 px-2">
                  <NavLink
                    to="/dashboard/"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active btn btn-primary border rounded-2 mx-auto py-0 text-start pt-1"
                        : "btn nav-link border-0 py-0 btn-secondary text-start pt-1"
                    }
                  >
                    <span className="d-none d-md-block d-lg-none wd-0">
                      <img src={home} alt="" />
                    </span>
                    <span
                      className="d-block d-md-none d-lg-block wd-80"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu.show"
                    >
                      Accueil
                    </span>
                  </NavLink>
                </li>
                {tabMenu.map((data, idx) => {
                  if (!user.permissions?.includes(data.droit)) {
                    return null;
                  }
                  return (
                    <li className="nav-item my-1 px-2" key={idx}>
                      <NavLink
                        to={data.url}
                        className={({ isActive }) =>
                          isActive
                            ? "nav-link active btn btn-primary border rounded-2 mx-auto py-0 text-start pt-1"
                            : "btn nav-link border-0 py-0 btn-secondary text-start pt-1"
                        }
                      >
                        <span className="d-none d-md-block d-lg-none wd-0">
                          <img src={agenda} alt="" />
                        </span>
                        <span
                          className="d-block d-md-none d-lg-block wd-80 p-0 m-0"
                          data-bs-toggle="collapse"
                          data-bs-target="#sidebarMenu.show"
                        >
                          {data.display_name}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
              <ul className="nav flex-column w-100 position-absolute1 bottom-0 mb-2">
                <li className="nav-item my-1 px-2">
                  <span
                    className="btn nav-link border-0 py-0 btn-danger text-start pt-1"
                    onClick={deconnect}
                  >
                    Se déconnecter
                  </span>
                </li>
              </ul>
            </div>
          </nav>

          <main className="col-md-11 ms-sm-auto col-lg-10 px-md-4 h-90 text-small bg-primary-light1">
            <div className="sticky-top my-4">
              <Retour />
            </div>
            <Routes>
              <Route path="/" element={<> Accueil</>} />
              <Route path="/classes" element={<Classe />} />
              <Route path="/matieres" element={<Matiere />} />
              <Route
                path="/matieres-d-une-classe"
                element={<MatiereClasse />}
              />
              <Route path="/chapitres" element={<Chapitre />} />
              <Route path="/lecons/*" element={<Lecon />} />
              <Route path="/cours/*" element={<Cours />} />
              <Route path="/evaluations/*" element={<Evaluation />} />
              <Route path="/cours-en-ligne" element={<CoursEnLigne />} />
              <Route path="/periodes" element={<Periode />} />
              <Route path="/eleves/*" element={<Eleve />} />
              <Route path="/enseignants/*" element={<Enseignant />} />
              <Route path="/parents" element={<Parent />} />
              <Route path="/u-admin" element={<UAdmin />} />
              <Route path="/user-compte" element={<MonCompte />} />
              <Route path="/parametres" element={<Parametre />} />
              <Route path="/utilisateurs" element={<DroitAcces />} />
              <Route
                path="/groupe-droits-utilisateur/:slug"
                element={<GroupeDroitUtilisateur />}
              />
              <Route path="/groupes-utilisateurs/*" element={<Role />} />
              <Route path="/droits-access" element={<Permission />} />
              <Route path="/parametre" element={<>Paramètres</>} />
            </Routes>
          </main>
          <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body-tertiary">
            <div className="text-small d-inline-block my-4 me-4">
              Copyright © 2024 ENUMERA
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
