import React from 'react'
import useAuthUser from '../hooks/useAuthUser.js';
import { Link, useLocation } from 'react-router';
import { HeartHandshake, HomeIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/signup.js';

const Sidebar = () => {
    const {authUser} = useAuthUser();

    const location= useLocation();
    const currentLocation= location.pathname;
    
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
     <aside className='w-64 z-10 bg-base-200 border-r border-base-300 hidden lg:flex flex-col top-0 sticky h-screen'>
      <div className='p-5 border-b h-13 border-base-300'>
        <Link to={'/'} className='flex items-center justify-center gap-3'>
        <HeartHandshake className='size-9 text-primary' />
        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider opacity-65 hover:opacity-100 duration-500'>
        Hify
        </span>
        </Link>
      </div>

      <nav className='flex-1 p-4 space-y-1 '>
        <Link to={'/'} className={`btn btn-ghost w-full justify-start gap-3 px-3 text-base-content hover:bg-base-400 hover:text-primary rounded-3xl normal-case 
          ${
          currentLocation ==='/' ? 'btn-active hover:rounded-xl transition-all duration-300' : ''
          }
          `}>
        <HomeIcon className='size-5 text-base-content opacity-70' />
        <span>Home</span>
        </Link>

        <Link to={'/notifications'} className={`btn btn-ghost w-full justify-start gap-3 px-3 text-base-content hover:bg-base-400 hover:text-primary normal-case rounded-3xl  
          ${
          currentLocation ==='/notifications' ? 'btn-active hover:rounded-xl transition-all duration-300' : ''
          }
          `}>
        <HomeIcon className='size-5 text-base-content opacity-70' />
        <span>Notifications</span>
        </Link>

         <div className='btn btn-ghost w-full justify-start gap-3 px-3 text-base-content hover:bg-base-400 hover:text-primary normal-case rounded-3xl'  
         onClick={logoutMutation}
        >
        <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
        <span >Logout</span>
        </div>
        </nav>

        <div className='p-4 border-t border-base-300 mt-auto'>
          <div className='flex items-center gap-3'>
            <div className='avatar'>
              <div className='w-10 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1.5 duration-300'>
                <img src={authUser?.profilePic} alt="user's pic" /> 
              </div>
            </div>
            <div className='flex-1'>
              <p className='font-semibold text-sm cursor-default'>{authUser?.fullName}</p>
              <p className='text-xs text-success flex-row space-x-1 cursor-default'>
                <span className='size-2 rounded-full bg-success inline-block'></span>
              <span>Online</span>
              </p>
            </div>
          </div>

        </div>

     </aside>
    </>
  )
}

export default Sidebar
