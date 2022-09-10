import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from "react-router-dom";
import EmployeeService from '../services/EmployeeService';

const columns = [
  {
    title: 'ID',
    field: 'id'
  },
  {
    title: 'First Name',
    field: 'firstName'
  },
  {
    title: 'Last Name',
    field: 'lastName'
  },
  {
    title: 'Phone Number',
    field: 'phone'
  },
  {
    title: 'Gender',
    field: 'gender'
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default function EmployeeList() {
  const classes = useStyles();
  const history = useHistory();

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    retrieveEmployees();
  }, [])

  const retrieveEmployees = () => {
    EmployeeService.getAll()
      .then(response => {
        setEmployees(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const deleteEmployee = (id) => {
    EmployeeService.remove(id)
      .then(response => {
        const newEmployees = employees.filter(e => e.id !== id)
        setEmployees(newEmployees)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div>
      <Button
        className={classes.root}
        variant="outlined"
        color="primary"
        component={Link}
        to='/employee/add'>
        Add Employee
      </Button>
      <MaterialTable
        title={'Employee List'}
        columns={columns}
        data={employees}
        options={{
          paging: false,
          search: false,
          actionsColumnIndex: -1
        }}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit Employee',
            onClick: (event, rowData) => history.push(`/employee/edit/${rowData.id}`)
          },
          rowData => ({
            icon: 'delete',
            tooltip: 'Delete Employee',
            onClick: (event, rowData) => deleteEmployee(rowData.id),
          })
        ]}
      />
    </div>
  )
}
