import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import API from "../API/api"

const initialState={
    todos:[],
    isLoading:false,
    isError:false

    
}

//creating todo
export const createTodo=createAsyncThunk("todo/createtodo",async(todoData,thunkAPI)=>{
    try{
        const res=await API.post("/todo",todoData);
        return res.data
    }
    catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"todo could not be created"
        )
    }
    

})

//fetching todo

export const fetchTodo=createAsyncThunk("todo/fetch",async(_,thunkAPI)=>{
    try{
        const res=await API.get("/todo");
        return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"could not fetch todo");
    }

})

//updating todo

export const updatingTodo=createAsyncThunk("todo/update",async({title,description,isDone,priority},thunkAPI)=>{
    try{
        const res=await API.put(`/todo/${id}`,{id,title,description,isDone,priority});
        return res.data;
    }catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"could not update todo")
    }
})


//delete todo

export const deleteTodo=createAsyncThunk("/todo/delete",async(id,thunkAPI)=>{
    if(!id){
        return thunkAPI.rejectWithValue("todo id is not given")
    }

    try{
        const res=await API.delete(`/todo/${id}`);
        return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"could not delete todo"
        )
    }



})

//toggle 

export const toggle=createAsyncThunk("/todo/toggle",async(id,thunkAPI)=>{
    if(!id){
        return thunkAPI.rejectWithValue("todo id is not specified");

    }
    try{
        const res=await API.patch(`/todo/${id}`);
        return res.data
    }catch(err){
        return thunkAPI.rejectWithValue(
            err.response?.data||"could not toggle todo"
        )
    }

})


export const todoslice=createSlice({
    name:"todos",
    initialState,
    extraReducers:(builder)=>{
        builder
        //create todo
        .addCase(createTodo.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(createTodo.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.todos.push(action.payload)
        })
        .addCase(createTodo.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        //fetch todo
        .addCase(fetchTodo.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(fetchTodo.fulfilled,(state,action)=>{
            state.isLoading=false
            if(Array.isArray(action.payload)){
                  state.todos=action.payload;
            }else if(Array.isArray(action.payload.todos)){
                state.todos=action.payload.todos;

            }else{
                state.todos=[]
            }
        })
        .addCase(fetchTodo.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        //update todo
        .addCase(updatingTodo.pending,(state,action)=>{
            state.isLoading=true;
            

        })
        .addCase(updatingTodo.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.todos= state.todos.map((todo)=>
                todo._id===action.payload._id?todo=action.payload:todo
            
        )})
        .addCase(updatingTodo.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })

        //toggle todo

        .addCase(toggle.pending,(state,action)=>{
            state.isLoading=true;


        })
        .addCase(toggle.fulfilled,(state,action)=>{
            state.isLoading=false;
           state.todos= state.todos.map((todo)=>
                todo._id===action.payload._id?action.payload:todo

            )
        })
        .addCase(toggle.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })

        //delete todo

        .addCase(deleteTodo.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(deleteTodo.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.todos=state.todos.filter((todo)=>
                todo._id!=action.payload._id
            )
        })
        .addCase(deleteTodo.rejected,(state,action)=>{
            state.isError=true;
            state.isLoading=false;
        })

    


    }
})

export default todoslice.reducer;