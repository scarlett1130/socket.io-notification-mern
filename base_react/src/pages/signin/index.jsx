import React, {useState} from 'react';
import  { TextField, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { openSnackBar } from '../../redux/snackBarReducer';
import {loginSuccess} from '../../redux/authReducer';
import Store from '../../redux/store';


export default function Index() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const clickSingInBtn = () => {
    if (email == '' || password =='') {
      dispatch(openSnackBar({status: "warning", message: "Please fill email and password"}))
      return;
    }
    dispatch(loginSuccess({payload:'32'}));//Here you have to dispatch loginrequest instead
  }


  return (
      <div className='flex p-6 items-center justify-center text-2xl'>
            <div>
              <h1 className='text-3xl my-6 text-center' >Login Page</h1>
              <div>
                <TextField fullWidth label = "Email" id = "fullWidth" onChange={e => setEmail(e.target.value)}/>
                <TextField fullWidth label = "Password" id = "fullWidth" type = "password" onChange={e => setPassword(e.target.value)} />
              </div>
              <div className='text-sm mt-2 text-blue-300 cursor-pointer'>
                Forgot Password?
              </div>

              <div className='mt-3 justify-center flex'>
                <div className='mx-2'>
                  <Button onClick = { clickSingInBtn} variant='contained' color= "primary" >Login</Button>
                </div>
                <Link to = "/signup" className='mx-2'>
                  <Button variant='contained' color= "secondary">Go to SignUp Page</Button>
                </Link>
              </div>
            </div>
      </div>
  );
}
