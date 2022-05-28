import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

import {FaRegEnvelope} from'react-icons/fa'
import {MdLockOutline} from'react-icons/md'

const Login = () => {

  const navigate = useNavigate();
  const cookies = new Cookies();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    let url = `http://localhost:4000/user/login/`;
    let result = await axios.post(url, {email: email, password: pass});
    
    console.log(result);

    if (result.data.success === true) {
      swal(
        "Success!",
        result.data.message,
        "success"
      );
      let json = JSON.stringify(result.data.data);
      cookies.set('user', json );
      setEmail('');
      setPass('');
      navigate('/');
      
    } else {
      swal(
        "Error!",
        result.data.message,
        "error"
      );
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100'>
      <head>
        <title>Login</title>
      </head>
      <main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
         <div className='bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl'>
              <div className='w-3/5 p-5'>
                <div className='text-left font-bold'>
                  <span className='text-green-500'> Dewi</span>ni
                </div>
                <div className='py-10'>
                <h2 className='text-3xl font-bold text-green-500 mb-2'>Connectez-vous </h2>
                <div className='border-2 w-10 border-green-500 inline-block mb-2'></div>
                  <p className='text-gray-400 my-3'>Votre email compte</p>
                <div className='flex flex-col items-center '>
                  <form onSubmit={submit}>
                    <div className='bg-gray-100 w-64 p-2 flex items-center mb-3'>
                      <FaRegEnvelope className='text-gray-400 m-2'/>
                      <input 
                        type='email' 
                        name='email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder='Votre email' 
                        className='bg-gray-100 outline-none text-sm flex-1 '
                      />
                    </div>
                    <div className='bg-gray-100 w-64 p-2 flex items-center mb-3'>
                      <MdLockOutline className='text-gray-400 m-2'/>
                      <input 
                        type='password' 
                        name='password' 
                        value={pass}
                        onChange={(e) => setPass(e.target.value)} 
                        placeholder='Votre mot de passe' 
                        className='bg-gray-100 outline-none text-sm flex-1 '
                      />
                    </div>
                    <button type='submit' className='border-2 mt-7 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white'>
                      Connexion
                    </button>
                  </form>
                </div>
              </div>
              </div>
              <div className='w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12'>
                <h2 className='text-3xl font-bold mb-2'>Bienvenue...!</h2>
                <div className='border-2 w-10 border-white inline-block mb-2'></div>
                <p className='mb-8'>Remplissez vos informations personnelles et commencez à nous suivre...</p>
                <a href="#" className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500'>S'inscrire</a>
              </div>
          </div>
      </main>
    </div>
  );
}

export default Login;