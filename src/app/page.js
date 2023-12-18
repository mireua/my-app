'use client'

import * as React from 'react';
import { useEffect } from 'react';
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
import { serialize } from 'cookie';

const theme = createTheme();

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
  try {
    const res = await fetch(url);

    if (!res.ok) {
      // Handle non-OK response (e.g., HTTP error)
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    if (data.data === "valid") {
      return { status: "authenticated" };
    } else {
      return { status: "failed" };
    }
  } catch (error) {
    // Handle other errors, including network errors
    console.error("Error fetching data:", error);
    return { status: "error" };
  }
}

export default function SignIn() {
  const [open, setOpen] = React.useState(false);
  const [errorHolder, setErrorHolder] = React.useState('');

  const validateForm = (event) => {
    let errorMessage = '';
    const data = new FormData(event.currentTarget);
    let email = data.get('email');
    let pass = data.get('password');

    var validator = require("email-validator");
    let emailCheck = validator.validate(email);

    if (!emailCheck) {
      errorMessage += 'Incorrect email';
    }

    if (pass.length === 0) {
      errorMessage += ' No password added';
    }

    return errorMessage;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errorMessage = validateForm(event);
    setErrorHolder(errorMessage);

    if (errorMessage.length > 0) {
      setOpen(true);
    } else {
      const data = new FormData(event.currentTarget);
      let email = data.get('email');
      let pass = data.get('password');

      const response = await runDBCallAsync(`api/login?email=${email}&pass=${pass}`);

      if (response.status === "authenticated") {
        // Set the 'auth' cookie to 'true' if login is successful
        const serializedCookie = serialize('auth', 'true', {
          path: '/', // Set the appropriate path
          maxAge: 60 * 60 * 24, // 1 day in seconds
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set secure to true in production
          sameSite: 'strict',
        });

        // Set the cookie
        document.cookie = serializedCookie;

        window.location.href = '/dashboard';
      }
    }
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
            Sign in
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
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
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