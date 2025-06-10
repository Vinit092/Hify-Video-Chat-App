import React from 'react'
import { LANGUAGE_TO_FLAG } from '../../constants/index.js';
import { Link } from 'react-router';


const FriendCard = ({frnd}) => {
  if (!frnd) {
    console.trace("FriendCard received undefined:", frnd);
    return null;
  }
  return (
    <>
     <div className='card bg-base-200 hover:shadow-xl transition-shadow rounded-xl duration-300 shadow-md'>
        <div className='card-body p-4'>

        <div className='flex items-center gap-3 mb-3'>
        <div className='avatar size-12'>
            <img src={frnd.profilePic} alt={frnd.fullName} className='rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1.5 duration-300'/>
        </div>
        <h3 className='font-semibold truncate'>{frnd.fullName}</h3>
        </div>

        <div className='flex flex-col flex-wrap gap-2 mb-3'>
            <span className='badge badge-secondary text-xs'>
                {getLanguageFlag(frnd.nativeLanguage)}
                Native: {frnd.nativeLanguage}
            </span>
            <span className='badge badge-outline text-xs'>
                {getLanguageFlag(frnd.learningLanguage)}
                Learning: {frnd.learningLanguage}
            </span>
        </div>

         <Link to={`/chat/${frnd._id}`} className='btn btn-outline w-full'>
         Message
         </Link>
        
        </div>
    </div> 
    </>
  )
}

export default FriendCard

export function getLanguageFlag(lang){
    if(!lang) return null;

    const langLower = lang.toLowerCase();
    const cntCode= LANGUAGE_TO_FLAG[langLower];

    if(cntCode){
      return(
        <img src={`https://flagcdn.com/24x18/${cntCode}.png`} 
        alt={`${langLower} flag`} 
        className='h-3 mr-1 inline-block'
        />
      );
    }
    return null;
  }