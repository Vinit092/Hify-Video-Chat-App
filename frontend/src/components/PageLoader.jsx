import { Loader} from 'lucide-react'
import React from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { useThemeStore } from '../store/useThemeStore.js'

const PageLoader = () => {

      const {theme}= useThemeStore();

  return (
    <>
     <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
        <Loader className='size-20 text-primary animate-spin' />
    </div> 
    </>
  )
}

export default PageLoader
