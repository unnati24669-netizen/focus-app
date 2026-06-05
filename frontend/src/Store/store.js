import {configureStore} from "@reduxjs/toolkit"
import authReducer  from "../slice/authSlice"
import todoReducer from "../slice/todoSlice"
import calendarReducer from "../slice/calendarSlice"
import noteReducer from "../slice/noteSlice"



export const store=configureStore({
    reducer:{auth:authReducer, todos:todoReducer, calendar:calendarReducer, notes:noteReducer}
})

export default store
  