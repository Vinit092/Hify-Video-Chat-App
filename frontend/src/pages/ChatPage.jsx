import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser.js';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/signup.js';
import {Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window } from 'stream-chat-react'
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader.jsx';
import CallButton from '../components/CallButton.jsx';
const ChatPage = () => {

      const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY;
      const {id:tarUserId}=useParams();

      const [chatClient,setChatClient]=useState();
      const [channel,setChannel]=useState();
      const [loading,setLoading]=useState();

      const {authUser}=useAuthUser();

      const{data:tokenData}=useQuery({
        queryKey:['streamToken'],
        queryFn: getStreamToken,
        enabled:!!authUser //this will run only when authUser is available
      });

      useEffect(()=>{
        const initChat=async ()=>{
          if(!tokenData?.token || !authUser)
            return

          try {
            console.log('Initializing stream chat application...');
            
            const client=StreamChat.getInstance(STREAM_API_KEY);

            if(!client.userID)
            await client.connectUser({
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },tokenData.token );

            const channelId=[authUser._id,tarUserId].sort().join("-");

            const currChannel= client.channel("messaging",channelId,{
              members:[authUser._id,tarUserId],
            });

            await currChannel.watch();

            setChatClient(client);

            setChannel(currChannel);
          } catch (error) {
            console.log("Error Initializing chat:",error);
            toast.error("Could not connect to chat. Please try again!");            
          }
          finally{
            setLoading(false);  
          }
        };

        initChat();
      },[tokenData,authUser,tarUserId]);

      if(loading || !chatClient || !channel)
        return <ChatLoader/>  ;

      const handleVideoCall=()=>{
        if(channel){
          const callUrl= `${window.location.origin}/call/${channel.id}`;
          channel.sendMessage({
            text:`I've started a video call, Join me here ASAP!: ${callUrl}`,
          });
          toast.success('video call link sent successfully!');
        }
      };

      

  return (
    <>
      <div className='h-[91vh]'>
        <Chat client={chatClient}>
        <Channel channel={channel}>
        <div className='w-full relative'>
        <CallButton handleVideoCall={handleVideoCall}/>
        <Window>
          <ChannelHeader/>
          <MessageList/>
          <MessageInput focus/>
        </Window>
        </div>
        <Thread/>
        </Channel>
        </Chat>

      </div>
    </>
  )
}

export default ChatPage
