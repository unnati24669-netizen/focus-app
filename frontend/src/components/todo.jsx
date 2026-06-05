import React,{useState,useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { useForm } from "react-hook-form";
import {createTodo,toggle,fetchTodo} from "../slice/todoSlice"

function Card({title,value,description}){
    return(
        <div className="bg-white p-4 rounded-xl shadow-sm min-w-30">
            <div className="text-sm text-gray-500">{title}</div>

            <div className="flex items-center gap-2 mt-2">
                <div className="text-2xl font-semibold">{value}</div>
            </div>

            <div className="text-sm text-gray-400">
                {description}
            </div>
        </div>
    )
}

function AddNew({setshowForm}){
    const dispatch=useDispatch();

    function onSubmit(data){
        dispatch(createTodo(data))
        setshowForm(false)
    }

    const {register,handleSubmit,formState:{errors}}=useForm()

    return(
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-xl w-80 space-y-3 shadow-lg"
            >
                <input 
                    className="w-full border p-2 rounded"
                    placeholder="Enter the title of todo"
                    {...register("title",{ required:"Title of todo is required" })}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title?.message}</p>}

                <input 
                    className="w-full border p-2 rounded"
                    placeholder="Enter the description of todo"
                    {...register("description",{ required:"Description of todo is required" })}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description?.message}</p>}

                <input 
                    type="number"
                    className="w-full border p-2 rounded"
                    placeholder="Enter priority (1-10)"
                    {...register("priority",{ 
                        required:"Priority of todo is required",
                        valueAsNumber:true
                    })}
                />
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority?.message}</p>}

                <button 
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-lg"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default function Todo(){
    const [showForm,setshowForm]=useState(false)
    const todos=useSelector((state)=>state.todos.todos)
    const dispatch=useDispatch()

    useEffect(() => {
    dispatch(fetchTodo())  
}, [dispatch])             

    const total=todos.length
    const done=todos.filter((todo)=>todo.isDone).length
    const pending=total-done

    const newTodos=[...todos].sort((a,b)=>a.priority-b.priority)

    return(
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">My Todos</h1>

                <button 
                    onClick={()=>setshowForm(prev=>!prev)}
                    className="px-4 py-2 bg-black text-white rounded-lg"
                >
                    + Add New
                </button>

                {showForm && <AddNew setshowForm={setshowForm} />}
            </div>

            {/* Cards */}
            <div className="flex gap-4 mb-6">
                <Card title="Total" value={total} description="tasks"/>
                <Card title="Done" value={done} description="completed"/>
                <Card title="Pending" value={pending} description="left"/>
            </div>

            {/* Todo List */}
            <div className="bg-white rounded-xl shadow-sm p-4">

                {newTodos.map((todo,key)=>(
                    <div 
                        key={todo._id}
                        className="flex items-center justify-between py-3 border-b last:border-none hover:bg-gray-50 transition"
                    >

                        {/* Left */}
                        <div className="flex items-center gap-3">

                            <div 
                                onClick={()=>dispatch(toggle(todo._id))}
                                className="cursor-pointer"
                            >
                                {todo.isDone
                                    ? <MdCheckCircle className="text-green-500 text-xl"/>
                                    : <MdRadioButtonUnchecked className="text-gray-400 text-xl"/>
                                }
                            </div>

                            <div className={`text-sm ${
                                todo.isDone ? "line-through text-gray-400" : "text-gray-800"
                            }`}>
                                {todo.title}
                            </div>

                        </div>

                        {/* Priority Badge */}
                        <div>
                            {todo.priority<=3 ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                                    High
                                </span>
                            ) : todo.priority<7 ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                                    Medium
                                </span>
                            ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                                    Low
                                </span>
                            )}
                        </div>

                    </div>
                ))}

            </div>
        </div>
    )
}