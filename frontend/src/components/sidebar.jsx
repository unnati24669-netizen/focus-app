import React from 'react'
import { NavLink } from 'react-router-dom'

const activestyle = ({ isActive }) =>
  isActive
    ? "bg-teal-100 text-teal-700 font-medium"
    : "text-gray-600 hover:bg-gray-100";

export default function SideBar() {
  return (
    <>
      <div className="w-64 h-screen bg-stone-100 border-r border-gray-200 p-6 flex flex-col">
        
        <div className="text-4xl italic font-serif text-gray-800 mb-12">
          focus.
        </div>

        <nav className="flex flex-col gap-2">

          <NavLink
            to="/todo"
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl transition-all duration-200 ${activestyle({
                isActive,
              })}`
            }
          >
            Todos
          </NavLink>

          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl transition-all duration-200 ${activestyle({
                isActive,
              })}`
            }
          >
            Notes
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl transition-all duration-200 ${activestyle({
                isActive,
              })}`
            }
          >
            Calendar
          </NavLink>

        </nav>

        <div className="mt-auto border-t border-gray-200 pt-4" />
      </div>
    </>
  )
}