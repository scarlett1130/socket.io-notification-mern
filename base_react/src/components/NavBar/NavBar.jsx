import React from 'react';
import './NavBar.css'
import { Badge,ClickAwayListener, IconButton } from '@material-ui/core';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import PopUps from './PopUps';


export default function NavBar ({socket}){

  const [popUps,setPopUps] = React.useState ([])  
  const [notificacions,setNotifications] = React.useState(0)
  const [popUpsEnabled,setPopUpsEnabled] = React.useState(false)


  const DshowPopUps = () => {
    if(notificacions > 0){
      const seen = popUps.map(popUp => popUp.notificationId)
      if(seen)
         socket?.emit("seen", ({elementos:seen,userId:1}));
    }
    setNotifications(0)
    setPopUpsEnabled(false);
  };


  const showPopUps = () => {
    setPopUpsEnabled(!popUpsEnabled);
    if(notificacions > 0){
      const seen = popUps.map(popUp => popUp.notificationId)
      if(seen){
        socket?.emit("seen", ({elementos:seen,userId:1}));
      }
    }
    
    setNotifications(0);
    
  };

  React.useEffect(()=>{


    socket?.on('sendNotifications',notifications => {
      let popAUx = popUps
      let auxViewed = 0

      let popIds = popUps.map(popUp => popUp.notificationId)

      notifications.filter(notification => !popIds.includes(notification._id)).forEach( notification => {
      popAUx.push({id:notification.receiverId,notificationId:notification._id,msg:' has connected',seen:notification.viewed,created:notification.createdDate});})
      
      notifications.forEach( notification =>{
        if(!notification.viewed)
          auxViewed += 1;
      } )

      setPopUps(popAUx.sort((pop1,pop2) => pop1.created > pop2.created ? -1 : 1))
      setNotifications(auxViewed)
    })

    socket?.on('refreshSeen', () => {
      setNotifications(0)
    })

  },[socket])

  return(

    <nav className='nav'>
      <h2>Example Nav</h2>
      <ClickAwayListener onClickAway={() => DshowPopUps}>
            <div>
              <IconButton onClick={showPopUps}>
                <Badge overlap = 'rectangular' badgeContent={notificacions} color="primary">
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