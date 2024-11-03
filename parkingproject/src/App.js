import React from "react";  
import Profile from "./Pages/User/Profile";
import Footer from "./Components/Footer/Footer";
import History from "./Pages/User/History/History";
import AdminAfterLogin from "./Pages/Admin/AdminAfterLogin";
import Deactive from "./Pages/Admin/Deactive";
import Create from "./Pages/Admin/Create";
import DriveOut from "./Pages/User/DriveOut";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import BeforeLoginUser from "./Pages/User/BeforeLoginUser";
import AfterLoginUser from "./Pages/User/AfterLoginUser";
function App() {
  return (
    <div>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<BeforeLoginUser />}/>
          
    <Route path="User" element={<AfterLoginUser />} />
    <Route path="driveOut" element={<DriveOut />} />
    <Route path="history" element={<History />} />
    <Route path="profile" element={<Profile />} />
    <Route path="Admin" element={<AdminAfterLogin />} />
    <Route path="create" element={<Create />} />
    <Route path="deactive" element={<Deactive/>} />
    
    {/* <Route path="earnings" element={<Earnings />} />
    <Route path="about" element={<About/>} /> */}


    </Routes>
    
    
    
    </BrowserRouter>
     
      <Footer/>
    </div>
  );
}

export default App;
