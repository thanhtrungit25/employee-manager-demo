import React from 'react';
import { Switch, Route, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import AddEditEmployee from './components/AddEditEmployee';
import EmployeeList from './components/EmployeeList';

import './styles.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component={Link} to='/'>
            Employee Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/employees"]} component={EmployeeList} />
          <Route exact path="/employee/add" component={AddEditEmployee} />
          <Route path="/employee/edit/:id" component={AddEditEmployee} />
        </Switch>
      </div>
    </div>
  );
}
