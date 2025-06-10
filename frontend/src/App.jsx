import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Notification from './pages/Notification.jsx';
import ChatPage from './pages/ChatPage.jsx';
import Call from './pages/Call.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';
import SIgnUpPage from './pages/SIgnUpPage.jsx';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useThemeStore.js';
const App = () => {
    
      const {isLoading, authUser} = useAuthUser();
      
        const {theme}= useThemeStore();


      if(isLoading){
        return <PageLoader/>
      }

      
  
      const isAuthenticated = Boolean(authUser);
      
      const isOnBoarded=authUser?.isOnBoarded;

  return (
    <>
    <div className='min-h-screen' data-theme={theme}>
    <Routes>
      <Route path='/' element={isAuthenticated && isOnBoarded
        ? (<Layout showSidebar={true}><Home/></Layout>) 
        : (<Navigate to={!isAuthenticated ?'/login' : '/onboarding'}/>)}/>

      <Route path='/signup' element={!isAuthenticated 
        ? <SIgnUpPage/> 
        : <Navigate to={isOnBoarded ? '/' : '/onboarding'}/>}/>
      
      <Route path='/login' element={!isAuthenticated 
        ? <Login/> 
        : <Navigate to={isOnBoarded ? '/' : '/onboarding'}/>}/>

      <Route path='/onboarding' element={isAuthenticated 
        ? ( !isOnBoarded 
          ? (<OnBoardingPage/>) 
        : (<Navigate to={'/'} />) ) 
        : (<Navigate to={'/login'}/>)}/>

      <Route path='/notifications' element={isAuthenticated && isOnBoarded 
      ? (
        <Layout showSidebar={true}>
          <Notification />
        </Layout>
      ) 
      : (
        <Navigate to={!isAuthenticated 
          ? ('/login') 
          : ('onboarding')}/>
      )
      }/>
      
      <Route path='/chat/:id' element={isAuthenticated && isOnBoarded 
      ? (
        <Layout showSidebar={false}>
          <ChatPage />
        </Layout>
      ) 
      : (
        <Navigate to={!isAuthenticated 
          ? ('/login') 
          : ('onboarding')}/>
      )}/>

      <Route path='/call/:id' element={isAuthenticated && isOnBoarded 
      ? (
          <Call />
        ) 
      : (
        <Navigate to={!isAuthenticated 
          ? ('/login') 
          : ('onboarding')}/>
      )}/>

    </Routes> 

    <Toaster/>
    </div>
    </>
  )
}

export default App
