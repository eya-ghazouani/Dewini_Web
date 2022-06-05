import React, {useState , useEffect} from 'react';
import axios from 'axios';

import { FiUsers } from 'react-icons/fi';
import { FaHandHoldingMedical, FaPills } from 'react-icons/fa';
import { RiHandHeartLine } from 'react-icons/ri';
import { BsBasket } from 'react-icons/bs';

import Linechart from '../Components/Linechart';
import Maps from '../Components/Maps';


const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 5,
    medics: 3,
    paramedics: 1,
    reservs: 1
  });
  const [lines, setLines] = useState([]);

  const fetchData = async () => {
    const cards = await axios.get(`http://localhost:4000/stats`);
    if (cards.data.success ){
      setStats(cards.data.data);
    }
   
    const lines = await axios.get(`http://localhost:4000/stats/line`);
    if (lines.data.success ){
      setLines(lines.data.data);
    }

  }

  useEffect(() => {    
    fetchData();
  }, [])
  

  return (
    <div className='w-full h-full p-8'>
      <div className="w-full grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      
      <div className="w-full p-4 bg-white shadow-xl rounded-lg ">
        <p className="text-xl font-bold text-gray-600">Les utilisateurs</p>
        <div className="w-full flex flex-row justify-between mt-4 px-4 ">
          <p className="text-xl font-bold text-gray-600">{stats.users}</p>
          <FiUsers className='text-gray-600' size={35} />
        </div>

      </div>
      
      
      <div className="w-full p-4 bg-white shadow-xl rounded-lg ">
        <p className="text-xl font-bold text-gray-600">Les dons</p>
        <div className="w-full flex flex-row justify-between mt-4 px-4 ">
          <p className="text-xl font-bold text-gray-600">35</p>
          <RiHandHeartLine className='text-gray-600' size={35} />
        </div>

      </div>
      
      
      <div className="w-full p-4 bg-white shadow-xl rounded-lg ">
        <p className="text-xl font-bold text-gray-600">Les reservations</p>
        <div className="w-full flex flex-row justify-between mt-4 px-4 ">
          <p className="text-xl font-bold text-gray-600">{stats.reservs}</p>
          <BsBasket className='text-gray-600' size={35} />
        </div>

      </div>
      
      
      <div className="w-full p-4 bg-white shadow-xl rounded-lg ">
        <p className="text-xl font-bold text-gray-600">Les medicaments</p>
        <div className="w-full flex flex-row justify-between mt-4 px-4 ">
          <p className="text-xl font-bold text-gray-600">{stats.medics}</p>
          <FaPills className='text-gray-600'  size={35} />
        </div>

      </div>
      
      
      <div className="w-full p-4 bg-white shadow-xl rounded-lg ">
        <p className="text-xl font-bold text-gray-600">Les paramedicals</p>
        <div className="w-full flex flex-row justify-between mt-4 px-4 ">
          <p className="text-xl font-bold text-gray-600">{stats.paramedics}</p>
          <FaPills className='text-gray-600'  size={35} />
        </div>

      </div>
      
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="w-full h-full rounded-lg shadow-xl bg-white p-4">
          <Maps />
        </div>
        <div className="w-full h-96 rounded-lg shadow-xl bg-white p-4">
          <Linechart lines={lines} />
        </div>
      </div>

    </div>
  )
}

export default Dashboard