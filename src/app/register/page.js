'use client'

import * as React from 'react';
import { useEffect, useState } from 'react'; // Import useState
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const theme = createTheme(); // Define the theme at the top level

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

async function runDBCallAsync(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.data === "true") {
    console.log("registered");
  } else {
    console.log("not registered ");
  }
}

export default function Register() {
  const [open, setOpen] = React.useState(false);
  const [errorHolder, setErrorHolder] = React.useState('');

  const validateForm = (event) => {
    let errorMessage = '';
    const data = new FormData(event.currentTarget);
    // get the email
    let email = data.get('email');
    // pull in the validator
    var validator = require("email-validator");
    // run the validator
    let emailCheck = validator.validate(email);
    // if it is false, add to the error message.
    if (!emailCheck) {
      errorMessage += 'No e-mail';
    }
    return errorMessage;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // call our custom validator
    let errorMessage = validateForm(event);
    // save the message
    setErrorHolder(errorMessage);
    // if we have an error
    if (errorMessage.length > 0) {
      setOpen(true);
    } else {
      // if we do not get an error
      const data = new FormData(event.currentTarget);
      let email = data.get('email');
      let pass = data.get('password');
      let dob = data.get('dob');
      console.log("Sent email:" + email);
      console.log("Sent pass:" + pass);
      console.log("Sent dob:" + dob);
      console.log("calling db");
      runDBCallAsync(`api/register?email=${email}&pass=${pass}&dob=${dob}`);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Error"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {errorHolder}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="dob"
              label="Date of Birth"
              type="text"
              id="dob"
              autoComplete=""
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Link href="http://localhost:3000" variant="body2">
                  {"Have an account? Log in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}