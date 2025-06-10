import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { LoaderIcon } from 'react-hot-toast';
import { completeOnBoarding } from '../lib/signup.js';
import { CameraIcon, MapPinIcon, HeartHandshake, ShuffleIcon }  from "lucide-react";
import { LANGUAGES } from '../../constants/index.js';

const OnBoardingPage = () => {

          const {authUser} = useAuthUser();

          const queryClient= useQueryClient();

          const [formState,setFormState]=useState({
            fullName: authUser?.fullName || '',
            bio: authUser?.bio || '',
            nativeLanguage: authUser?.nativeLanguage || '',
            learningLanguage: authUser?.learningLanguage || '',
            city: authUser?.city || '',
            profilePic: authUser?.profilePic || '',
          });

          const {mutate:onBoardingMutation, isPending}=useMutation({
            mutationFn: completeOnBoarding,
            onSuccess: ()=>{
              toast.success('Onboarding completed successfully!');
              queryClient.invalidateQueries({queryKey:['authUser']});
            },
            onError:(error)=>{
              toast.error(error.response?.data?.message || 'Something went wrong!');
            },
          });

          const handleChange=(e)=>{
              e.preventDefault();
              onBoardingMutation(formState);
          };

          const handleRandomPic=()=>{
              const idx= Math.floor(Math.random() * 100) + 1;
              const randomPic = `https://avatar.iran.liara.run/public/${idx}.png`;

              setFormState({...formState, profilePic: randomPic});
              toast.success('Random profile picture generated!');
          };

  return (
    <>
      <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
        <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
          <div className='card-body p-6 sm:p-8'>
            <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
              Complete Your Onboarding
            </h1>
            <form onSubmit={handleChange} className='space-y-6'>
              {/* profile */}
              <div className='flex flex-col items-center justify-center space-y-4'>
              {/* img */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
            {
              formState.profilePic ? (
                <img src={formState.profilePic} 
                alt="user's profile pic" 
                className='w-full h-full object-cover'
                />
              )
              : (
                <div className='flex items-center justify-center h-full'>
                  <CameraIcon className='size-12 text-base-content opacity-40'/>

                </div> 
              )
            }
              </div>

              {/* random pics */}
              <div className='flex flex-col items-center gap-2'>
                <button type='button' onClick={handleRandomPic} className='btn btn-accent'>
                  <ShuffleIcon className='size-4 mr-2'/>
                  Random Profile Pic
                </button>
              </div>
             </div>

               {/* information */}

               <div className="form-control">
                    <label className="label">
                    <span className="label-text">Full Name</span>
                    </label>
                    <input type="text" 
                    placeholder="fullName"
                    name='fullName'
                    className="input input-bordered w-full"
                    value={formState.fullName}
                    onChange={(e)=> setFormState({...formState, fullName: e.target.value})}
                    />
                </div>

                 <div className="form-control">
                    <label className="label">
                    <span className="label-text">Bio (optional)</span>
                    </label>
                    <textarea
                    name='bio' 
                    placeholder="tell us about yourself..."
                    className="textarea textarea-bordered h-24"
                    value={formState.bio}
                    onChange={(e)=> setFormState({...formState, bio: e.target.value})}
                    required
                    />
                  </div>

                  {/* only for language */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* native */}
                  <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>
                      Native Language
                    </span>
                  </label>
                  <select name="nativeLanguage" 
                  value={formState.nativeLanguage} 
                  onChange={(e)=> setFormState({...formState, nativeLanguage: e.target.value})} 
                  className='select select-bordered w-full'
                  required
                  >

                    <option value="" className='font-bold'>Select Your Native Language</option>
                    {
                      LANGUAGES.map((lang)=>(
                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                          </option>
                      ))
                    }
                  </select>
                  </div>

                  {/* learning */}

                    <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>
                      Learning Language
                    </span>
                  </label>
                  <select name="learningLanguage" 
                  value={formState.learningLanguage} 
                  onChange={(e)=> setFormState({...formState, learningLanguage: e.target.value})} 
                  className='select select-bordered w-full'
                  required
                  >

                    <option value="" className='font-bold'>Select Your Learning Language</option>
                    {
                      LANGUAGES.map((lang)=>(
                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                          </option>
                      ))
                    }
                  </select>
                  </div>
                 </div>
              
                    {/* location */}
                    <div className="form-control">
                    <label className="label">
                    <span className="label-text">Location</span>
                    </label>
                    <div className='relative'>
                      <MapPinIcon className='absolute left-2 top-3 transform text-base-content opacity-70 size-5' />
                    </div>
                    <input type="text" 
                    placeholder="City, Country"
                    name='city'
                    className="input input-bordered w-full pl-10"
                    value={formState.city}
                    onChange={(e)=> setFormState({...formState, city: e.target.value})}
                    required
                    />
                </div>
                  
                  <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
                    {
                      !isPending 
                      ?(<>
                      <HeartHandshake className='size-5 mr-2' />
                      Complete Onboarding
                      </>)
                      :(
                        <>
                        <LoaderIcon className='animate-spin size-5 mr-2' />
                        onboarding... 
                        </>
                      )
                    }
                  </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default OnBoardingPage
