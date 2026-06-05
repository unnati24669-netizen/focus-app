import React,{useState} from "react"
import { useNavigate } from "react-router-dom"
import {useForm} from "react-hook-form"
import API from "../API/api"

export default function Login(){
    const {register,handleSubmit,formState:{errors}}=useForm()
    const navigate=useNavigate()
    const [error,setError]=useState("")

    const onSubmit=async(data)=>{
        try{
            setError("")
            const res=await API.post("/user/signin",{
                email:data.email,
                password:data.password,
            })
            localStorage.setItem("token", res.data.token)
            navigate("/")


        }catch(err){
            setError(err.message)



        }

    }
    return (
<>
     <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3]">

  {/* Card */}
  <div className="bg-[#f1efeb] border border-gray-300 rounded-xl p-8 w-full max-w-md">

    {/* Heading */}
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
      Login
    </h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* API Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#7aa89f]"
          {...register("email", {
            required: "Email is required",
          })}
        />
        {errors.email && (
          <p className="text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <input
          type="password"
          placeholder="Enter your password"
          className="px-4 py-2 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#7aa89f]"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-[#d6e3df] text-gray-800 hover:bg-[#c7d7d2] transition"
      >
        Login
      </button>

      {/* Footer */}
      <p className="text-sm text-gray-600 text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-[#7aa89f] cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>

    </form>
  </div>
</div>

</>
    )

}