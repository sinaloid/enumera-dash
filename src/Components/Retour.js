import { useNavigate } from "react-router-dom";

const Retour = () => {
  const navigate = useNavigate();

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  return (
    <>
      <button
        className="ms-auto btn-sm btn-primary text-white rounded px-2"
        onClick={goBack}
      >
        Retour
      </button>
    </>
  );
};

export default Retour;
