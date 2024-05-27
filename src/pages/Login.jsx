import React, { useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material"
import { CameraAlt as CameraAltIcon } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp'
import { usernameValidator } from '../utils/validatiors';
import { useDispatch } from "react-redux";
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../constants/config';

const Login = () => {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useStrongPassword();



    const toggleLogin = () => setIsLogin(prev => !prev);
    const avatar = useFileHandler("single", 2);

    const handleLogin = async (e) => {

        e.preventDefault();

        const toastId = toast.loading("Logging In...");

        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/login`,
                {
                    username: username.value,
                    password: password.value,
                },
                config
            );
            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", {
                id: toastId,
            });
        } finally {
            setIsLoading(false);
        }

    };


    const handleSignUp = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Signing Up...");
        setIsLoading(true);

        const formData = new FormData();
        formData.append("avatar", avatar.file);
        formData.append("name", name.value);
        formData.append("bio", bio.value);
        formData.append("username", username.value);
        formData.append("password", password.value);

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/new`,
                formData,
                config
            );

            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", {
                id: toastId,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container
            component={"main"}
            maxWidth="xs"
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Paper elevation={3}
                sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                {
                    isLogin ?
                        <>
                            <Typography variant='h5'>Login</Typography>
                            <form style={{
                                width: "100%",
                                marginTop: "1 rem"
                            }}
                                onSubmit={handleLogin}
                            >
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin='normal'
                                    variant='outlined'
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />

                                {
                                    username.error && (
                                        <Typography color="error" variant='caption'>
                                            {username.error}
                                        </Typography>
                                    )
                                }


                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    type='password'
                                    margin='normal'
                                    variant='outlined'
                                    value={password.value}
                                    onChange={password.changeHandler}
                                />



                                <Button
                                    fullWidth
                                    sx={{ marginTop: "1rem" }}
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    disabled={isLoading}
                                    style={{ backgroundColor: "#25D366" }}
                                >Login</Button>

                                <Typography
                                    textAlign={"center"}
                                    m={"1rem"}
                                >Or</Typography>

                                <Button
                                    fullWidth
                                    variant='text'
                                    onClick={toggleLogin}
                                    disabled={isLoading}
                                >
                                    Register
                                </Button>

                            </form>
                        </>
                        :
                        <>
                            {/* <Typography variant='h5'>Sign Up</Typography> */}
                            <form style={{
                                width: "100%",
                                // marginTop: "1 rem"
                            }}
                                onSubmit={handleSignUp}
                            >

                                <Stack
                                    position={"relative"}
                                    width={"7rem"}
                                    margin={"auto"}
                                >
                                    <Avatar
                                        sx={{
                                            width: "7rem",
                                            height: "7rem",
                                            objectFit: "contain"
                                        }}
                                        src={avatar.preview}
                                    />

                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            bottom: "0",
                                            right: "0",
                                            bgcolor: "rgba(225,225,225,0.5)",
                                            ":hover": {
                                                bgcolor: "rgba(0,0,0,0.7)"
                                            }
                                        }}
                                        component="label"
                                    >
                                        <>
                                            <CameraAltIcon />
                                            <VisuallyHiddenInput type='file'
                                                onChange={avatar.changeHandler} />
                                        </>
                                    </IconButton>
                                </Stack>

                                {
                                    avatar.error && (
                                        <Typography
                                            m={"1 rem auto"}
                                            width={"fit-content"}
                                            display={"block"}
                                            color="error"
                                            variant='caption'
                                        >
                                            {avatar.error}
                                        </Typography>
                                    )
                                }

                                <TextField
                                    required
                                    fullWidth
                                    label="Name"
                                    margin='normal'
                                    variant='outlined'
                                    value={name.value}
                                    onChange={name.changeHandler}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    label="Bio"
                                    margin='normal'
                                    variant='outlined'
                                    value={bio.value}
                                    onChange={bio.changeHandler}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin='normal'
                                    variant='outlined'
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />

                                {
                                    username.error && (
                                        <Typography color="error" variant='caption'>
                                            {username.error}
                                        </Typography>
                                    )
                                }


                                <TextField
                                    required
                                    fullWidth

                                    label="Password"
                                    type='password'
                                    margin='normal'
                                    variant='outlined'
                                    value={password.value}
                                    onChange={password.changeHandler}
                                />

                                {
                                    password.error && (
                                        <Typography color="error" variant='caption'>
                                            {password.error}
                                        </Typography>
                                    )
                                }

                                <Button
                                    fullWidth
                                    sx={{ marginTop: "1rem" }}
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    disabled={isLoading}
                                    style={{ backgroundColor: "#25D366" }}
                                >Sign Up</Button>

                                <div style={{ display: "flex" }}>
                                    <Typography
                                        textAlign={"center"}
                                        m={"1rem"}
                                    >Already have an account</Typography>

                                    <Button
                                        // fullWidth
                                        // variant='text'
                                        onClick={toggleLogin}
                                        disabled={isLoading}
                                    >
                                        Login
                                    </Button>
                                </div>

                            </form>
                        </>
                }
            </Paper>
        </Container >
    )
}

export default Login