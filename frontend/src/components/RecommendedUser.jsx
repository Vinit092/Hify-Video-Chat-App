import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import FriendCard, { getLanguageFlag } from '../components/FriendCard.jsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOutgoingFrndReqs, sendFrndReqs } from '../lib/signup.js';
import { useState } from 'react';
const RecommendedUser = ({user}) => {

    const queryClient=useQueryClient();
    
    const [outgoingReqIds,setOutgoingReqIds]=useState(new Set());
     const hasReqSent = outgoingReqIds.has(user._id);

      const {data:outgoingFrndReqs=[], isLoading:loadingReqs}=useQuery({
           queryKey:['outgoingFrndReqs'],
           queryFn: getOutgoingFrndReqs,
         });
         

    const {mutate:sendReqestMutation, isPending}= useMutation({
          mutationFn:sendFrndReqs,
          onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['outgoingFrndReqs']});
          }
        });

         
  return (
    <>
     <div key={user._id} className='card min-w-max rounded-xl bg-base-200 shadow-md hover:shadow-2xl transition-all duration-300'>
                            <div className='card-body p-5 space-y-4'>
                              <div className='flex items-center gap-3'>
                                <div className='avatar size-16 rounded-full'>
                                  <img src={user.profilePic} alt={user.fullName} className='rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1.5 duration-300'/>
                                </div>
                                <div>
                                  <h3 className='font-semibold text-lg'>{user.fullName}</h3>
                                  {
                                    user.city && (
                                      <div className='flex items-center text-xs opacity-70 mt-1'>
                                        <MapPinIcon className='size-3 mr-1'/>
                                        {user.city}
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                              
                              <div className='flex flex-wrap gap-2'>
                                <span className='badge badge-secondary'>
                                    {getLanguageFlag(user.nativeLanguage)}
                                    Native: {capitialize(user.nativeLanguage)}
                                </span>

                                <span className='badge badge-outline'>
                                  {getLanguageFlag(user.learningLanguage)}
                                  Learning: {capitialize(user.learningLanguage)}
                                </span>
                              </div>

                              {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                              <button className={`btn w-full mt-2
                                ${
                                hasReqSent ? 'btn-disabled' : 'btn-primary'}
                                `}
                                onClick={()=> sendReqestMutation(user._id)}
                                disabled={isPending || hasReqSent}
                                >
                                    {
                                      isPending && !hasReqSent
                                      ? (
                                        <>
                                        <CheckCircleIcon className='size-4 mr-2'/>
                                        Request Sent
                                        </>
                                      )
                                      :(
                                        <>
                                        <UserPlusIcon className='size-4 mr-2'/>
                                        Send Friend Request
                                        </>
                                      )
                                    }
                              </button>
                            </div>

                          </div> 
    </>
  )
}

export default RecommendedUser

const capitialize=(str)=>( str.charAt(0).toUpperCase() + str.slice(1));