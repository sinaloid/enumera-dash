import { useEffect } from "react";
import Modal from "bootstrap/js/dist/modal";

const Notify = ({ showModal }) => {
  useEffect(() => {
    if (showModal) {
        var myModal = new Modal(
            document.getElementById("notifyModal"),
            {}
          );
          myModal.show();
    }
  });

  return (
    <div className="modal fade" id="notifyModal">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h4 className="modal-title text-meduim text-bold">titre</h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            <div>
                Lorem ipsum
            </div>
            <div className="d-flex justify-content-start border-0">
              <button
                type="reset"
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notify
