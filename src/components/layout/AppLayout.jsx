import React, { useCallback, useEffect, useState } from 'react'
import Header from './Header.jsx'
import Title from '../shared/Title'
import { Drawer, Grid, Skeleton, Typography } from '@mui/material'
import ChatList from '../specific/ChatList.jsx'
import { sampleChats } from '../../constants/sampleData.js'
import { useNavigate, useParams } from 'react-router-dom'
import { useMyChatsQuery } from '../../redux/api/api.js'
import CHAT1 from "../../assets/files/chat.png"
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu, setIsMobile } from '../../redux/reducers/misc.js'
import toast from 'react-hot-toast'
import { useErrors, useSocketEvents } from '../../hooks/hook.jsx'
import { getSocket } from '../../socket.jsx'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat.js'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events.js';
import { getOrSaveFromStorage } from '../../lib/features.js'

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const chatId = params.chatId;

        const socket = getSocket();
        const [onlineUsers, setOnlineUsers] = useState([]);

        const { isMobile } = useSelector((state) => state.misc)
        const { user } = useSelector((state) => state.auth);
        const { newMessagesAlert } = useSelector((state) => state.chat);

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery();

        useErrors([{ isError, error }]);

        useEffect(() => {
            getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert })
        }, [newMessagesAlert]);


        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault();
        }

        const handleMobileClose = () => dispatch(setIsMobile(false));

        // when user1 send friend request to user2 then user not getting notification immediately that's why use socket to achieve this goals
        const newMessageAlertListener = useCallback(
            (data) => {

                if (data.chatId === chatId) return; // i am user 1 , user 2 message me,  when i select user 2 chat , then chat alert not increase, otherwise chat alert count increase.
                dispatch(setNewMessagesAlert(data));
            },
            [chatId]
        );

        const newRequestListener = useCallback(() => {
            dispatch(incrementNotification());
        }, [dispatch]);

        const refetchListener = useCallback(() => {
            refetch();
            // like user 1 remove the group member (user 2) and user 2 is online and already opened group chat section so this time [user 2] navigate to "/" 
            navigate("/");
        }, [refetch,
            navigate
        ]);

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: newMessageAlertListener,
            [NEW_REQUEST]: newRequestListener,
            [REFETCH_CHATS]: refetchListener,
        };

        useSocketEvents(socket, eventHandlers);

        return (
            <>
                <Title />
                <Header />

                {
                    isLoading ? <Skeleton /> :
                        <Drawer open={isMobile} onClose={handleMobileClose}>
                            {data?.chats?.length > 0 ?
                                <ChatList
                                    w="70vw"
                                    chats={data?.chats}
                                    chatId={chatId}
                                    handleDeleteChat={handleDeleteChat}
                                    newMessagesAlert={newMessagesAlert}

                                /> :
                                <div style={{ width: "100%", height: "calc(100vh - 4rem)", margin: "auto", display: "flex", justifyContent: "center", alignItems: "center" }} >
                                    <div>
                                        <img src={CHAT1} width="150px" alt='chat' />
                                        <Typography className='no_chats_available'>No chats available!</Typography>
                                    </div>
                                </div>
                            }
                        </Drawer>
                }

                <Grid container
                    height={"calc(100vh - 4rem"}
                    overflow={"hidden"}
                >
                    <Grid
                        item
                        xs={0}
                        sm={4}
                        md={3}
                        sx={{
                            display: { xs: "none", sm: "block" },
                            background: "#fafafa",
                            overflowY: "auto"
                        }}

                    >

                        {
                            isLoading ? <Skeleton /> : (data?.chats?.length > 0 ?
                                <ChatList
                                    // w="70vw"
                                    chats={data?.chats}
                                    chatId={chatId}
                                    handleDeleteChat={handleDeleteChat}
                                    newMessagesAlert={newMessagesAlert}
                                    handleMobileClose={handleMobileClose}
                                /> :
                                <div style={{ width: "100%", height: "calc(100vh - 4rem)", margin: "auto", display: "flex", justifyContent: "center", alignItems: "center" }} >
                                    <div>
                                        <img src={CHAT1} width="150px" alt='chat' />
                                        <Typography className='no_chats_available'>No chats available!</Typography>
                                    </div>
                                </div>
                            )
                        }
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        lg={9}
                        height="calc(100vh - 4rem)"
                        overflow={"hidden"}

                    >
                        <WrappedComponent {...props} chatId={chatId} user={user} />
                    </Grid>

                </Grid >



            </>
        )
    }
}

export default AppLayout