import React, { useEffect, useRef, useState } from 'react';

import Modal from 'react-modal';
import swal from 'sweetalert';
import axios from 'axios'; 

import { useNavigate, } from 'react-router-dom';
import { path } from '../../utils/constants';
import { ImBarcode } from 'react-icons/im';
import { BiSearchAlt2 } from 'react-icons/bi';
import { TiMinus } from 'react-icons/ti';
import { IoEyedropSharp } from 'react-icons/io5';
import { RiMedicineBottleLine } from 'react-icons/ri';
import { BsPlusLg } from 'react-icons/bs';
import { FaBarcoden, FaPills } from 'react-icons/fa';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '45vw',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
  },
};




const Donations = () => {

    Modal.setAppElement('#root');
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [medics, setMedics] = useState([]);
    const [filterData, setfilterData] = useState([]);
    const [masterData, setmasterData] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [qte, setQte] = useState(1);
    const [id, setId] = useState('');
    //image related
    const [File, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();
    let subtitle;

    
    const GetAllUser = async () => {

        const response = await axios.get(`${path}user`);
        // console.log(response.data);
        if (response.data.success === true){
            setUsers(response.data.data);
            // return <div className="w-full flex flex-row items-center justify-center">
            //             <p className=' text-gray-900 font-semibold text-lg'>{response.data.data.nom} {response.data.data.prenom} </p>                  
            //         </div>
        } 
    
    }

    useEffect(() => {
      if (!File) {
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
  
      fileReader.readAsDataURL(File);
    }, [File]);

    const fetchdata = async () => {
        const response = await axios.get(`${path}produit/donations`);
        // console.log(response.data);
        setfilterData(response.data.data);
        setmasterData(response.data.data);
    }

    useEffect(() => {
        // window.location.reload();
        GetAllUser();
        fetchdata();
        // console.log(medics);
    }, []);

    function openModal() {
      setIsOpen(true);
    }
    
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      subtitle.style.color = '#f00';
    }
    
    function closeModal() {
      setIsOpen(false);
      setQte(1);
      setImage(null);
      setId('');
      setFile(null);
      setPreviewUrl(null);
      setIsValid(false);

    }

    const update = (item) => {

        setImage(item.ord_image);
        setQte(item.qte);
        setId(item._id);
   
        openModal();
    }
  
    


    const searchFilter = (text) => {
      if(text) {
        const NewData = masterData.filter((item) => {
            const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setfilterData(NewData);
        setSearch(text);
      } else {
        setfilterData(masterData);
        setSearch(text);
      }
    }

    const pickedHandler = (event) => {
      let pickedFile;
      let fileIsValid = isValid;
      if (event.target.files && event.target.files.length === 1) {
        pickedFile = event.target.files[0];
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid = true;
      } else {
        setIsValid(false);
        fileIsValid = false;
      }
      /* props.onInput(props.id, pickedFile, fileIsValid); */
    };

      
    const submit = async (status, id) => {

        
             
      let url = `http://localhost:4000/produit/donation/${id}`;
      let result = await axios.patch(url, {status: status});
      
      console.log(result);

      if (result.data.success === true) {
        swal(
          "Success!",
          result.data.message,
          "success"
        );
        fetchdata();
        GetAllUser();
        closeModal();
      } else {
        swal(
          "Error!",
          result.data.message,
          "error"
        );
      }
    }
  

  return (
    <div className='w-full'>
    
      <div className="w-full px-5 mt-5">
        <div className='w-full p-2 flex flex-rox bg-white shadow justify-between rounded'>
          <div className="w-1/3"></div>

          <div className="flex flex-row w-2/3 items-center justify-end">
            <div className="flex flex-row w-2/5 items-center mr-4">
              <input 
                placeholder='Search..'
                className='w-full appearance-none block px-2 py-1 bg-gray-200 text-gray-700 border rounded focus:outline-none focus:bg-white focus:border-gray-500'
                onChange={(e) => searchFilter(e.target.value)}
              />

              <BiSearchAlt2 className='text-slate-500 cursor-pointer ' style={{marginLeft: '-20px'}} />
            </div>

          </div>
        </div>
      </div>

      
      <div className="w-fll grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-5 pb-5 mx-5">
        {filterData.map(({_id, title, type, category, deadline, qte, image, userid}, idx) => {
            let user  = users.find(({_id}) => _id === userid);

            return (
                <div key={idx} className=" rounded bg-white shadow p-2">
                  <div className="w-full flex justify-center">
                      <img
                          src={`http://localhost:4000/uploads/images/${image}`}
                          className='w-auto h-48 rounded  '
                          alt='User avatar'
                      />
                  </div>
                  <div className="w-full flex flex-row justify-between my-1">
                      <p className='text-xl font-bold '>{title}</p>
                      <p className='ml-2 text-sm  '>{qte}</p>
                  </div>

                  <div className="w-full flex flex-row items-center my-1">
                      <p className='ml-2 text-sm  '>{type}</p>

                  </div>
                  <div className="w-full flex flex-row flex-wrap justify-between items-center my-1">
                      <p className='ml-2 text-sm  '>{category}</p>

                  </div>
                  <div className="w-full flex flex-row justify-end mb-1">
                      <p className='ml-2 text-sm text-red-800 '>{deadline}</p>

                  </div>

                  <div className="w-full px-2 py-1">
                      <div className="w-full border bg-gray-300" />
                  </div>

                  <div className="w-full flex flex-row mt-1">
                      <div className="w-1/2 flex justify-center">
                          <button 
                              className="relative w-fit inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                              onClick={() => swal("Are u sure to accept this Donation ?")
                              .then((value) => {
                                  if(value === true) {
                                      submit(1, _id);
                                  }
                              })
                            }
                          >
                              <span className="relative  px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
                                  Accept
                              </span>
                          </button>
                      </div>
                      <div className="w-1/2 flex justify-center ">
                      

                          <button 
                              className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-red-300 via-red-400 to-pink-500 group-hover:from-red-300 group-hover:via-red-400 group-hover:to-pink-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-500 hover:text-white "
                              // onClick={() => delete_medic(_id)}
                              onClick={() => swal("Are u sure to Refuse this Donation ?")
                              .then((value) => {
                                  if(value === true) {
                                      submit(2, _id);
                                  }
                              })
                            }
                          >
                              <span 
                                  className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900  group-hover:bg-opacity-0"
                                  
                              >
                                  Refuse
                              </span>
                          </button>
                      </div>
                  </div>


              </div>
            )
        })}
      </div>
            
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="w-full h-full overflow-auto">
          <form onSubmit={submit} >
            {previewUrl ?

                <div className="w-full flex justify-center mb-5">

                  <img 
                    src={previewUrl}
                    // src={`https://i.pinimg.com/564x/22/7d/73/227d73d1ca2d45a6b4f196dc916b54a3.jpg`}
                    className='rounded w-1/3 '
                  />
                </div>
            : 
              <>
                {image ?
                  <div className="w-full flex justify-center mb-5">

                    <img 
                      // src={previewUrl}
                      src={`http://localhost:4000/uploads/images/${image}`}
                      className='rounded w-1/3 '
                    />
                  </div> 
                : null }
              </> 
            }
            
            
            



             <div className="grid gap-6  mb-6  lg:grid-cols-2">
              <div className="w-fulll">
                  
                <input 
                    id='fileupload'
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600  dark:placeholder-gray-400" 
                  aria-describedby="user_avatar_help" 
                  type="file" 
                  accept=".jpg,.png,.jpeg"
                  ref={filePickerRef}
                  onChange={pickedHandler}
                  // onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                  // onChange={(e) => setImage(e.target.files[0])}
                />
                <label className='text-red-600 text-xs' htmlFor="fileupload">L'ordonnance c'est obligatoire pour la reservation</label>
              </div>

              <div className='w-full flex flex-row justify-evenly'>
                <div 
                  className=' rounded-lg border flex justify-center items-center cursor-pointer hover:shadow px-4 w-fit'
                  onClick={()=> setQte(qte - 1)}
                >
                  <TiMinus className='text-gray-600 m-0' size={20} />
                </div>
                <input 
                  type="number" 
                  id="qte" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-blue-500" 
                  // placeholder="Nom"
                  name='qte' 
                  value={qte}
                  onChange={(e) => setQte(e.target.value)}
                    
                />
                <div 
                  className=' rounded-lg border flex justify-center items-center cursor-pointer hover:shadow px-4 w-fit'
                  onClick={()=> setQte(qte + 1)}
                >
                  <BsPlusLg className='text-gray-600' size={20} />
                </div>
                
              </div>

            </div>

            <button 
              className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
              type='submit'
            >
              <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded group-hover:bg-opacity-0">
                Submit
              </span>
            </button>
          </form>
        </div>
      </Modal>
      
      
    </div>
  )
}

export default Donations