import { Routes, Route,  Navigate } from 'react-router-dom';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Forgot from './pages/forgot';
import NavBar from './components/NavBar/NavBar';
import { io } from 'socket.io-client';
import React from 'react';
import { useDispatch,useSelector } from 'react-redux';

function App() {


  const logged = useSelector(state => state.authState.loggedIn)
  const userId = useSelector(state => state.authState.userId)
  const [socket,setSocket] = React.useState(null)
  

  React.useEffect(() => {
    
    if(logged){
      const socketAux = io('http://localhost:5000')
      setSocket(socketAux)
      socketAux.emit('addUser',(userId))
      socketAux.on('newNotification',() => {
        socketAux.emit('getNotifications',(userId))
      })
    }
  },[logged])

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
