import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from '../Pages/Dashboard';
import Profile from '../Pages/Profile';
import Users from '../Pages/Admin/Users';
import Medics from '../Pages/Admin/Medics';
import Login from '../Pages/Auth/Login';
import Confirm_medic from '../Pages/Admin/Confirm_medic';
import Donations from '../Pages/Admin/Donations';
import Categories from '../Pages/Admin/Categories';

const MainRoute = () => {
  return (
    <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/users' element={<Users />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/medics' element={<Medics />} />
        <Route path='/categorie' element={<Categories />} />
        <Route path='/login' element={<Login />} />
        <Route path='/confirm' element={<Confirm_medic />} />
        <Route path='/donations' element={<Donations />} />
        <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default MainRoute