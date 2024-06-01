import React, { useState } from "react";
import edit from "../assets/images/icons/edit.png";
import PageHeader from "../Components/PageHeader";
import Table from "../Components/Table";
import TableContent from "../Components/TableContent";
import TableHeader from "../Components/TableHeader";

const Eleve = () => {
  const [datas, setDatas] = useState([]);
  return (
    <>
      <PageHeader title="Liste des élèves" />
      <Table>
        <TableHeader>
          <th scope="col" className="border-raduis-left">
            #
          </th>
          <th scope="col">Nº matricule</th>
          <th scope="col">Nom</th>
          <th scope="col">Prenom</th>
          <th scope="col">email</th>
          <th scope="col" className="text-center">Etat</th>
          <th scope="col" className="text-center">
            Actions
          </th>
        </TableHeader>
        <TableContent>
          {datas.map((data, idx) => {
            return (
              <tr key={idx}>
                <td>
                  <input type="checkbox" value="selected" />
                </td>
                <td>PX-001</td>
                <td>12/02/2023</td>
                <td>
                  
                  <div className="d-inline-block align-middle">
                    <span className="fw-bold">Traore Moussa</span> <br />
                    <span className="fs-14">+226 xx xx xx xx</span> <br />
                    <span className="fs-14">moussa@gmail.com</span>
                  </div>
                </td>
                <td>1000 FCFA</td>
                <td className="text-center">
                  {
                    (data%2 === 0 ) ? <span className="btn-sm btn-primary-light fw-bold rounded-2">Livré</span> : 
                    (data%3 === 0) ? <span className="btn-sm btn-warning fw-bold rounded-2">En attente</span> :
                    (data%4 === 0 || data===4) ? <span className="btn-sm btn-danger fw-bold rounded-2">Annuler la commande</span> :
                    (data%5 === 0 || data===5) ? <span className="btn-sm btn-danger-2 fw-bold rounded-2">Non livré</span> :
                    (data%6 === 0 || data===6) ? <span className="btn-sm btn-danger fw-bold rounded-2">Demander un remboursement</span> :
                    <span className="btn-sm btn-warning fw-bold rounded-2">En attente</span>
                  }
                </td>
                <td className="text-center">
                  <div className="btn-group">
                    <div className="d-inline-block mx-1">
                      <button className="btn btn-gray">
                        <img src={edit} alt="" />
                        <span> Voir</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button className="btn btn-primary-light">
                        <img src={edit} alt="" />
                        <span> Modifier</span>
                      </button>
                    </div>
                    <div className="d-inline-block mx-1">
                      <button className="btn btn-danger">
                        <img src={edit} alt="" />
                        <span> Supprimer</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </TableContent>
      </Table>
    </>
  );
};

export default Eleve;
