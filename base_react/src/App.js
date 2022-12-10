import { Routes, Route,  Navigate } from 'react-router-dom';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Forgot from './pages/forgot';
import NavBar from './components/NavBar/NavBar';
import {io} from "socket.io-client";
import React from 'react';

function App() {

  const [socket,setSocket] = React.useState(null)

  React.useEffect(() => {
    setSocket(io('http://localhost:5000')) //here goes your socket io domain, here you initialize the socket, may be a good practice do this when the user is logged in
    //and store this socket variable on the reducer so you can acces it from all the proyect
  },[])

  React.useEffect(() => {
    socket?.on('logged',(msg) => console.log(msg))
  },[socket])

  return (
    <div className="App">
      <NavBar socket={socket} />
      <Routes>
        <Route path = "/" element ={<Navigate to = "/signup"/>} />
        <Route path = "/forgot" element = {<Forgot/>} />
        <Route path = "/signin" element = {<SignIn/>} />
        <Route path = "/signup" element = {<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
