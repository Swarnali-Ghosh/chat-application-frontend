import React, { memo, useEffect } from 'react'
import { Link } from '../styles/StyledComponents'
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import { motion } from 'framer-motion'
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'
import { useDispatch } from 'react-redux'
import { setIsMobile } from '../../redux/reducers/misc'

const ChatItem = ({
    index = 0,
    newMessageAlert,
    isOnline,
    avatar = [],
    name,
    _id,
    key,
    groupChat,
    sameSender,
    handleMobileClose,
    // handleDeleteChat
}) => {

    const dispatch = useDispatch();

    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);


    const leaveGroupHandler = () => {
        // closeHandler();
        leaveGroup("Leaving Group...", _id);
    };

    const deleteChatHandler = () => {
        // closeHandler();
        deleteChat("Deleting Chat...", _id);
    };

    useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate("/");
    }, [deleteChatData, leaveGroupData]);

    const view = () => {
        dispatch(setIsMobile(false))
    }

    return (
        <Link
            sx={{
                padding: "0"
            }}
            to={`/chat/${_id}`}
        // onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}

        >
            <motion.div
                // initial={{ opacity: 0, y: "-100%" }}   // motion
                // whileInView={{ opacity: 1, y: 0 }} // motion
                // transition={{ delay: index * 0.1 }} // motion
                className='chat-item-hov'
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "0.5rem",
                    backgroundColor: sameSender ? "#0f162e" : "unset",
                    color: sameSender ? "white" : "unset",
                    position: "relative",
                    borderBottom: "1px solid #eeeeee"
                }}
                onClick={view}
            >

                {/* Avatar Card */}
                <AvatarCard avatar={avatar.length > 0 ? avatar : ""} />

                <div style={{
                    display: "flex",
                    // flexDirection: "column",
                    // border: "1px solid pink",
                    width: "80%",
                    justifyContent: "space-between",
                    alignItems: "center"

                }}>
                    <p className='poppins-medium cut-text'
                        style={{ paddingbottom: "0px", marginBottom: "0px" }}>{name}</p>

                    {
                        newMessageAlert && (
                            <p className='poppins-medium'
                                style={{ color: "#fff", fontSize: "14px", width: "25px", height: "25px", backgroundColor: "#25D366", borderRadius: "50%", paddingbottom: "0px", marginBottom: "0px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {newMessageAlert?.count > 99 ? `${newMessageAlert?.count}+` : newMessageAlert?.count}</p>
                        )
                    }

                    <Tooltip enterTouchDelay={0} sx={{ bgcolor: "#fff" }} className='chat-item-tooltip'
                        title={
                            <div >
                                <Stack spacing={1}>
                                    <Button sx={{ color: '#fff', fontSize: "10px" }}
                                        onClick={groupChat ? leaveGroupHandler : deleteChatHandler}
                                    // startIcon={<DeleteIcon />} 
                                    >
                                        {groupChat ? "Leave Group" : "Delete Chat"}
                                    </Button>
                                </Stack>
                            </div>
                        } arrow>
                        <MoreVertIcon />


                    </Tooltip>
                </div>

                {
                    isOnline && (
                        <Box
                            sx={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "green",
                                position: "absolute",
                                top: "50%",
                                right: "1rem",
                                transform: "translateY(-50%)"
                            }}
                        />
                    )
                }

            </motion.div>
        </Link >
    )
}

export default memo(ChatItem)