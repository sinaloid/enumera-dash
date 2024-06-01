import React from "react";
import profile from "../assets/imgs/profile.png";
import del from "../assets/imgs/delete.png";


const Settings = () => {
  return (
    <>
      <div className="row">
        <h1 className="h2">Paramètres de mon compte</h1>
      </div>
      <div className="row my-4">
        <div className="col-12 col-md-5 col-lg-4">
          <img width="100%" src={profile} alt="" />
          <div className="my-3">
            <button className="btn btn-primary me-2 w-75" data-bs-dismiss="modal">
              Modifier la photo
            </button>
            <img src={del} alt="" />
          </div>
          <div className="border border-1 p-4 mt-4">
            <p className="text-16 text-bold">Autres actions</p>
            <button
              className="btn border border-1 my-2 w-100"
              data-bs-dismiss="modal"
            >
              Modification du mot de passe
            </button>
            <button
              className="btn border border-1 my-2 w-100"
              data-bs-dismiss="modal"
            >
              Aide et support
            </button>
            <button
              className="btn border border-1 my-2 w-100"
              data-bs-dismiss="modal"
            >
              Conditions d’utilisation
            </button>
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-6 mx-auto border border-1 p-4">
          <p className="text-16 text-bold">Mes informations personnelles</p>
          <form className="w-100" action="">
            <div className="mb-3 mt-3">
              <label htmlFor="lname" className="form-label">
                Nom
              </label>
              <input
                type="text"
                className="form-control"
                id="lname"
                placeholder="Entrer le nom de famille de l’employé(e)"
                name="lname"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fname" className="form-label">
                Prénom(s)
              </label>
              <input
                type="name"
                className="form-control"
                id="fname"
                placeholder="Entrer le ou les prenom(s) de l’employé(e)"
                name="fname"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fname" className="form-label">
                Date de naissance
              </label>
              <input
                type="name"
                className="form-control"
                id="fname"
                placeholder="Entrer la date de naissance"
                name="fname"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fname" className="form-label">
                Numéro CNI
              </label>
              <input
                type="name"
                className="form-control"
                id="fname"
                placeholder="Entrer le numéro CNI"
                name="fname"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fname" className="form-label">
                Email
              </label>
              <input
                type="name"
                className="form-control"
                id="fname"
                placeholder="Entrer l’adresse mail"
                name="fname"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fname" className="form-label">
                Telephone
              </label>
              <input
                type="name"
                className="form-control"
                id="fname"
                placeholder="Entrer le numero de téléphone"
                name="fname"
              />
            </div>
            
            <div className="d-flex justify-content-start border-0">
              <button
                type="reset"
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Effacer
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
