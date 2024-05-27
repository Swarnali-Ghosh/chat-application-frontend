import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Button, Typography, Avatar } from '@mui/material'
import React, { Suspense, lazy, useState } from 'react'
import { orange } from '../../constants/color'
import {
    Add as AddIcon,
    Group as GroupIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
    Logout as LogoutIcon,
    // Notifications as NotificationsIcon,

} from '@mui/icons-material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { server } from '../../constants/config';
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import { resetNotificationCount } from '../../redux/reducers/chat';
import { transformImage } from '../../lib/features';
import Profile from '../specific/Profile'
const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));


const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isSearch, isNotification, isNewGroup } = useSelector(state => state.misc);
    const { notificationCount } = useSelector(state => state.chat);
    const { user } = useSelector((state) => state.auth);

    const handleMobile = () => {
        dispatch(setIsMobile(true))
    }

    const openSearch = () => {
        dispatch(setIsSearch(true))
    }

    const openNewGroup = () => {
        dispatch(setIsNewGroup(true))
    }

    const openNotification = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotificationCount())
    }

    const navigateToGroup = () => {
        navigate("/groups")
    }

    const logoutHandler = async () => {
        try {
            console.log("logout")
            const { data } = await axios.get(`${server}/api/v1/user/logout`, {
                withCredentials: true,
            });
            dispatch(userNotExists());
            toast.success(data.message);
        } catch (error) {
            toast.error(error || "Something went wrong");
        }
    };

    return (
        <>

            <nav className='nav-style' >

                <div className='logo-div'>
                    <h5 className='poetsen-one-regular logo-text'
                        style={{ color: "#005d43" }}> Global&nbsp;
                    </h5>
                    <h5 className='poetsen-one-regular logo-text adda'
                    >
                        Adda
                    </h5>
                </div>
                <div className='free-space'></div>

                <div className='logo-div-two'>
                    <Tooltip enterTouchDelay={0} title=<Profile user={user} bgcolor={"#fff"} padding={"0px"} /> arrow>
                        <Avatar
                            src={transformImage(user?.avatar?.url || "http://www.w3schools.com/howto/img_avatar.png")}
                            sx={{
                                width: 40,
                                height: 40,
                                border: "2px solid white",
                                marginRight: "8px"
                            }}
                        />

                    </Tooltip>

                    <Tooltip enterTouchDelay={0}
                        title={
                            <>
                                <IconBtn
                                    title={"Search"}
                                    icon={<SearchIcon />}
                                    onClick={openSearch}
                                />

                                <IconBtn
                                    title={"New Group"}
                                    icon={<AddIcon />}
                                    onClick={openNewGroup}
                                />

                                <IconBtn
                                    title={"Manage Groups"}
                                    icon={<GroupIcon />}
                                    onClick={navigateToGroup}
                                />



                                <IconBtn
                                    title={"Logout"}
                                    icon={<LogoutIcon />}
                                    onClick={logoutHandler}
                                />
                            </>
                        } arrow>
                        <IconButton color='inherit'
                            // size='large'
                            style={{ width: "40px", height: "40px", color: "#fff", backgroundColor: "" }}
                        >
                            <MoreHorizIcon />
                        </IconButton>


                    </Tooltip>

                    <IconBtn
                        title={"Notifications"}
                        icon={<NotificationsIcon />}
                        onClick={openNotification}
                        value={notificationCount}
                    />



                </div>


                <Box sx={{
                    display: { xs: "block", sm: "none" },
                    alignContent: { xs: "center" },
                    color: { xs: "#fff" },
                    // border: { xs: "1px solid red" }
                }}>
                    <IconButton
                        color='inherit'
                        onClick={handleMobile}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Box sx={{
                    flexGrow: 1
                }}>

                </Box>

            </nav >

            {/* </Box> */}


            {
                isSearch && (
                    <Suspense fallback={<Backdrop open />}>
                        <SearchDialog />
                    </Suspense>
                )
            }

            {
                isNotification && (
                    <Suspense fallback={<Backdrop open />}>
                        <NotificationDialog />
                    </Suspense>
                )
            }

            {
                isNewGroup && (
                    <Suspense fallback={<Backdrop open />}>
                        <NewGroupDialog />
                    </Suspense>
                )
            }
        </>
    )
}

const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>

            <IconButton
                sx={{ color: '#fff' }}
                size='large'
                onClick={onClick}
            >
                {
                    value ? <Badge badgeContent={value} color='error'> {icon}</Badge> : icon
                }

            </IconButton>

        </Tooltip>
    );
}

export default Header;