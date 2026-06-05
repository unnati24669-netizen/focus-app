import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API/api"

const initialState={
    notes:[],
    isLoading:false,
    isError:false

    
}

//creating note
export const createnote=createAsyncThunk("notes/createnote",async(text,thunkAPI)=>{
    try{
        const res=await API.post("/notes",text);
        return res.data
    }
    catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"note could not be created"
        )
    }
    

})

//fetching note

export const fetchNote=createAsyncThunk("notes/fetch",async(_,thunkAPI)=>{
    try{
        const res=await API.get("/notes");
        return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"could not fetch note");
    }

})

//updating note

export const updatingNote=createAsyncThunk("notes/update",async({id,title,description},thunkAPI)=>{
    try{
        const res=await API.put(`/notes/${id}`,{title,description});
        return res.data;
    }catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"could not update note")
    }
})


//delete note

export const deleteNote=createAsyncThunk("notes/delete",async(id,thunkAPI)=>{
    if(!id){
        return thunkAPI.rejectWithValue("note id is not given")
    }

    try{
        const res=await API.delete(`/notes/${id}`);
        return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"could not delete note"
        )
    }



})

 




export const noteslice=createSlice({
    name:"notes",
    initialState,
    extraReducers:(builder)=>{
        builder
        //create note
        .addCase(createnote.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(createnote.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.notes.push(action.payload)
        })
        .addCase(createnote.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        //fetch note
        .addCase(fetchNote.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(fetchNote.fulfilled,(state,action)=>{
            state.isLoading=false
            if(Array.isArray(action.payload)){
                  state.notes=action.payload;
            }else if(Array.isArray(action.payload.notes)){
                state.notes=action.payload.notes;

            }else{
                state.notes=[]
            }
        })
        .addCase(fetchNote.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        //update note
        .addCase(updatingNote.pending,(state,action)=>{
            state.isLoading=true;
            

        })
        .addCase(updatingNote.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.notes= state.notes.map((note)=>
                note._id===action.payload._id?note=action.payload:note
            
        )})
        .addCase(updatingNote.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })

        

       

        //delete note

        .addCase(deleteNote.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(deleteNote.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.notes=state.notes.filter((note)=>
                note._id!=action.payload._id
            )
        })
        .addCase(deleteNote.rejected,(state,action)=>{
            state.isError=true;
            state.isLoading=false;
        })

    


    }
})

export default noteslice.reducer;