import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from "react-router-dom";

import { selectAllEmployees, fetchEmployees, deleteEmployee } from '../features/employee/employeeSlice'

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
  const dispatch = useDispatch();

  const employees = useSelector(selectAllEmployees)
  const data = employees.map(o => ({ ...o }));
  const employeeStatus = useSelector(state => state.employee.status)

  useEffect(() => {
    if (employeeStatus === 'idle') {
      dispatch(fetchEmployees())
    }
  }, [employeeStatus, dispatch])

  let content
  if (employeeStatus === 'loading') {
    content = <div>Loading</div>;
  } else if (employeeStatus === 'succeeded') {
    content = (
      <>
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
          data={data}
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
              onClick: (event, rowData) => hanldeDelete(rowData.id),
            })
          ]}
        />
      </>
    )
  } else if (employeeStatus === 'failed') {
    content = <div>error</div>
  }

  const hanldeDelete = async (id) => {
    console.log('hanldeDelete', id);
    // eslint-disable-next-line no-restricted-globals
    var result = confirm("Want to delete?");
    if (result) {
        try {
          await dispatch(deleteEmployee({ id })).unwrap()
        } catch (e) {
          console.log(e);
        }
    }
  }

  return (
    <div>
      {content}
    </div>
  )
}
