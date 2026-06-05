import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Calendar from "./components/calendar.jsx"
import Login from "./components/login.jsx"

import Signup from "./components/signup.jsx"
import Todo from "./components/todo.jsx"

import Layout from "./layout.jsx"
import Notes from "./components/notes.jsx"
import {RouterProvider,Route,createBrowserRouter,createRoutesFromElements,Navigate} from 'react-router-dom'
import {useSelector} from "react-redux"
import { Provider } from 'react-redux'
import {store} from "./Store/store.js"
import "./index.css"
function ProtectedRoute({children}){
  const token=useSelector((state)=>state.auth.token);
  return(token?children:<Navigate to="/login"/>)

}

const router=createBrowserRouter(
  createRoutesFromElements(
   <>
    <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/" element={
        <ProtectedRoute><Layout/></ProtectedRoute>
      }>
        <Route index element={<Todo/>}/>
      <Route path="todo" element={<Todo/>}/>
      <Route path="notes" element={<Notes/>}/>

      <Route path="calendar" element={<Calendar/>}/>
      
      </Route>
   </>
      
      
      
       


  )
)

createRoot(document.getElementById('root')).render(
  
    <StrictMode>
      <Provider store={store}><RouterProvider router={router}/></Provider>
    
  </StrictMode>,
  
  
)
