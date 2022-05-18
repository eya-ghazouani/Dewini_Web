import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Menu, Transition } from '@headlessui/react'

import { CgMenu } from 'react-icons/cg';
import { BsThreeDotsVertical, BsCardChecklist } from 'react-icons/bs';
import { RiDashboardLine } from 'react-icons/ri';
import { FiUsers } from 'react-icons/fi';
import { AiOutlineMedicineBox } from 'react-icons/ai';


const Navbar = () => {

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // console.log(isMobile );
  return (
    <div className='w-full  flex flex-row shadow p-1 bg-white'>

        <div className='w-2/5 flex flex-row ' >
          <div className='w-2/5 flex justify-center items-center'>
            <h1>LOGO</h1>
          </div>

          <div className='w-3/5 flex justify-end items-center'>
            <div className=" w-5/6 relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input type="search" id="search" className="block p-1 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" />
              
            </div>
          </div>
        </div>

        <div className='w-3/5 flex justify-end items-center' >
          <div className='w-5/6 flex justify-end pr-5  space-x-4 items-center'>
            {isMobile ? null :
              <>
                <Link className='font-semibold hover:text-blue-800' to='/'>Dashboard</Link>
                <Link className='font-semibold hover:text-blue-800' to='/users'>Users</Link>
                <Link className='font-semibold hover:text-blue-800' to='/medics'>Medics</Link>
                <Link className='font-semibold hover:text-blue-800' to='/confirm'>Reservation</Link>
                <Link className='font-semibold hover:text-blue-800' to='/donations'>Donations</Link>
              </>
            }
            <div>
              <img
                src='https://i.pinimg.com/750x/2b/6d/f0/2b6df004a324e4f303154d5e151753c7.jpg'
                className='w-10 h-10 bg-blue-900 rounded-full ml-8  '
                alt='avatar'
              />
            </div>
          </div>
        </div>

        {/* dropdown haidlessui component::::::: */}
        {isMobile ?
          <div className=" text-right">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center rounded-md bg-opacity-20 px-4 py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <BsThreeDotsVertical size={25} />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {active ? (
                            <RiDashboardLine
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <RiDashboardLine
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                          Dashboard
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {active ? (
                            <FiUsers
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <FiUsers
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                          Users
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {active ? (
                            <AiOutlineMedicineBox
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <AiOutlineMedicineBox
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                          Medics
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {active ? (
                            <BsCardChecklist
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <BsCardChecklist
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                          Reservation
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  {/* <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {active ? (
                            <DeleteActiveIcon
                              className="mr-2 h-5 w-5 text-violet-400"
                              aria-hidden="true"
                            />
                          ) : (
                            <DeleteInactiveIcon
                              className="mr-2 h-5 w-5 text-violet-400"
                              aria-hidden="true"
                            />
                          )}
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div> */}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        : null }
      </div>
  )
}

export default Navbar