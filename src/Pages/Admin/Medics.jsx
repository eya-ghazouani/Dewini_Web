import React, { useEffect, useRef, useState } from 'react';

import Modal from 'react-modal';
import swal from 'sweetalert';
import axios from 'axios'; 
import moment from 'moment';
import Cookies from 'universal-cookie';

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

const Medics = () => {

    Modal.setAppElement('#root');
    const navigate = useNavigate();
    const cookies = new Cookies();
    let user = cookies.get('user');
    const [search, setSearch] = useState('');
    const [filterData, setfilterData] = useState([]);
    const [masterData, setmasterData] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [form, setForm] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [qte, setQte] = useState(1);
    const [date, setDate] = useState('');
    const [dateIsValid, setDateIsValid] = useState(true);
    const [id, setId] = useState('');
    const [isMedic, setIsMedic] = useState(true);

    const [action, setAction] = useState('add');
    //image related
    const [File, setFile] = useState(null);
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

    const fetchdata = async () => {
      const response = await axios.get(`${path}produit/`);
      setfilterData(response.data.data);
      setmasterData(response.data.data);
      const result = await axios.get(`${path}categorie/`);
      setCategories(result.data.data);
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
      setTitle('');
      setType('');
      setCategory('');
      setForm('');
      setDate('');
      setQte(1);
      setImage(null);
      setId('');
      setFile(null);
      setPreviewUrl(null);
      setIsValid(false);
      setAction('add');
    }
  
    const onchange = (e) => {
      if(e.target.name === 'title'){
        setTitle(e.target.value);
      } else if(e.target.name === 'type'){
        setType(e.target.value);
      } else if(e.target.name === 'category'){
        setCategory(e.target.value);
      } else if(e.target.name === 'date'){
        setDate(e.target.value);
        let now = moment(new Date()).format('YYYY-MM-DD');
        let days = moment(now).add(30, 'days')
        // console.log(moment(days).isBefore(e.target.value));
        // console.log(moment(now).isBefore(e.target.value));
        setDateIsValid(moment(days).isBefore(e.target.value)); 
      } else if (e.target.name === 'form') {
        setForm(e.target.value);
      }
  
    }
    
    const update = (item) => {
      console.log('====================================');
      console.log(item);
      console.log('====================================');
      setTitle(item.title);
      setType(item.type);
      setCategory(item.category);
      setDate(item.deadline);
      setImage(item.image);
      setQte(item.qte);
      setForm(item.form);
      setId(item._id);
      setAction('update');
  
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
      
    const submit = async (e) => {
      e.preventDefault();
      if (!dateIsValid) {
        swal(
          "Error!",
          'Check data',
          "error"
        );
        // alert('data isnt vali');
        return;
      }
      if (isMedic) {
        if (category === '' || form === '' || !File) {
          swal(
            "Error!",
            'Remplir tt la forme',
            "error"
          );
          // alert('data isnt vali');
          return;
        }
      } else {
        if (category === '' || !File) {
          swal(
            "Error!",
            'Remplir tt la forme',
            "error"
            );
            // alert('data isnt vali');
            return;
          }
      }
             
      const formData = new FormData();
      if(File) {
        // formData.append("image", previewUrl);
        formData.append("image", File);
      } 
      formData.append('type', type);
      formData.append('category', category);
      formData.append('forme', form);
      formData.append('deadline', date);
      formData.append('title', title);
      formData.append('qte', qte);
      formData.append('status', 1);
      formData.append('userid', user._id);
      


  
      let options, url, result;
      if(action === 'add') {
        url = `http://localhost:4000/produit/add`;

        result = await axios.post(url, formData);
      } else {
        url = `http://localhost:4000/produit/${id}`;

        result = await axios.patch(url, formData);
      }
      console.log(result );
     
      if (result.data.success === true) {
        swal(
          "Success!",
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
      url = `http://localhost:4000/produit/${id}`;
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
              <p  className='text-lg font-semibold cursor-pointer mr-1' >Home  </p><p className='text-lg' >/ Medicines</p>
          </div>
          <div className='flex flex-row items-center'>
              <div className=" relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input type="search" className="pl-10 w-full appearance-none block px-2 py-1 bg-gray-200 text-gray-700 border rounded focus:outline-none focus:bg-white focus:border-gray-500" placeholder="Search" 
                  onChange={(e) => searchFilter(e.target.value)}
                  />
              
              </div>
              <button className="relative inline-flex items-center justify-center p-0.5  ml-10 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
              onClick={openModal}
              >
                  <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Add Medics
                  </span>
              </button>
          </div>
      </div>
    </div>

      
    <div className="w-fll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 pb-5 mx-5">
      {filterData.slice(0).reverse().map(({_id, title, type, category, deadline, qte, image, forme}, idx) => {
        let categor = categories.find(({_id}) => _id === category );
        return (
            <div key={idx} className=" rounded bg-white shadow p-2">
                <div className="w-full flex justify-center">
                    <img
                        src={`http://localhost:4000/uploads/images/${image}`}
                        className='w-auto h-48 rounded  '
                        alt={title}
                    />
                </div>
                <div className="w-full flex flex-row justify-between my-1">
                    <p className='text-xl font-bold '>{title}</p>
                    <div className="w-fit flex flex-row items-center space-x-2">
                    <p className='ml-2 text-base font-semibold  '>{qte}</p>
                    {forme &&
                      <p className='ml-2 text-base font-semibold  '>{forme}(s)</p>
                    }
                    </div>
                </div>

                <div className="w-full flex flex-row items-center my-1">
                    <p className='mx-2 text-sm font-semibold '>Type:</p>
                    <p className='text-sm  '>{type}</p>

                </div>
                {categor &&
                  <div className="w-full flex flex-row items-center my-1">
                    <p className='mx-2 text-sm font-semibold '>Categorie:</p>
                    <p className='ml-2 text-sm  '>{categor.nom}</p>
                  </div>
                }
                <div className="w-full h-6 flex flex-row justify-end mb-1">
                  {deadline &&
                    <p className='ml-2 text-sm text-red-800 '>{deadline}</p>
                  }
                </div>

                <div className="w-full px-2 py-1">
                    <div className="w-full border bg-gray-300" />
                </div>

                <div className="w-full flex flex-row mt-1">
                    <div className="w-1/2 flex justify-center">
                        <button 
                            className="relative w-fit inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                            onClick={() => update({_id, title, type, category, deadline, qte, date, image})}
                        >
                            <span className="relative  px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
                                Update
                            </span>
                        </button>
                    </div>
                    <div className="w-1/2 flex justify-center ">
                    

                        <button 
                            className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-red-300 via-red-400 to-pink-500 group-hover:from-red-300 group-hover:via-red-400 group-hover:to-pink-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-500 hover:text-white "
                            // onClick={() => delete_medic(_id)}
                            onClick={async() => {swal({
                                title: "Are you sure?",
                                text: "Once deleted, you will not be able to recover this Medicine!",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                            .then(async (willDelete) => {
                                if (willDelete) {
                    
                                    delete_medic(_id);
                                } else {
                                swal("Medicine is safe!");
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
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="w-full h-full overflow-auto">
        <form onSubmit={submit} >
                    
          <div className="w-full flex flex-row justify-evenly items-center mb-4">
            <div className="w-fit flex items-center ">
              <input 
                checked={isMedic}
                id="ismedic" 
                type="radio" 
                // value={isMedic} 
                name='type_medic'
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                // onChange={() => console.log('true')}
                onChange={() => {setIsMedic(true); setType('Medicament')}}
                />
              <label htmlFor="ismedic" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Medicament</label>
            </div>

            <div className="w-fit flex items-center">
              <input 
                checked={!isMedic}
                id="pamedic" 
                type="radio" 
                // value={!isMedic} 
                name='type_medic'
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                onChange={() => {setIsMedic(false); setType('Produit Paramedical')}}
                // onChange={() => console.log('true')}
              />
              <label htmlFor="pamedic" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">roduit Paramedical</label>
            </div>
          </div>
          <div className="grid gap-6 mb-6 lg:grid-cols-2 items-end">

              <div className="w-full flex flex-row justify-between items-end">

                  {previewUrl ?

                      <div className="w-1/3 mb-5">

                      <img 
                          src={previewUrl}
                          // src={`https://i.pinimg.com/564x/22/7d/73/227d73d1ca2d45a6b4f196dc916b54a3.jpg`}
                          className='rounded w-full h-auto'
                          alt='image'
                      />
                      </div>
                  : image ?
                      <div className="w-1/3  mb-5">

                          <img 
                          // src={previewUrl}
                          src={`http://localhost:4000/uploads/images/${image}`}
                          className='rounded w-full h-auto'
                          alt='image'
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

              <div className='w-full flex flex-row justify-evenly h-fit'>
                  <div 
                  className='w-1/4 rounded-lg border flex justify-center items-center cursor-pointer hover:shadow'
                  onClick={()=> setQte(qte - 1)}
                  >
                  <TiMinus className='text-gray-600' size={20} />
                  </div>
                  <input 
                  type="number" 
                  id="qte" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-blue-500" 
                  // placeholder="Nom"
                  name='qte' 
                  value={qte}
                  onChange={(e) => onchange(e)}
                      
                  />
                  <div 
                  className='w-1/4 rounded-lg border flex justify-center items-center cursor-pointer hover:shadow'
                  onClick={()=> setQte(qte + 1)}
                  >
                  <BsPlusLg className='text-gray-600' size={20} />
                  </div>
                  
              </div>


            <div>
                
              <input 
                type="text" 
                id="title" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Title"
                name='title' 
                value={title}
                onChange={(e) => onchange(e)}
                required  
              />
            </div>
            <div>
                
                <select 
                  className="form-select appearance-none
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-900 
                    text-sm
                    dark:text-white
                    bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                    name='category'
                    value={category}
                    onChange={(e) => onchange(e)}
                  >
                    <option >Choisir Categorie</option>
                    {categories.map(({_id, nom}, idx) => (
                      <option key={idx} value={_id}>{nom}</option>
                    ))}
                </select>
              </div>

            {isMedic === true ? 
              <>
              <div>
                  
                <select 
                  className="form-select appearance-none
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-900 
                    text-sm
                    dark:text-white
                    bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                    name='form'
                    value={form}
                    onChange={(e) => onchange(e)}
                  >
                    <option >Choisir Form</option>
                    <option value="Paquet">Paquet</option>
                    <option value="Comprime">Comprime</option>
                    <option value="Tablette">Tablette</option>
                    <option value="Sachet">Sachet</option>
                    <option value="Tube">Tube</option>
                    <option value="Ampoule">Ampoule</option>
                    <option value="Injection">Injection</option>
                </select>
              </div>
          

              <div>

                <input 
                  type="date" 
                  id="email" 
                  className={`bg-gray-50 border ${dateIsValid ? 'border-gray-300' : 'border-red-600'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `} 
                  placeholder="Date" 
                  name='date'
                  value={date}
                  onChange={(e) => onchange(e)}
                  required
                    
                />
                {dateIsValid ? null :
                  <small className='text-sm text-red-600 font-medium m-0'>deadline invalid</small>
                }
              </div>
            </>
          : null }
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

export default Medics