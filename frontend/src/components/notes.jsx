import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { createnote, fetchNote, updatingNote, deleteNote } from "../slice/noteSlice"

function AddNew({ showForm, setshowForm }) {
    const dispatch = useDispatch();
    function onSubmit(data) {
        dispatch(createnote(data))
        setshowForm(false)
    }
    const { register, handleSubmit, formState: { errors } } = useForm()
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-semibold text-stone-700 mb-4">New Note</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <input
                            placeholder="Title"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title?.message}</p>}
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            rows={4}
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                            {...register("description", { required: "Description is required" })}
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description?.message}</p>}
                    </div>
                    <div className="flex gap-2 justify-end mt-1">
                        <button
                            type="button"
                            onClick={() => setshowForm(false)}
                            className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-xl transition-colors"
                        >
                            Save Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function Updating({ editingNote, seteditingNote }) {
    const dispatch = useDispatch();
    function onSubmit(data) {
        dispatch(updatingNote({ id: editingNote._id, ...data }))
        seteditingNote(null)
    }
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: editingNote.title,
            description: editingNote.description
        }
    })
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-semibold text-stone-700 mb-4">Edit Note</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <input
                            placeholder="Title"
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title?.message}</p>}
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            rows={4}
                            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                            {...register("description", { required: "Description is required" })}
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description?.message}</p>}
                    </div>
                    <div className="flex gap-2 justify-end mt-1">
                        <button
                            type="button"
                            onClick={() => seteditingNote(null)}
                            className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-xl transition-colors"
                        >
                            Update Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function Notes() {
    const [showForm, setshowForm] = useState(false)
    const [editingNote, seteditingNote] = useState(null)
    const notes = useSelector((state) => state.notes.notes)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchNote())
    }, [dispatch])

    return (
        <div className="min-h-screen bg-stone-50 px-8 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-stone-700">My Notes</h1>
                <button
                    onClick={() => setshowForm(prev => !prev)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm text-stone-600 hover:border-teal-400 hover:text-teal-600 shadow-sm transition-all"
                >
                    <span className="text-lg leading-none">+</span> Add new
                </button>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                    <div
                        key={note._id}
                        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-3 group hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-stone-700 text-base">{note.title}</h3>
                        <p className="text-stone-500 text-sm leading-relaxed flex-1">{note.description}</p>

                        {/* Action buttons — visible on hover */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                            <button
                                onClick={() => seteditingNote(note)}
                                className="px-3 py-1.5 text-xs text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => dispatch(deleteNote(note._id))}
                                className="px-3 py-1.5 text-xs text-red-400 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {showForm && <AddNew showForm={showForm} setshowForm={setshowForm} />}
            {editingNote && <Updating editingNote={editingNote} seteditingNote={seteditingNote} />}
        </div>
    )
}