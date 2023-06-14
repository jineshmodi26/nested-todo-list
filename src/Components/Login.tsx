import React, { useContext, useEffect, useState } from 'react';
import { Button, TextField, Typography, Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../API/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import {MyContext} from "../App"
import userTodoList from "../database/users.json"
import { Skeleton } from "antd"

interface UserData {
  username: string;
}

const theme = createTheme();

const Login: React.FC = () => {

  const contextData = useContext<any>(MyContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    setLoading(false)

    const token = localStorage.getItem("token")
    if (token) {
      const data: UserData = jwt_decode(token)
      if (data?.username) {
        navigate("/")
      }
    } else{
      setLoading(true)
    }

  }, [])

  const navigate = useNavigate()
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const validationErrors: { [key: string]: string } = {};
    if (!username) {
      validationErrors.username = 'Please enter your username';
    }
    if (!password) {
      validationErrors.password = 'Please enter your password';
    }

    if (Object.keys(validationErrors).length === 0) {
      login(username.trim(), password).then((response: any) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token)
          contextData.setUser({
            username : username,
            todos : userTodoList.users.find((user) => user.username === username)?.todos
          })
          navigate("/")
        } else {
          toast.error(response.data.error.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    } else {
      setErrors(validationErrors);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setErrors((prevErrors) => {
      return { ...prevErrors, [name]: '' };
    });
  };

  return <>
    {
      loading ? <ThemeProvider theme={theme}>
        <Container maxWidth="xs">
          <Box sx={{ marginTop: 8 }}>
            <Typography component="h1" variant="h5" align="center">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: 3 }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                name="username"
                label="Username"
                autoFocus
                error={!!errors.username}
                helperText={errors.username}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password}
                onChange={handleInputChange}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 3 }}>
                Log in
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider> : <Skeleton active />
    }
  </>
};

export default Login;
