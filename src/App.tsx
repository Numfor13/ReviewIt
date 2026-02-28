import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import VendorProfile from "./pages/VendorProfile";
import ReviewerLogin from "./pages/authentication/ReviewerLogin";
import ReviewerSignUp from "./pages/authentication/ReviewerSignUp";
import VendorSignUp from "./pages/authentication/VendorSignUp";
import VendorLogin from "./pages/authentication/VendorLogin";
import Dashboard from "./pages/Dashboard";

import { ChatProvider } from "./context/ChatContext";
import SideChat from "./pages/SideChat";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChatProvider>
      <Router>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Vendor Profile Page */}
          <Route
            path="/vendor/:phoneNumber"
            element={<VendorProfile />}
          />
          <Route path="/reviewer/signup" element={<ReviewerSignUp />} />
          <Route path="/reviewer/login" element= {<ReviewerLogin />} />
          <Route
            path="/vendor/signup" element= {<VendorSignUp/>} 
          />
          <Route
            path="/vendor/login" element= {<VendorLogin/>} 
          />
          {/* Global Chat Page */}
          <Route path="/chat" element={
            <ChatProvider>
              {<SideChat />} 
            </ChatProvider>
          }
         />
         <Route path="/dashboard" element={<Dashboard/>}/>

        </Routes>
      </Router>
      </ChatProvider>
    </AuthProvider>
   
  );
};

export default App;
