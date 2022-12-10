import React from 'react';
import './NavBar.css'
import { Badge,ClickAwayListener, IconButton } from '@material-ui/core';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import PopUps from './PopUps';
import { io } from "socket.io-client";


export default function NavBar ({socket}){

  const [popUps,setPopUps] = React.useState ([])  
  const [notificacions,setNotifications] = React.useState(0)
  const [popUpsEnabled,setPopUpsEnabled] = React.useState(false)


  const DshowPopUps = () => {
    setNotifications(0)
    setPopUpsEnabled(false);
  };


  const showPopUps = () => {
    setPopUpsEnabled(!popUpsEnabled);
    setNotifications(0);
    //socket.emit("seen", vistos);
  };

  React.useEffect(()=>{

    socket?.on('logged', (msg) => {
      const popAux = popUps
      popAux.push({msg})
      setPopUps(popAux)
      setNotifications(popUps.length)
    })//this is a handler

  },[socket])

  return(

    <nav className='nav'>
      <h2>Example Nav</h2>
      <ClickAwayListener onClickAway={DshowPopUps}>
            <div>
              <IconButton onClick={showPopUps}>
                <Badge badgeContent={notificacions} color="primary">
                  <NotificationsNoneTwoToneIcon
                    sx={{ color: "black" }}
                    fontSize={"medium"}
                  />
                </Badge>
              </IconButton>
              {popUpsEnabled ? <PopUps popUps={popUps} /> : <></>}
            </div>
          </ClickAwayListener>
    </nav>

  )

}