import React from 'react'
import PopUp from './PopUp';
import style from './PopUps.module.css';


function PopUps({popUps}) {

  return (
    
    <div className={style.popUps}>
      <div className={style.titulo}>
        <h3>Notifications</h3>
       
      </div>
      <hr style={{border: "2px solid rgb(209, 209, 209)", borderRadius: "5px"}}/>
      {popUps.map((e,index) =>
        <PopUp
         key = {index}
         img = {e.img} //User image
         name = {'User with id: '+e.id} //Name of user
         description = {e.msg} //A description
         ruta = {'#'} //Route to redirect
         id_mensaje = {"#"}//Database ref
         seen = {e.seen}
         />
      )}
    </div>
  )
}

export default PopUps