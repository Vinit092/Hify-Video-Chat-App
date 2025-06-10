import React, { useState } from "react";
import { HeartHandshake }  from "lucide-react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "../lib/axios.js";
import { signup } from "../lib/signup.js";

const SIgnUpPage = () => {

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {mutate:signupMutation, isPending, error}= useMutation({
    mutationFn: signup,
    onSuccess: ()=> queryClient.invalidateQueries({queryKey:['authUser']}),
    onError: (error)=>{
      toast.error(error.response?.data?.message);
    }
  });

  
  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
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
              <form onSubmit={handleSignup}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Create an account</h2>
                    <p>Join Hify and start your journey with us!</p>
                  </div>
                <div className="space-y-3">
                  
                  <div className="form-control w-full">
                    <label className="label">
                    <span className="label-text">Full Name</span>
                    </label>
                    <input type="text" 
                    placeholder="Ex: vinit suva"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={(e)=> setSignupData({...signupData, fullName: e.target.value})}
                    required/>
                    </div>

                    <div className="form-control w-full">
                    <label className="label">
                    <span className="label-text">Email</span>
                    </label>
                    <input type="email"
                    placeholder="Ex: vinitsuva@gmail.com"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e)=> setSignupData({...signupData, email: e.target.value})}
                    required/>
                    </div>

                    <div className="form-control">
                    <label className="label">
                    <span className="label-text">Password</span>
                    </label>
                    <input type="password" 
                    placeholder="Ex: vinit9714"
                    className="input input-bordered"
                    value={signupData.password}
                    onChange={(e)=> setSignupData({...signupData, password: e.target.value})}
                    required/>
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 8 characters long.
                    </p>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input type="checkbox" className="checkbox checkbox-sm" required/>
                        <span className="text-xs leading-tight">
                          I agree to the {""}
                          <span className="text-primary hover:underline">terms of service</span>
                          <span> and </span>
                          <span className="text-primary hover:underline">privacy policy</span>
                        </span>
                      </label>
                    </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (<span className="loading loading-dots loading-xl"></span>) : ("Create Account")}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to={'/login'} className="text-primary hover:underline">
                    Sign In
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
            <img src="/signup.png" alt="signup Image"className="w-full h-full" />
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
  );
};

export default SIgnUpPage;
