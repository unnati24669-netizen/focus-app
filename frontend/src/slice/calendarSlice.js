import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import API from"../API/api"

const initialState={
    calendar:[],
    isLoading:false,
    isError:false

}

//fetch calendar

export const fetchCalendar=createAsyncThunk("calendar/fetch",async(_,thunkAPI)=>{
    try{
        const res=await API.get("/calendar")
        return res.data
    }catch(err){
       return thunkAPI.rejectWithValue(
            err.response?.data||"could not fetch")

    }
         
})

//delete calendar

export const deleteCalendar=createAsyncThunk("calendar/delete",async(id,thunkAPI)=>{
    try{
       const res= await API.delete(`/calendar/${id}`)
       return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data||"could not delete")
    }
})

//create calendar

export const createCalendar=createAsyncThunk("calendar/create",async({title,date,time},thunkAPI)=>{
    try{
         const res=await API.post("/calendar",{
            title,date,time
            
    })
         return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(err.response?.data||"could not create")
    }
})

//update calendar

export const updateCalendar=createAsyncThunk("calendar/update",async({id,title,date,time},thunkAPI)=>{
       try{
             const res=await API.put(`/calendar/${id}`,{
                title,date,time
             })
             return res.data
       }catch(err){
         return thunkAPI.rejectWithValue(err.response?.data||"could not update")
       }
})

export const connectGoogleCalendar=createAsyncThunk("calendar/connect",async(_,thunkAPI)=>{
   try{
      const res=await API.get("/calendar/connect")
      window.location.href=res.data.url//redirecting user to google calendar authentication page

   }catch(err){
      return thunkAPI.rejectWithValue(err.response?.data||"could not connect")

   }
})

export const calendarSlice=createSlice({
    name:"calendar",
    initialState,
    extraReducers:(builder)=>{
         builder
         //fetch calendar 
         .addCase(fetchCalendar.pending,(state,action)=>{
            state.isLoading=true
         })
         .addCase(fetchCalendar.fulfilled,(state,action)=>{
            state.isLoading=false
                if(Array.isArray(action.payload)){
                    state.calendar=action.payload
                }else if(Array.isArray(action.payload.calendar)){
                    state.calendar=action.payload.calendar
                }else{
                    state.calendar=[]
                    state.isError=true
                }
           

                
         })
         .addCase(fetchCalendar.rejected,(state,action)=>{
            state.isError=true
            state.isLoading=false
         })

         //create calendar
         .addCase(createCalendar.pending,(state,action)=>{
            state.isLoading=true
         })
         .addCase(createCalendar.fulfilled,(state,action)=>{
            state.isLoading=false
            state.calendar.push(action.payload)
              
         })
         .addCase(createCalendar.rejected,(state,action)=>{
            state.isError=true
            state.isLoading=false
         })

         //update calendar
         .addCase(updateCalendar.pending,(state,action)=>{
            state.isLoading=true
         })
         .addCase(updateCalendar.fulfilled,(state,action)=>{
            state.isLoading=false
            state.calendar=state.calendar.map((calendar)=>
            calendar._id===action.payload._id?action.payload:calendar)
         })
         .addCase(updateCalendar.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
         })

         //delete calendar
         .addCase(deleteCalendar.pending,(state,action)=>{
            state.isLoading=true
         })
         .addCase(deleteCalendar.fulfilled,(state,action)=>{
            state.isLoading=false
             state.calendar=state.calendar.filter((calendar)=>calendar._id!=action.payload._id)
         })
         .addCase(deleteCalendar.rejected,(state,action)=>{
            state.isLoading=false


            state.isError=true
         })
    }

})
export default calendarSlice.reducer