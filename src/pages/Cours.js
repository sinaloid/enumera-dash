import { Route, Routes } from "react-router-dom"
import CoursListe from "./cours/CoursListe"
import CoursForm from "./cours/CoursForm"


const Cours = () => {

    return <>
    <Routes>
        <Route path="/" element={<CoursListe />} />
        <Route path="/cours-form" element={<CoursForm />} />
    </Routes>
    </>

}

export default Cours