import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import API from "../API/api"
const initialState={
    token:localStorage.getItem("token")||null,
    isLoading:false,
    isError:false
}

//signup
export const signup=createAsyncThunk("/signup",async({email,firstName,lastName,password},thunkAPI)=>{
   try{
      const res=await API.post("/user/signup",{
        email,firstName,lastName,password
      })
      return res.data
   }catch(err){
    return thunkAPI.rejectWithValue(err.response?.data||"could not signup")
   }
})

//signin

export const signin=createAsyncThunk("user/signin",async({email,password},thunkAPI)=>{
    try{
        const res=await API.post("/user/signin",{email,password})
        localStorage.setItem("token", res.data.token)
        return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data||"could not signin")
    }

})


export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state,action)=>{
          localStorage.removeItem("token")
          state.token=null
            state.isError=false
    }
},
    extraReducers:(builder)=>{
        builder
        //signup
        .addCase(signup.pending,(state,action)=>{
             state.isLoading=true
        })
        .addCase(signup.fulfilled,(state,action)=>{
            state.isLoading=false
            
        })
        .addCase(signup.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
        })

        //signin
        .addCase(signin.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(signin.fulfilled,(state,action)=>{
            state.isLoading=false
            state.token=action.payload.token




        })
        .addCase(signin.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
        })
    }
})

export default authSlice.reducer
export const {logout}=authSlice.actions