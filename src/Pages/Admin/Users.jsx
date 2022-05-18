import React, { useEffect, useRef, useState } from 'react'

import { BiSearchAlt2 } from 'react-icons/bi';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';
import { BiPhone } from 'react-icons/bi';

import swal from 'sweetalert';
import Modal from 'react-modal';
import axios from 'axios';

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




const Users = () => {

    let data= [0,1,2,3,4,5,6,7,8,9];
    Modal.setAppElement('#root');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filterData, setfilterData] = useState([]);
    const [masterData, setmasterData] = useState([]);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [adresse, setAdresse] = useState('');
    const [image, setImage] = useState(null)
    const [action, setAction] = useState('add');
    const [id, setId] = useState('');

    //image related
    const [File, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

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


    // /// fitering data using seaarch input ::
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

    // handelie uploading image:::
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


    ////// opening the model:
    function openModal() {
        setIsOpen(true);
    }
  
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }
    /////// closing end empting the states::
    function closeModal() {

        setNom('');
        setPrenom('');
        setEmail('');
        setTel('');
        setAdresse('');
        setId('');
        setImage(null);
        setFile(null);
        setPreviewUrl(null);
        setIsValid(false);
        setAction('add');
        setIsOpen(false);
    }
    ///// get data from server ::
    const fetchData = async () =>{
        const result = await axios.get('http://localhost:4000/user');
        setfilterData(result.data.data);
        setmasterData(result.data.data);
    }

    ////// works first thing and activate fetching data ::
    useEffect(() => {
        fetchData();
        // console.log(filterData);
    }, [ ])
    
    ///// get data from  inputs::
    const onchange = (e) =>{

        if (e.target.name === 'nom') {
            setNom(e.target.value);
        } else if (e.target.name === 'prenom') {
            setPrenom(e.target.value);
        } else if (e.target.name === 'adresse') {
            setAdresse(e.target.value);
        } else if (e.target.name === 'tel') {
            setTel(e.target.value);
        } else if (e.target.name === 'email') {
            setEmail(e.target.value);
        }
    }

    //// fill out the state from the item to update ::
    const update_user = (item) => {
        setNom(item.nom);
        setPrenom(item.prenom);
        setEmail(item.email);
        setTel(item.tel);
        setAdresse(item.adresse);
        setId(item._id);
        setImage(item.avatar);
        setAction('update');

        setIsOpen(true);
    }

    //// update or add user :::
    const Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if(File) {
            // formData.append("image", previewUrl);
            formData.append("image", File);
        } 
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('email', email);
        formData.append('tel', tel);
        formData.append('adresse', adresse);

        let url, result;
        
        if(action === 'add'){
            url = 'http://localhost:4000/user/add';
            result = await axios.post(url, formData);
        } else {
            url = `http://localhost:4000/user/${id}`;
            result = await axios.patch(url,formData);
        }

        if (result.data.success === true) {
            swal("Success!", result.data.message, "success");
            fetchData();
            closeModal();
        } else {
            swal("Error!", result.data.message, "warning");
        }

    }

    //// delete user :::
    const delete_user = async (id) => {
        const result = await axios.delete(`http://localhost:4000/user/${id}`);
                            
        if (result.data.success === true) {
            swal("Poof! User has been deleted!", {
                icon: "success",
            });
            fetchData();
        } else {
            swal("Error!", result.data.message, "warning");
        }   
    }
  

  return (
    <div className='w-full h-full pt-6'>
        <div className="w-full px-4">
            <div className="w-full rounded bg-white shadow flex flex-row justify-between py-2 px-4">
                <div className="flex flex-row">
                    <p  className='text-lg font-semibold cursor-pointer mr-1' >Home  </p><p className='text-lg' >/ Users</p>
                </div>
                <div className='flex flex-row items-center'>
                    <div className=" relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="search" className="block p-1 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" 
                        onChange={(e) => searchFilter(e.target.value)}
                        />
                    
                    </div>
                    <button className="relative inline-flex items-center justify-center p-0.5  ml-10 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                    onClick={openModal}
                    >
                        <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Add User
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <div className="w-full px-4 pt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filterData.map(({nom, prenom, avatar, email, adresse, tel, _id}, idx) => {
                
                return (
                    <div key={idx} className=" rounded bg-white shadow p-2">
                        <div className="w-full flex justify-center">
                            <img
                                src={`http://localhost:4000/uploads/images/${avatar}`}
                                className='w-auto h-52  rounded  '
                                alt='User avatar'
                            />
                        </div>
                        <div className="w-full flex justify-center my-1">
                            <p className='text-xl font-bold '>{prenom} {nom}</p>
                        </div>
                        <div className="w-full flex flex-row items-center">
                            <MdOutlineEmail size={20} />
                            <p className='ml-2 text-lg  '>{email}</p>

                        </div>
                        <div className="w-full flex flex-row items-center">
                            <IoLocationOutline size={20} />
                            <p className='ml-2 text-lg  '>{adresse}</p>

                        </div>
                        <div className="w-full flex flex-row items-center">
                            <BiPhone size={20} />
                            <p className='ml-2 text-lg '>{tel}</p>

                        </div>

                        <div className="w-full px-2 py-1">
                            <div className="w-full border bg-gray-300" />
                        </div>

                        <div className="w-full flex flex-row mt-1">
                            <div className="w-1/2 flex justify-center">
                                <button 
                                    className="relative w-fit inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                                    onClick={() => update_user({nom, prenom, avatar, email, adresse, tel, _id})}
                                >
                                    <span className="relative  px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
                                        Update
                                    </span>
                                </button>
                            </div>
                            <div className="w-1/2 flex justify-center ">
                            {/* <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800" /> */}

                                <button 
                                    className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-red-300 via-red-400 to-pink-500 group-hover:from-red-300 group-hover:via-red-400 group-hover:to-pink-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-500 hover:text-white "
                                    // onClick={() => delete_user(_id)}
                                    onClick={async() => {swal({
                                        title: "Are you sure?",
                                        text: "Once deleted, you will not be able to recover this User!",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                      })
                                      .then(async (willDelete) => {
                                        if (willDelete) {
                            
                                            delete_user(_id);
                                        } else {
                                          swal("User is safe!");
                                        }
                                      });
                                    
                                    }}
                                >
                                    <span 
                                        className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900  group-hover:bg-opacity-0"
                                        
                                    >
                                        Delete
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
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="w-full h-full">
            <form onSubmit={Submit}>
                <div className="grid gap-3 mb-6 lg:grid-cols-2 items-end">

                    <div className="w-full flex flex-row justify-between items-end">

                    {previewUrl ?

                        <div className="w-1/3 mb-5">

                        <img 
                            src={previewUrl}
                            // src={`https://i.pinimg.com/564x/22/7d/73/227d73d1ca2d45a6b4f196dc916b54a3.jpg`}
                            className='rounded w-full h-auto'
                            alt='avatr'
                        />
                        </div>
                    : image ?
                        <div className="w-1/3  mb-5">

                            <img 
                            // src={previewUrl}
                            src={`http://localhost:4000/uploads/images/${image}`}
                            className='rounded w-full h-auto'
                             alt='avatr'
                            />
                        </div> 
                        : null 
                       
                        }

                        <div className={`${previewUrl || image ? 'w-2/3 ' : 'w-full'} transition-all duration-700`}>
                            <input 
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600  dark:placeholder-gray-400" 
                            aria-describedby="user_avatar_help" 
                            type="file" 
                            accept=".jpg,.png,.jpeg"
                            ref={filePickerRef}
                            onChange={pickedHandler}
                            // onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                            // onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                    </div>


                    <div>
                        
                        <input  
                            type="email" 
                            id="email" 
                            name='email' 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => onchange(e)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required  
                        />
                    </div>
                    
                    <div>
                        
                        <input  
                            type="text" 
                            id="nom" 
                            name='nom' 
                            placeholder="Nom" 
                            value={nom}
                            onChange={(e) => onchange(e)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required  
                        />
                    </div>
                     
                    <div>
                        
                        <input  
                            type="text" 
                            id="prenom" 
                            name='prenom' 
                            placeholder="Prenom" 
                            value={prenom}
                            onChange={(e) => onchange(e)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required  
                        />
                    </div>
                    
                    
                    <div>
                        
                        <input  
                            type="text" 
                            id="adresse" 
                            name='adresse' 
                            placeholder="Adresse" 
                            value={adresse}
                            onChange={(e) => onchange(e)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required  
                        />
                    </div>
                    
                    

                    <div>
                        
                        <input  
                            type="number" 
                            id="tel" 
                            placeholder="Phone number" 
                            name='tel' 
                            value={tel}
                            onChange={(e) => onchange(e)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required  
                        />
                    </div>


                    
                
                </div>
                
                <div className="w-full flex justify-center">
                    <button 
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden  font-medium text-gray-900 rounded group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    // onClick={Submit}
                    >
                        <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded group-hover:bg-opacity-0">
                            Submit
                        </span>
                    </button>
                </div>
            </form>
            </div>
        </Modal>

        
    </div>
  )
}

export default Users