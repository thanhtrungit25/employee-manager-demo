import { configureStore } from '@reduxjs/toolkit'
import employeesReducer from './features/employee/employeeSlice'

export default configureStore({
  reducer: {
    employee: employeesReducer
  }
})
