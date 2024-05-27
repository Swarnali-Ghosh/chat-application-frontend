import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material'

const Home = () => {
    return (
        <div className='chat-background'
        // bgcolor={"#fff"} height={"calc(100vh - 4rem)"}
        >
            {/* <Typography p={"2rem"}
                variant='h5' textAlign={"center"}>Select a friend to chat</Typography> */}
            <div className="" style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h3 className="fw-light text-white poetsen-one-regular" style={{ textAlign: "center", padding: "0px 20%" }}>Select one of the chats to start messaging</h3>

                <div className="btn-group my-5">
                </div>
            </div>
        </div >

    )
}

export default AppLayout()(Home)