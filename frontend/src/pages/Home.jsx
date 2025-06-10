import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getFrndReqs, getOutgoingFrndReqs, getRecommendedUsers, getUserFrnds, sendFrndReqs } from '../lib/signup.js'
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react'
import NoFriend from '../components/NoFriend.jsx'
import NoRecFriend from '../components/NoRecFriend.jsx';
import RecommendedUser from '../components/RecommendedUser.jsx';
import FriendCard from '../components/FriendCard.jsx';
const Home = () => {

    const queryClient=useQueryClient();
    
    const [outgoingReqIds,setOutgoingReqIds]=useState(new Set());

    const {data:frnds=[], isLoading:loadingFrnds}=useQuery({
      queryKey:['friends'],
      queryFn: getUserFrnds,
    });

    const {data:recommendedUsers=[], isLoading:loadingUsers}=useQuery({
      queryKey:['recommendedUsers'],
      queryFn: getRecommendedUsers,
    });

    const {data:outgoingFrndReqs=[], isLoading:loadingReqs}=useQuery({
      queryKey:['outgoingFrndReqs'],
      queryFn: getOutgoingFrndReqs,
    });
    
const{data:frndReqs,isLoading}=useQuery({
        queryKey:['frndReqs'],
        queryFn: getFrndReqs,
      });

    const {mutate:sendReqestMutation, isPending}= useMutation({
      mutationFn:sendFrndReqs,
      onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['outgoingFrndReqs']});
      }
    });

    const incomingReqs=frndReqs?.incomingReqs || [];
    const acceptedReqs=frndReqs?.acceptedReqs || [];

    // console.log(frnds);
    
    
    // console.log(acceptedReqs);
    
  return (
    <>
      <div className='p-4 sm:p-6 lg:p-8'>
        <div className='container mx-auto space-y-10'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5'>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
           <Link to={'/notifications'} className='btn btn-outline btn-sm rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1.5'>
           <UserIcon className='mr-2 size-4'/>
           Friend Requests <span className='badge badge-success'>{parseInt(acceptedReqs.length)+parseInt(incomingReqs.length)}</span>
           </Link>
            </div>

            {
              loadingFrnds
              ?(
                <div className='flex justify-center py-12'>
                  <span className='loading loading-spinner loading-lg'/>
                </div>
              )
              :(
                frnds.length == 0
                ?(<NoFriend/>)
                :(
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {
                     frnds
                      .map((frnd)=>(
                        <FriendCard  key={frnd._id} frnd={frnd}/>
                      ))
                    }

                  </div>
                )
              )
            }

            <section>
              <div className='mb-6 sm:mb-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                  <div>
                    <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                      Meet New People!
                    </h2>
                    <p className='opacity-70'>"From LOLs to deep talks — face-to-face, fast"</p>
                  </div>
                 </div>
              </div>

              {
                loadingUsers
                ? (
                  <div className='flex justify-center py-12'>
                  <span className='loading loading-spinner loading-lg'/>
                </div>
                )
                : (
                   recommendedUsers.length ===0
                ?(<NoRecFriend/>)
                :(
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {
                      recommendedUsers.map((user)=>{
                       
                        return(
                          <RecommendedUser key={user._id} user={user}/>
                        )
                      })
                    }

                  </div>
                )
                )
              }
            </section>

        </div>

      </div>
    </>
  )
}

export default Home

