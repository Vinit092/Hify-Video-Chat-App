import React from 'react'

const NoRecFriend = () => {
  return (
    <>
       <div className='card bg-base-200 p-6 text-center'>
        <h3 className='font-semibold text-lg mb-2'>No recommendations available yet</h3>
        <p className='text-base-content opacity-70'>
            We couldn't find any new friends for you at the moment. 
            Keep checking back or try adjusting your preferences!
        </p>
        </div>
    </>
  )
}

export default NoRecFriend
