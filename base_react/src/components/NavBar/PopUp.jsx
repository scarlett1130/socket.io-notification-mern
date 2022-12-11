import React from 'react'
import style from './PopUp.module.css'
import { Link } from 'react-router-dom'
import { Avatar } from '@mui/material'

function PopUp({img,name,description,seen}) {


  return (
    
      
      <Link to ={'#'} className={style.link}>
      <div className={style.popUp} style={seen ? {} : {backgroundColor:'#B0BEF7'}} >
        <div className={style.img}>
          <Avatar
          alt={name} 
          src ={img}
          sx={{ width: "8vh", height: "8vh" }}
          />
        </div>
        <div className={style.right}>
          <p><b>{name}</b> {description}</p>
        </div>
        </div>
      </Link>
    
  )
}

export default PopUp