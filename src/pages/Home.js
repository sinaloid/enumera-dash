import React from "react";
import tag from "../assets/images/tag.png";
import shopping from "../assets/images/shopping.png";
import group from "../assets/images/group.png";
import cart from "../assets/images/cart.png";
import edit from "../assets/images/icons/edit.png";
import Table from "../Components/Table";
import TableContent from "../Components/TableContent";
import TableHeader from "../Components/TableHeader";
import { ViewChart } from "../Components/ViewChart";

const Home = () => {
  return (
    <>
      <div className="row">
        <h1 className="h2">Accueil</h1>
      </div>

      <div className="row mt-5">
        <div className="col-12 mb-3">
          <div className="row row-cols-1 row-cols-sm-4">
            {[
              {name:"Fournisseurs",img:group},
              {name:"Livreurs",img:group},
              {name:"Catégories",img:tag},
              {name:"Produits",img:shopping},
              
            ].map((data, idx) => {
              return (
                <div className="col mb-5" key={idx}>
                  <div className="card btn-secondary">
                    <div className="d-flex align-items-center">
                      <div className="me-1">
                        <img width="80px" src={data.img} alt="" />
                      </div>
                      <div className="text-center">
                        <h6 className="text-16 fw-bold">{data.name}</h6>
                        <span>145</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-12 mb-5">
          <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
              <div className="border p-2">
                <p className="text-center fw-bold pt-3">Commandes en cours</p>
                <Table>
                  <TableHeader>
                    <th scope="col" className="border-raduis-left">
                      #
                    </th>
                    <th scope="col">Image</th>
                    <th scope="col">Produit</th>
                    <th scope="col" className="text-center">
                      Actions
                    </th>
                  </TableHeader>
                  <TableContent>
                    {[...Array(4).keys()].map((data, idx) => {
                      return (
                        <tr key={idx}>
                          <td>
                            <input type="checkbox" value="selected" />
                          </td>
                          <td className="fw-bold">
                            <img
                              width="40px"
                              height="40px"
                              className="rounded-circle"
                              src={`https://source.unsplash.com/random/800x600/?product=${idx}`}
                              alt=""
                            />
                          </td>
                          <td className="fw-bold">Viande</td>
                          <td className="text-center">
                            <div className="btn-group">
                              <div className="d-inline-block mx-1">
                                <button className="btn btn-primary-light">
                                  <img src={edit} alt="" />
                                  <span> Voir</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </TableContent>
                </Table>
              </div>
            </div>
            <div className="col">
              <div className="border p-2">
                <p className="text-center fw-bold pt-3">Promotions en cours</p>
                <Table>
                  <TableHeader>
                    <th scope="col" className="border-raduis-left">
                      #
                    </th>
                    <th scope="col">Image</th>
                    <th scope="col">Produit</th>
                    <th scope="col" className="text-center">
                      Actions
                    </th>
                  </TableHeader>
                  <TableContent>
                    {[...Array(4).keys()].map((data, idx) => {
                      return (
                        <tr key={idx}>
                          <td>
                            <input type="checkbox" value="selected" />
                          </td>
                          <td className="fw-bold">
                            <img
                              width="40px"
                              height="40px"
                              className="rounded-circle"
                              src={`https://source.unsplash.com/random/800x600/?product=${idx}`}
                              alt=""
                            />
                          </td>
                          <td className="fw-bold">Tomate</td>
                          <td className="text-center">
                            <div className="btn-group">
                              <div className="d-inline-block mx-1">
                                <button className="btn btn-primary-light">
                                  <img src={edit} alt="" />
                                  <span> Voir</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </TableContent>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mb-3">
        <ViewChart title="Evolution des ventes en fonction des catégories de produits" />

        </div>
      </div>
    </>
  );
};

export default Home;
