import React, { useEffect, useRef, useState } from 'react';

import Modal from 'react-modal';
import swal from 'sweetalert';
import axios from 'axios'; 

import { useNavigate } from 'react-router-dom';
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

const Categories = () => {

    Modal.setAppElement('#root');
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterData, setfilterData] = useState([]);
    const [masterData, setmasterData] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    const [nom, setNom] = useState('');
    const [image, setImage] = useState(null);
    const [id, setId] = useState('');
    const [action, setAction] = useState('add');

    //image related
    const [File, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const [isNomWrong, setIsNomWrong] = useState(false);

    const filePickerRef = useRef();
    let subtitle;

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
        const response = await axios.get(`${path}categorie/`);
        // console.log(response.status);
        setfilterData(response.data.data);
        setmasterData(response.data.data);
    }

    useEffect(() => {
     fetchdata();
    //  console.log(filterData);
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
      
      setNom('');
      setImage(null);
      setId('');
      setFile(null);
      setPreviewUrl(null);
      setIsValid(false);
      setAction('add');
    }
  
    const onchange = (e) => {
      if(e.target.name === 'nom'){
        setNom(e.target.value);
        if(e.target.value.length < 3) {
          setIsNomWrong(true);
      } else {
          setIsNomWrong(false);
      }
      }
  
    }
    
    const update = (item) => {
      console.log('====================================');
      console.log(item);
      console.log('====================================');
      setNom(item.nom);
      setImage(item.image);
      setId(item._id);
      setAction('update');
  
      openModal();
    }

    const searchFilter = (text) => {
      if(text) {
        const NewData = masterData.filter((item) => {
            const itemData = item.nom ? item.nom.toUpperCase() : ''.toUpperCase();
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
      
    const submit = async (e) => {
      e.preventDefault();
        
             
      const formData = new FormData();
      if(File) {
        // formData.append("image", previewUrl);
        formData.append("image", File);
      } 
      if(isNomWrong){
        swal(
            "Erreur!",
            'Le nom doit etre supérieur à 3 caractères ',
            "error"
          );
          // alert('data isnt vali');
          return;
    }else{
      formData.append('nom', nom);
    }
      let options, url, result;
      if(action === 'add') {
        url = `http://localhost:4000/categorie/add`;

        result = await axios.post(url, formData);

      } else {
        url = `http://localhost:4000/categorie/${id}`;

        result = await axios.patch(url, formData);
      }
    //   console.log(result );
      // const response = await fetch(url, options );
  
      // let result = await response.json();
      // console.log(result);
      if (result.data.success === true) {
        swal(
          "Succés!",
          result.data.message,
          "success"
        );
        fetchdata();
        closeModal();
      } else {
        swal(
          "Error!",
          result.data.message,
          "error"
        );
      }
    }
  
    const delete_medic = async (id) => {
      let url, options;
      url = `http://localhost:4000/categorie/${id}`;
      options = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        }
      }
      const response = await fetch(url, options );
  
      let result = await response.json();
      console.log(result);
      if (result.success === true) {
        swal(
          "Success!",
          result.message,
          "success"
        );
        fetchdata(); 
      } else {
        swal(
          "Error!",
          result.message,
          "error"
        );
      }
  
    }

  return (
    <div className='w-full pt-6'>
    
    <div className="w-full px-4 ">
      <div className="w-full rounded bg-white shadow flex flex-row justify-between py-2 px-4">
          <div className="flex flex-row">
              <p  className='text-lg font-semibold cursor-pointer mr-1' >Home  </p><p className='text-lg' >/ Categories</p>
          </div>
          <div className='flex flex-row items-center'>
              <div className=" relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input type="search" className="pl-10 w-full appearance-none block px-2 py-1 bg-gray-200 text-gray-700 border rounded focus:outline-none focus:bg-white focus:border-gray-500" placeholder="Chercher" 
                  onChange={(e) => searchFilter(e.target.value)}
                  />
              
              </div>
              <button className="relative inline-flex items-center justify-center p-0.5  ml-10 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
              onClick={openModal}
              >
                  <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Ajouter Catégorie
                  </span>
              </button>
          </div>
      </div>
    </div>

      
    <div className="w-fll grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 pb-5 mx-5">
      {filterData.slice(0).reverse().map(({_id, nom, image}, idx) => {

          return (
              <div key={idx} className=" rounded bg-white shadow p-2">
                  <div className="w-full flex justify-center">
                      <img
                          src={`http://localhost:4000/uploads/images/${image}`}
                          className='w-auto h-48 rounded  '
                          alt={nom}
                      />
                  </div>
                  <div className="w-full flex flex-row justify-center my-1">
                      <p className='text-xl font-semibold '>{nom}</p>
                  </div>

                  <div className="w-full px-2 py-1">
                      <div className="w-full border bg-gray-300" />
                  </div>

                  <div className="w-full flex flex-row mt-1">
                      <div className="w-1/2 flex justify-center">
                          <button 
                              className="relative w-fit inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-md group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 p-0.5"
                              onClick={() => update({_id, nom, image})}
                          >
                              <span className="relative  px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0 rounded-md">
                                  Modifier
                              </span>
                          </button>
                      </div>
                      <div className="w-1/2 flex justify-center ">
                      

                          <button 
                              className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-md group bg-gradient-to-br from-red-300 via-red-400 to-pink-500 group-hover:from-red-300 group-hover:via-red-400 group-hover:to-pink-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-500 hover:text-white p-0.5"
                              // onClick={() => delete_medic(_id)}
                              onClick={async() => {swal({
                                  title: "Vous etes sur?",
                                  text: "Une fois supprimé vous ne pouvez plus récupérer cette catégorie !",
                                  icon: "warning",
                                  buttons: true,
                                  dangerMode: true,
                              })
                              .then(async (willDelete) => {
                                  if (willDelete) {
                      
                                      delete_medic(_id);
                                  } else {
                                  swal("Categorie enregistrée!");
                                  }
                              });
                              
                              }}
                          >
                              <span 
                                  className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md  group-hover:bg-opacity-0"
                                  
                              >
                                  Supprimer
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
                        
            
                <div className="grid gap-6 mb-6 lg:grid-cols-2 items-end">

                    <div className="w-full flex flex-row justify-between items-end">

                        {previewUrl ?

                            <div className="w-1/3 mb-5">
                                <img 
                                    src={previewUrl}
                                    // src={`https://i.pinimg.com/564x/22/7d/73/227d73d1ca2d45a6b4f196dc916b54a3.jpg`}
                                    className='rounded w-full h-auto'
                                    alt='categorie pic'
                                />
                            </div>
                        : image ?
                            <div className="w-1/3  mb-5">
                                <img 
                                    // src={previewUrl}
                                    src={`http://localhost:4000/uploads/images/${image}`}
                                    className='rounded w-full h-auto'
                                    alt='categorie pic'
                                />
                            </div> 
                        : null }

                        <div className={`${previewUrl || image ? 'w-2/3 ' : 'w-full'} transition-all duration-700`}>
                            <input 
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600  dark:placeholder-gray-400" 
                                aria-describedby="user_avatar_help" 
                                type="file" 
                                accept=".jpg,.png,.jpeg"
                                ref={filePickerRef}
                                onChange={pickedHandler}
                            />
                        </div>
                    </div>
                    <div>
                        
                        <input 
                            type="text" 
                            id="nom" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Nom de categorie "
                            name='nom' 
                            value={nom}
                            onChange={(e) => onchange(e)}
                            required  
                        />
                        {isNomWrong ?
                            <small className=" text-red-600 m-0 p-0" style={{fontSize: 12}}>Le nom doit etre supérieur à 3 caractères</small>
                        : null }
                    </div>
                </div>

                <button 
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    type='submit'
                >
                    <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded group-hover:bg-opacity-0">
                Enregistrer
                    </span>
                </button>
            </form>
        </div>
    </Modal>
      
      
    </div>
  )
}

export default Categories