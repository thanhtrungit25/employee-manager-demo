import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormTextField from './TextField';
import EmployeeService from '../services/EmployeeService';
import { addNewEmployee, updateEmployee } from '../features/employee/employeeSlice';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const validate = (value) => {
  if (value === undefined || value === '')
    return 'Please enter phone'
  const matches = value.match(
    /^(?:0\.(?:0[0-9]|[0-9]\d?)|[0-9]\d*(?:\.\d{1,2})?)(?:e[+-]?\d+)?$/
  );
  return matches?.length > 0 || "Not a Number";
};

export default function AddEmployee({ history, match }) {
  const dispatch = useDispatch()
  const classes = useStyles();
  const { id } = match.params
  const isAddMode = !id;

  const [submitted, setSubmitted] = useState(false);
  const { handleSubmit, setValue, control, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isAddMode) {
      EmployeeService.get(id).then(response => {
        const fields = ['id', 'firstName', 'lastName', 'email', 'phone', 'gender']
        fields.forEach(field => setValue(field, response.data[field]))
      })
    }
  }, [id, isAddMode, setValue])

  const onSubmit = (data) => {
    return isAddMode
      ? add(data)
      : update(id, data)
  }

  const add = async (data) => {
    try {
      setSubmitted(true)
      await dispatch(addNewEmployee({ ...data })).unwrap()
      history.push('/')
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitted(false)
    }
  }

  const update = async (id, data) => {
    console.log('update', id, data)
    try {
      setSubmitted(true)
      await dispatch(updateEmployee({ id, ...data })).unwrap()
      history.push('/')
    } catch (e) {
      console.log(e);
      return
    } finally {
      setSubmitted(false)
    }
  }

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          {isAddMode ? 'Add Employee' : 'Edit Employee'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormTextField
            name='firstName'
            id='firstName'
            label='First Name'
            fullWidth
            control={control}
            rules={{
              minLength: { value: 6, message: 'Min character 6' },
              maxLength: { value: 10, message: 'Max character 10' }
            }}
          />
          <FormTextField
            name='lastName'
            id='lastName'
            label='Last Name'
            fullWidth
            control={control}
            rules={{
              minLength: { value: 6, message: 'Min character 6' },
              maxLength: { value: 10, message: 'Max character 10' }
            }}
          />
          <FormTextField
            name='email'
            type='email'
            id='email'
            label='Email Address'
            placeholder="john@doe.com"
            aria-invalid={errors.email ? "true" : "false"}
            fullWidth
            control={control}
            rules={{
              required: 'Email is required'
            }}
          />
          <FormTextField
            name='phone'
            id='phone'
            label='Phone Number'
            fullWidth
            control={control}
            rules={{ validate }}
          />
          <Controller
            name='gender'
            control={control}
            defaultValue='male'
            render={({ field: { onChange, value } }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={value} onChange={onChange}>
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
            )}
          >
          </Controller>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={submitted}
          >
            {isAddMode ? 'Add' : 'Update'}
          </Button>
        </form>
      </Container>
    </>
  )
}
