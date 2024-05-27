import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { CurveButton, SearchField } from '../../components/styles/StyledComponents';
import moment from 'moment';
import { DoughnutChart, LineChart } from "../../components/specific/Charts.jsx"
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Group as GroupIcon,
    Message as MessageIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon
} from '@mui/icons-material';

const Dashboard = () => {

    const Appbar = (<Paper
        elevation={3}
        sx={{
            padding: "2rem",
            margin: "2rem 0",
            borderRadius: "1rem"
        }}
    >
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <AdminPanelSettingsIcon sx={{
                fontSize: "3rem"
            }} />

            {/* <input type='text' /> */}
            <SearchField placeholder='Search...' />
            <CurveButton >Search</CurveButton>
            <Box flexGrow={1} />
            <Typography display={{
                xs: "none",
                lg: "block"
            }}
                color={"rgba(0,0,0,0.7"}
                textAlign={"center"}
            >
                {/* {moment().format('MMMM Do YYYY, h:mm:ss a')}  ---> March 23rd 2024, 11:58:08 pm */}
                {moment().format("dddd, D MMMM YYYY")}  {/** Saturday, 23 March 2024 */}
            </Typography>

            <NotificationsIcon />

        </Stack>
    </Paper>);

    const Widgets = <Stack direction={{
        xs: "column",
        sm: "row"
    }}
        spacing={"2rem"}
        justifyContent={"space-between"}
        alignItems={"center"}
        margin={"2rem 0"}
    >
        <Widget title={"Users"} value={34} Icon={<PersonIcon />} />
        <Widget title={"Chats"} value={3} Icon={<GroupIcon />} />
        <Widget title={"Messages"} value={453} Icon={<MessageIcon />} />

    </Stack>

    return (
        <AdminLayout>
            <Container component={"main"}>
                {Appbar}
                <Stack
                    direction={{
                        xs: "column",
                        lg: "row"
                    }}
                    spacing={"2rem"}
                    flexWrap={"wrap"}
                    justifyContent={"center"}
                    alignItems={{
                        xs: "center",
                        lg: "stretch"
                    }}
                    sx={{ gap: "2rem" }}
                >
                    <Paper elevation={3}
                        sx={{
                            padding: "2rem 3.5rem",
                            borderRadius: "1rem",
                            width: "100%",
                            maxWidth: "45rem",
                            // height: "25rem"
                        }}
                    >
                        <Typography margin={"2rem 0"} variant='h4'>Last Messages</Typography>
                        {/* Line Chart */}
                        <LineChart value={[1, 2, 34, 6, 33]} />
                    </Paper>

                    <Paper elevation={3}
                        sx={{
                            padding: "1rem",
                            borderRadius: "1rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: { xs: "100%", sm: "50%" },
                            position: "relative",
                            width: "100%",
                            maxWidth: "25rem",
                            // height: "25rem"
                        }}>
                        {/* Doughnut Chart */}
                        <DoughnutChart
                            value={[35, 65]}
                            labels={["Single Chats", "Group Chats"]}
                        />
                        <Stack
                            position={"absolute"}
                            direction={"row"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            spacing={"0.5rem"}
                            width={"100%"}
                            height={"100%"}
                        >
                            <GroupIcon />
                            <Typography>Vs</Typography>
                            <PersonIcon />
                        </Stack>
                    </Paper>
                </Stack>
                {Widgets}
            </Container>
        </AdminLayout>
    )
}

const Widget = ({ title, value, Icon }) => (
    <Paper elevation={3} sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem",
        width: "20rem"
    }}
    >
        <Stack alignItems={"center"} spacing={"1rem"}>
            <Typography sx={{
                color: "rgba(0,0,0,0.7)",
                borderRadius: "50%",
                border: "5px solid black",
                width: "5rem",
                height: "5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>{value}</Typography>
            <Stack>
                {Icon}
                <Typography>{title}</Typography>
            </Stack>
        </Stack>
    </Paper>
);

export default Dashboard