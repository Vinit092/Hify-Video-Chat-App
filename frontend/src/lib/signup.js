import { useEffect } from "react";
import { axiosInstance } from "./axios.js";

export const signup = async (signupData)=>{
       const response= await axiosInstance.post('/auth/signup', signupData);
       return response.data;
};

export const login = async (loginData)=>{
       const response= await axiosInstance.post('/auth/login', loginData);
       return response.data;
};

export const logout = async ()=>{
       const response= await axiosInstance.post('/auth/logout');
       return response.data;
};

export const getAuthUser = async ()=>{
    
          try {
              const res = await axiosInstance.get('/auth/me');
              return res.data;
          } catch (error) {
              console.log("Error fetching auth user:", error);
              return null;
          }
};

export const completeOnBoarding=async (userData)=>{
              const res= await axiosInstance.post('/auth/onboarding',userData);
              return res.data;
};

export const getUserFrnds=async ()=>{
              const res= await axiosInstance.get('/users/frnds');
              return res.data;
};

export const getRecommendedUsers=async ()=>{
              const res= await axiosInstance.get('/users/');
              return res.data;    
};

export const getOutgoingFrndReqs=async ()=>{
       const res= await axiosInstance.get(`/users/outgoing-frnd-reqs`);
       return res.data;
};

export const sendFrndReqs=async (userId)=>{
       const res= await axiosInstance.post(`/users/frnd-req/${userId}`);
       return res.data;
};

export const getFrndReqs=async ()=>{
       const res= await axiosInstance.get('/users/frnd-reqs');
       return res.data;
}; 

export const acceptFrndReq=async (requestId)=>{
       const res= await axiosInstance.put(`/users/frnd-req/${requestId}/accept`);
       return res.data;
};

export const getStreamToken=async ()=>{
       const res= await axiosInstance.get(`/chat/token`);
       return res.data;
};