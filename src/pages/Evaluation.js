import { Route, Routes } from "react-router-dom"
import CoursListe from "./cours/CoursListe"
import CoursForm from "./cours/CoursForm"
import ListEva from "./evaluation/ListEva"
import QuestionEva from "./evaluation/QuestionEva"


const Evaluation = () => {

    return <>
    <Routes>
        <Route path="/" element={<ListEva />} />
        <Route path="/:slug/questions" element={<QuestionEva />} />
    </Routes>
    </>

}

export default Evaluation