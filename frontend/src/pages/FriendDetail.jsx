import React from 'react';
import { useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserFrnds } from '../lib/signup.js'; // make sure this exists
import FriendCard from '../components/FriendCard.jsx';

const FriendDetail = () => {
    const queryClient=useQueryClient();
  const { id } = useParams();

  const { data:frnd=[], isLoading } = useQuery({
    queryKey: ['friend'],
    queryFn: () => getUserFrnds,
  });

  const {mutate:sendReqestMutation, isPending}= useMutation({
        mutationFn:sendFrndReqs,
        onSuccess:()=>{
          queryClient.invalidateQueries({queryKey:['outgoingFrndReqs']});
        }
      });
  

  if (isLoading) return <div>Loading friend...</div>;
  if (!frnd) return <div>Friend not found</div>;

  return <FriendCard frnd={frnd} />;
};

export default FriendDetail;
