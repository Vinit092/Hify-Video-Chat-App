import React from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser.js';
import { getStreamToken } from '../lib/signup.js';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  CallControls,
  SpeakerLayout,
  StreamTheme,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { create } from 'zustand';
import PageLoader from '../components/PageLoader.jsx';

const Call = () => {
    
    const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY;


    const {id:callId}=useParams();
    const [client,setClient]=useState(null);
    const [call,setCall]=useState(null);
    const [isConnecting,SetIsConnecting]=useState(true);

    const {authUser, isLoading}=useAuthUser();

    const{data:tokenData}=useQuery({
            queryKey:['streamToken'],
            queryFn: getStreamToken,
            enabled:!!authUser //this will run only when authUser is available
          });

    useEffect(()=>{
      const initCall= async ()=>{
        if(!tokenData.token || !authUser || !callId)
          return;

        try {
          console.log("Initializing stream video client...");
          
          const user={
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          };

          const videoClient= new StreamVideoClient({
            apiKey: STREAM_API_KEY,
            user,
            token: tokenData.token,
          });

          const callInstance= videoClient.call("default",callId);
          await callInstance.join({create:true});

          console.log('joined call successfully!');

          setClient(videoClient);
          setCall(callInstance);
          
        } catch (error) {
          console.log('Error joining call:',error);
          toast.error('could not join the call, please try again!')
          
        }
        finally{
          SetIsConnecting(false);
        }
      }
      initCall();
    },[tokenData,authUser,callId]);

    if(isLoading || isConnecting)
      return <PageLoader/>

  return (
    <>
      <div className='h-screen flex flex-col items-center justify-center'>
        <div className='relative'>
          {
            client && call 
            ?(
              <StreamVideo client={client}>
              <StreamCall StreamCall call={call}>
              <CallContent />
              </StreamCall>
              </StreamVideo>
            )
            :(
              <div className='flex items-center justify-center h-full'>
              <p>Could not initialize call, please refresh or try again!</p>
              </div>
            )
          }

        </div>

      </div>
    </>
  )
}

  const CallContent=()=>{
    const {useCallCallingState}=useCallStateHooks();
    const callingState= useCallCallingState();

    const navigate= useNavigate();

    if(callingState === CallingState.LEFT)
      return navigate('/');

    return (
      <StreamTheme>
        <SpeakerLayout/>
        <CallControls/>
      </StreamTheme>
    )
  };

export default Call
