import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EmployeeService from "../../services/EmployeeService";

const initialState = {
  employees: [],
  status: 'idle',
  error: null
}

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await EmployeeService.getAll()
  return response.data
})

export const addNewEmployee = createAsyncThunk('employees/AddNewEmployee',
  async payload => {
    const response = await EmployeeService.create(payload)
    return response.data
})

export const updateEmployee = createAsyncThunk('employees/UpdateEmployee',
  async (payload) => {
    const { id, ...employee} = payload
    const response = await EmployeeService.update(id, employee)
    return response.data
})

export const deleteEmployee = createAsyncThunk('employees/DeleteEmployee',
  async (payload) => {
    const { id } = payload
    await EmployeeService.remove(id)
    return { id }
})

export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEmployees.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.employees = state.employees.concat(action.payload)
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    builder.addCase(addNewEmployee.fulfilled, (state, action) => {
      state.employees.push(action.payload)
    })
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      const { id, firstName, lastName, gender, email, phone } = action.payload
      const existingEmployee = state.employees.find(employee => employee.id === id)
      if (existingEmployee) {
        existingEmployee.firstName = firstName
        existingEmployee.lastName = lastName
        existingEmployee.gender = gender
        existingEmployee.email = email
        existingEmployee.phone = phone
      }
    })
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      state.employees = state.employees.filter(employee => employee.id !== action.payload.id)
    })
  }
})

export default employeesSlice.reducer

export const selectAllEmployees = state => state.employee.employees

export const selectEmployeeById = (state, employeeId) =>
  state.employee.employees.find(employee => employee.id === employeeId);
