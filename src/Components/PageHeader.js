import React from "react";
import filter from "../assets/images/icons/trie.png";
import del from "../assets/images/icons/delete.png";
import back from "../assets/images/icons/back.png";
import sui from "../assets/images/icons/next.png";

const PageHeader = ({
  title = "",
  modal = "",
  addModal = () => {},
  canCreate = false,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="">{title}</h1>
      </div>
      <div className="row my-4">
        <div className="col-12 col-md-8">
          <div className="d-flex">
            <div className="me-1">
              <button className="btn border fw-bold">
                <img src={filter} alt="" />
                <span> Filtrer</span>
              </button>
            </div>
            <div className="flex-grow-1 mx-1">
              <input
                type="text"
                className="form-control search"
                placeholder="Rechercher..."
              />
            </div>
            {canCreate && (
              <div className="btn-toolbar ms-1">
                <button
                  className="btn btn-primary fw-bold"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target={"#" + modal}
                  onClick={(e) => addModal(e)}
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="btn-group">
        <div className="d-inline-block my-1 mx-1">
          <img src={del} alt="" />
        </div>
        <div className="d-inline-block my-1 mx-1">
          <img src={back} alt="" />
        </div>
        <div className="d-inline-block my-1 mx-1">
          <img src={sui} alt="" />
        </div>
        <div className="d-inline-block my-1 pt-1 mx-1 fw-bold">
          <span className="align-middle">Page 1 / 2</span>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
