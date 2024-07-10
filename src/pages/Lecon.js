import { Route, Routes } from "react-router-dom";
import LeconListe from "./lecon/LeconListe";
import LeconDetail from "./lecon/LeconDetail";


const Lecon = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LeconListe />} />
        <Route path="/:slug" element={<LeconDetail />} />
      </Routes>
    </>
  );
};

export default Lecon;
