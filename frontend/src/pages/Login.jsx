import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { login } from '../lib/signup.js';
import { HeartHandshake } from 'lucide-react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';

const Login = () => {
    
       const [loginData, setLoginData]=useState({
        email: "",
        password: "",
       });

       const queryClient = useQueryClient();

       const {mutate:loginMutation, isPending,error}= useMutation(
        {
        mutationFn: login,
        onSuccess: ()=> queryClient.invalidateQueries({queryKey:['authUser']}),
        onError:(error)=>{
          toast.error(error.response?.data?.message);
        }
        });

        const handleLogin=(e)=>{
        e.preventDefault();
        loginMutation(loginData);
        };


  return (
    <>
      <div
        className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
        data-theme="forest"
      >
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl  mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

        {/* Left Side */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
            <div className="mb-4 flex items-center justify-center gap-2">
              <HeartHandshake className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Hify
              </span>
            </div>
        {/* Error message */}
          {
            error && (
              <div className="alert alert-error shadow-lg mb-4">
                <div>
                  <span>{error.response.data.message}</span>
                </div>
              </div>
            )
          }

            <div className="w-full">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Welcome Back!</h2>
                    <p className='text-sm opacity-70'>Login to your account to Join Hify and start your journey with us!</p>
                  </div>

                <div className="flex flex-col gap-3">
                
                    <div className="form-control w-full space-y-2">
                    <label className="label">
                    <span className="label-text">Email</span>
                    </label>
                    <input type="email"
                    placeholder="Ex: vinitsuva@gmail.com"
                    className="input input-bordered w-full"
                    value={loginData.email}
                    onChange={(e)=> setLoginData({...loginData, email: e.target.value})}
                    required/>
                    </div>

                    <div className="form-control w-full space-y-2">
                    <label className="label">
                    <span className="label-text">Password</span>
                    </label>
                    <input type="password" 
                    placeholder="Ex: vinit9714"
                    className="input input-bordered w-full"
                    value={loginData.password}
                    onChange={(e)=> setLoginData({...loginData, password: e.target.value})}
                    required/>
                    </div>


                </div>

                <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
                  {isPending ? (<span className="loading loading-dots loading-xl">Signing in...</span>) : ("Sign In")}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Don't have an account?{" "}
                    <Link to={'/signup'} className="text-primary hover:underline">
                    Sign Up
                    </Link>
                  </p>
                 </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/login.png" alt="signup Image"className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
            <p className="opacity-70">
              Hify is a platform that connects you with language partners from around the world, allowing you to practice and improve your language skills through real conversations.
            </p>
            </div>

          </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Login
