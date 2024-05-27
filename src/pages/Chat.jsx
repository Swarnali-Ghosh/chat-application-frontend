import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { BouncingSkeleton, InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useInfiniteScrollTop } from '6pp';
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { useNavigate } from 'react-router-dom';
// import TypingLoader from '../components/layout/Loaders';

const TypingLoader = () => {
    return <Stack
        spacing={"0.5rem"}
        direction={"row"}
        padding={"0.5rem"}
        justifyContent={"center"}
    >
        <BouncingSkeleton variant='circular' width={15} height={15} style={{ animationDelay: "0.1s" }} /> {/** video part 3 - 05:13:00 */}
        <BouncingSkeleton variant='circular' width={15} height={15} style={{ animationDelay: "0.2s" }} />
        <BouncingSkeleton variant='circular' width={15} height={15} style={{ animationDelay: "0.4s" }} />
        <BouncingSkeleton variant='circular' width={15} height={15} style={{ animationDelay: "0.6s" }} />
    </Stack>
}

const Chat = ({ chatId, user }) => {

    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const fileMenuRef = useRef(null);

    const socket = getSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

    const [IamTyping, setIamTyping] = useState(false);
    const [userTyping, setUserTyping] = useState(false);
    const typingTimeout = useRef(null);


    // without chat id don't call this "useChatDetailsQuery()"
    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId }) // it will not call without chat id

    const oldMessageChunk = useGetMessagesQuery({ chatId, page });


    const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
        containerRef,
        oldMessageChunk.data?.totalPages,
        page,
        setPage,
        oldMessageChunk.data?.messages
    )

    const errors = [
        {
            isError: chatDetails.isError,
            error: chatDetails.error
        },

        {
            isError: oldMessageChunk.isError,
            error: oldMessageChunk.error
        }
    ];

    const members = chatDetails?.data?.chat?.members;

    const messageOnChange = (e) => {
        setMessage(e.target.value);

        if (!IamTyping) {
            socket.emit(START_TYPING, { members, chatId });

            setIamTyping(true)
        }

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.emit(STOP_TYPING, { members, chatId })
            setIamTyping(false);
        }, [2000])
    }

    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        if (!message.trim()) return;
        socket.emit(NEW_MESSAGE, { chatId, members, message });
        setMessage("")
    }

    useEffect(() => {

        dispatch(removeNewMessagesAlert(chatId));

        return () => {
            setMessages([]);
            setMessage("");
            setOldMessages([]);
            setPage(1);
        }
    }, [chatId]);

    useEffect(() => {
        if (bottomRef.current)
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    useEffect(() => {
        if (chatDetails.isError) return navigate("/");
    }, [chatDetails.isError])

    const newMessagesListener = useCallback((data) => {

        if (data.chatId !== chatId) return;

        setMessages((prev) => [...prev, data.message])
    }, [chatId])

    const startTypingListener = useCallback((data) => {

        if (data.chatId !== chatId) return;

        setUserTyping(true);
    }, [chatId])

    const stopTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;

        setUserTyping(false);
    }, [chatId])

    const alertListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        const messageForAlert = {
            content: data.message,
            sender: {
                _id: "ewyturtuobjdhfghewtt",
                name: "Admin"
            },
            chat: chatId,
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, messageForAlert])
    }, [chatId])

    const eventHandler = {
        [ALERT]: alertListener,
        [NEW_MESSAGE]: newMessagesListener,
        [START_TYPING]: startTypingListener,
        [STOP_TYPING]: stopTypingListener
    };

    useSocketEvents(socket, eventHandler);

    useErrors(errors);

    const allMessages = [...oldMessages, ...messages];

    return (
        chatDetails.isLoading ? <Skeleton /> :
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Stack
                    ref={containerRef}
                    boxSizing={"border-box"}
                    padding={"1rem"}
                    spacing={"1rem"}
                    bgcolor={"rgba(0,0,0,0.1)"}
                    height={"calc(100vh - 9rem)"}
                    sx={{
                        overflowX: "hidden",
                        overflowY: "auto"
                    }}
                >
                    {/* message render */}

                    {allMessages.map((i) =>
                    (
                        <MessageComponent key={i._id} message={i} user={user} />
                    ))}

                    {userTyping && <TypingLoader />}

                    <div ref={bottomRef} />


                </Stack>

                <form style={{
                    height: "10%"
                }} onSubmit={submitHandler}
                >

                    <Stack
                        direction={"row"}
                        height={"100%"}
                        padding={"1rem"}
                        alignItems={"center"}
                        position={"relative"}
                    >
                        <IconButton sx={{
                            position: "absolute",
                            left: "1.5rem",
                            rotate: "30deg"
                        }}
                            onClick={handleFileOpen}

                        // ref={fileMenuRef}
                        >
                            <AttachFileIcon />
                        </IconButton>

                        <InputBox className='poppins-medium' placeholder='Type Message Here...' sx={{
                            height: "35px"
                        }} value={message}
                            // onChange={e => setMessage(e.target.value)}
                            onChange={messageOnChange}

                        />

                        <IconButton type='submit' sx={{
                            rotate: "-30deg",
                            backgroundColor: "#25D366",
                            color: "white",
                            marginLeft: "1rem",
                            padding: "0.5rem",
                            "&:hover": {
                                bgcolor: "#005d43"
                            }
                        }}>
                            <SendIcon />
                        </IconButton>

                    </Stack>

                </form >

                <FileMenu chatId={chatId}
                    anchorEl={fileMenuAnchor}
                // anchorE1={fileMenuRef.current}
                />
            </div>
    )
}

export default AppLayout()(Chat)