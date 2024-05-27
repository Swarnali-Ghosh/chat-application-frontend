import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment from 'moment'
import {
    Face as FaceIcon,
    AlternateEmail as UserNameIcon,
    CalendarMonth as CalenderIcon
} from '@mui/icons-material'
import { transformImage } from '../../lib/features'


const Profile = ({ user }) => {

    return (
        <Stack
            spacing={"1rem"}
            alignItems={"center"}
            padding={"5px"}
            margin={"0"}
        // height={"90%"}
        // overflow={"auto"}
        >
            <Avatar
                src={transformImage(user?.avatar?.url || "http://www.w3schools.com/howto/img_avatar.png")}
                sx={{
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "5px solid white"
                }}
            />
            <ProfileCard heading={"Bio"} text={user?.bio} />
            <ProfileCard heading={"Username"} text={user?.username}
            // Icon={UserNameIcon}
            />
            <ProfileCard heading={"Name"} text={user?.name}
            // Icon={FaceIcon}
            />
            <ProfileCard heading={"Joined"} text={
                moment(user?.createdAt).fromNow()
            }
            // Icon={CalenderIcon}
            />
        </Stack>
    )
}

const ProfileCard = ({ text, Icon, heading }) => {
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            color={"white"}
            textAlign={"center"}
        >
            {/* {Icon && Icon} */}

            <Stack>
                <p className='poppins-medium' style={{ color: "#25D366", fontSize: "12px", padding: "0px", margin: "0px" }} variant='caption'>
                    {heading}:
                </p>
                <p className='poppins-medium' style={{ padding: "0px", margin: "0px", fontSize: "14px", }} variant='body1'>{text}</p>

            </Stack>

        </Stack>
    )
}

export default Profile