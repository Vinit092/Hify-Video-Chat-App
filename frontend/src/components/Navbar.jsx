import React from 'react'
import useAuthUser from '../hooks/useAuthUser.js'
import { Link, useLocation } from 'react-router';
import {useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/signup.js';
import toast from 'react-hot-toast';
import { BellIcon, HeartHandshake, HomeIcon, LogOutIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector.jsx';

const Navbar = () => {
    const {authUser}=useAuthUser();
    const location= useLocation();
    // const currentLocation= location.pathname;

    const isChat=location.pathname.startsWith('/chat');
    
    const queryClient= useQueryClient();

    const {mutate:logoutMutation}=useMutation({
      mutationFn:logout,
      onSuccess:()=> {queryClient.invalidateQueries({queryKey:['authUser']})},
      onError:(error)=>{
          toast.error(error.response?.data?.message || 'Something went wrong while logging out!');
      }
    });

  return (
    <>
      <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-10 h-16 flex items-center'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center'>

          <div className='flex md:w-full '>


            {
              isChat && (
                <div className='pl-5 hidden'>
                <Link to={'/'} className='flex items-center justify-center gap-3'>
                <HeartHandshake className='size-9 text-primary' />
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider opacity-65 hover:opacity-100 duration-500'>
                  Hify
                </span>
                </Link>
                </div>
              )
            }
            </div>

            
            
            <div className='flex flex-row gap-5'>  
             {
              <div className='lg:hidden'>  
             <Link to={'/'} 
             className='btn btn-ghost btn-circle'>
              <HomeIcon className='md:size-7 size-6 text-base-content opacity-70' />
            </Link>
            </div>
          }

            <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
              <Link to={'/notifications'}>
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='md:size-7 size-6 text-base-content opacity-70'/>
              </button>
              </Link>
           </div>

           <ThemeSelector/>

           {
              <div className='lg:hidden'>  
             <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
              <LogOutIcon className='md:size-8 size-6 text-base-content opacity-70' />
            </button>
            </div>
          }

            <div className='avatar items-center'>
              <div className='md:size-11 size-9 rounded-full shadow-xl'>
              <img src={authUser?.profilePic} alt="user's pic" rel='nonreferrer'/>
              </div>
            </div>
          </div>
          </div>
          

      </nav>
    </>
  )
}

export default Navbar
