import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'

const ChatList = ({
    // w = "100%",
    chats = [],
    chatId,
    // onlineUsers = [],
    handleDeleteChat,
    newMessagesAlert = [
        {
            chatId: "",
            count: 0
        },
    ],
    handleMobileClose


}) => {

    // console.log(handleDeleteChat);
    return (
        <div className='chat-list'
        // width={w}
        // direction={"column"}
        // style={{
        //     height: "calc(100vh -4rem)",
        //     overflowY: "auto",
        //     overflowX: "hidden"
        // }}
        >
            {
                chats?.map((data, index) => {

                    const { avatar, _id, name, groupChat, members } = data;

                    const newMessageAlert = newMessagesAlert.find(
                        ({ chatId }) => chatId === _id
                    )

                    {/* const isOnline = members?.some((member) => onlineUsers.includes(_id)); */ }

                    return <ChatItem
                        index={index}
                        newMessageAlert={newMessageAlert}
                        // isOnline={isOnline}
                        avatar={avatar ? avatar : ""}
                        name={name}
                        _id={_id}
                        key={_id}
                        groupChat={groupChat}
                        sameSender={chatId === _id}
                        handleMobileClose={handleMobileClose}
                    // handleDeleteChat={handleDeleteChat}
                    />
                })
            }
        </div>
    )
}

export default ChatList