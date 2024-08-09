import { Route, Routes } from "react-router-dom";
import LeconListe from "./lecon/LeconListe";
import LeconDetail from "./lecon/LeconDetail";
import Evaluation from "./lecon/Evaluation";
import Question from "./lecon/Question";


const Lecon = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LeconListe />} />
        <Route path="/:slug" element={<LeconDetail />} />
        <Route path="/:slug/evaluations" element={<Evaluation />} />
        <Route path="/:slug/evaluations/:evaluationSlug" element={<Question />} />
      </Routes>
    </>
  );
};

export default Lecon;
