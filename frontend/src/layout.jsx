import { Outlet } from "react-router-dom";
import {useState} from "react"
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/sidebar"




export default function Layout(){
     const [showSidebar,setSidebar]=useState(false);
    
    return(
        <>
        <div className="flex">
            <button onClick={()=>setSidebar(prev=>!prev)} className="fixed left-4 top-4 z-50 text-2xl "><FaBars/></button>
            <div className={`fixed top-0 left-0 h-full w-64 bg-amber-300 text-black transform transition-transform duration-300 ${showSidebar?"translate-x-0":"-translate-x-full"}`}>
                <Sidebar/>

            </div>
            <div className={`flex-1 transition-all duration-300 ${showSidebar?"ml-64":"ml-0"}`}>
                <Outlet/>


            </div>
        </div>
          
        </>
    )

}