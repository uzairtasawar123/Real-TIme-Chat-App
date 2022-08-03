import logo from "./logo.svg";
import react, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation";
import Home from "./Pages/Home";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import Chat from "./Pages/Chat";
import { useSelector } from "react-redux";
import Store from "./AppContext";
import { socket } from "./AppContext";
//import { ToastContainer } from "react-toastify";
//import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  ///////////////   States   //////////////////////
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});
  /////////////////////////////////////////////////////////
  const user = useSelector((state) => state.user);
  ////////////////////////////////////////////////////////
  return (
    <div>
      {/* <ToastContainer position="bottom-center" limit={1}/> */}
      <Store.Provider
        value={{
          socket,
          currentRoom,
          setCurrentRoom,
          members,
          setMembers,
          messages,
          setMessages,
          privateMemberMsg,
          setPrivateMemberMsg,
          rooms,
          setRooms,
          newMessages,
          setNewMessages,
        }}
      >
        <Router>
          <Navigation />
          <Routes>
            <Route exact path="/" element={<Home />} />
            {!user && (
              <>
                <Route exact path="/login" element={<LogIn />} />
                <Route exact path="/signup" element={<SignUp />} />
              </>
             )} 
            <Route exact path="/chat" element={<Chat />} />
          </Routes>
        </Router>
      </Store.Provider>
    </div>
  );
}

export default App;
