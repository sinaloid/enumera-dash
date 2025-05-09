import { Route, Routes } from "react-router-dom"
import Meet from "./meet/Meet"
import MeetParticipant from "./meet/MeetParticipant"

const CoursEnLigne = () => {
  
  return <Routes>
  <Route path="/" element={<Meet />} />
  <Route path="/:slug" element={<MeetParticipant />} />
</Routes>
 
}
export default CoursEnLigne