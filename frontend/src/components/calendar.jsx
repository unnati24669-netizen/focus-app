import React from 'react';
import {useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { fetchCalendar,updateCalendar,deleteCalendar,createCalendar,connectGoogleCalendar } from '../slice/calendarSlice';

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import {useForm} from "react-hook-form"
import { useLocation } from 'react-router-dom';


function NewEvent({showForm,setShowForm}){
    const dispatch=useDispatch()

    function onSubmit(data){
        dispatch(createCalendar(data)).then(()=>{dispatch(fetchCalendar())})
        setShowForm(false)
    }

    const {register,handleSubmit,formState:{errors}}=useForm()

    return(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-semibold text-stone-700 mb-4">New Event</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <input type="text" placeholder="Event title"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("title",{required:"Title is required"})}/>
                        {errors.title&&<p className="text-red-400 text-xs mt-1">{errors.title?.message}</p>}
                    </div>
                    <div>
                        <input type="date"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("date",{required:"Date is required"})}/>
                        {errors.date&&<p className="text-red-400 text-xs mt-1">{errors.date?.message}</p>}
                    </div>
                    <div>
                        <input type="time"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("time",{required:"Time is required"})}/>
                        {errors.time&&<p className="text-red-400 text-xs mt-1">{errors.time?.message}</p>}
                    </div>
                    <div className="flex gap-2 justify-end mt-1">
                        <button type="button" onClick={()=>setShowForm(false)}
                            className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-xl transition-colors">
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function EditEvent({event,setEditingForm}){
    const dispatch=useDispatch();

    function onSubmit(data){
        dispatch(updateCalendar({id:event._id,title:data.title,date:data.date,time:data.time})).then(dispatch(fetchCalendar()))
        setEditingForm(null)
    }
    const {register,handleSubmit,formState:{errors}}=useForm({
        defaultValues:{
            title:event.title,
            date:event.date.slice(0,10),
            time:event.time 
        }
    })

    function deleting(){
        dispatch(deleteCalendar(event._id)).then(()=>dispatch(fetchCalendar()))
        setEditingForm(null)
    }

    return(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-semibold text-stone-700 mb-4">Edit Event</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <input type="text"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("title",{required:"Title is required"})}/>
                        {errors.title&&<p className="text-red-400 text-xs mt-1">{errors.title?.message}</p>}
                    </div>
                    <div>
                        <input type="date"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("date",{required:"Date is required"})}/>
                        {errors.date&&<p className="text-red-400 text-xs mt-1">{errors.date?.message}</p>}
                    </div>
                    <div>
                        <input type="time"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("time",{required:"Time is required"})}/>
                        {errors.time&&<p className="text-red-400 text-xs mt-1">{errors.time?.message}</p>}
                    </div>
                    <div className="flex gap-2 justify-end mt-1">
                        <button type="button" onClick={()=>setEditingForm(null)}
                            className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors">
                            Cancel
                        </button>
                        <button type="button" onClick={deleting}
                            className="px-4 py-2 text-sm text-red-400 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
                            Delete
                        </button>
                        <button type="submit"
                            className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-xl transition-colors">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function Calendar(){
    const location=useLocation()
    const [connected,setConnected]=useState(false)

    useEffect(()=>{
        const params=new URLSearchParams(location.search)
        if(params.get("connected")==="true"){
            setConnected(true)
            setTimeout(()=>setConnected(false),3000)
        }
    },[location.search])

    const [showForm,setShowForm]=useState(false)
    const [editingForm,setEditingForm]=useState(null)
    const dispatch=useDispatch()

    const events=useSelector((state) => state.calendar.calendar)
    useEffect(()=>{
        dispatch(fetchCalendar())
    },[dispatch])

    const formatEvents=events.map((event)=>({
        id:event._id,
        title:event.title,
        start:`${event.date.slice(0,10)}T${event.time}:00`,
    }))

    function HandleEventClick(info){
        const clicked=events.find((event)=>event._id===info.event.id)
        if(clicked)setEditingForm(clicked)
    }

    return(
        <div className="min-h-screen bg-stone-50 px-8 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-stone-700">Calendar</h1>
                <div className="flex gap-3">
                    <button
                        onClick={()=>dispatch(connectGoogleCalendar())}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm text-stone-600 hover:border-teal-400 hover:text-teal-600 shadow-sm transition-all">
                        🗓 Connect Google Calendar
                    </button>
                    <button
                        onClick={()=>setShowForm(prev=>!prev)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm text-stone-600 hover:border-teal-400 hover:text-teal-600 shadow-sm transition-all">
                        + Add Event
                    </button>
                </div>
            </div>

            {/* Success message */}
            {connected&&(
                <div className="mb-4 px-4 py-3 bg-teal-50 border border-teal-200 text-teal-700 text-sm rounded-xl">
                    ✅ Google Calendar connected successfully!
                </div>
            )}

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
                <FullCalendar
                    plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
                    initialView='dayGridMonth'
                    headerToolbar={{
                        left:"prev,next today",
                        center:"title",
                        right:"dayGridMonth,timeGridWeek"
                    }}
                    events={formatEvents}
                    eventClick={HandleEventClick}
                    height="auto"
                    eventColor="#14b8a6"/>
            </div>

            {/* Modals */}
            {showForm&&<NewEvent showForm={showForm} setShowForm={setShowForm}/>}
            {editingForm&&<EditEvent event={editingForm} setEditingForm={setEditingForm}/>}
        </div>
    )
}