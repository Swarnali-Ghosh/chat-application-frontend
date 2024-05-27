import { Box, Typography } from '@mui/material';
import React, { memo } from 'react'
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import RenderAttachment from './RenderAttachment';
import { motion } from 'framer-motion';

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachments = [], createdAt } = message;

    const sameSender = sender?._id === user?._id;

    const timeAgo = moment(createdAt).fromNow();

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }} // motion
            // animate={{ opacity: 1, x: 0 }}  // motion
            whileInView={{ opacity: 1, x: 0 }}  // motion
            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px",
                padding: "0.5rem",
                width: "fit-content"
            }}>
            {!sameSender && (
                <p className='poppins-medium' style={{ color: "#25D366", fontSize: "12px" }} fontWeight={"600"} variant='caption'>
                    {sender.name}
                </p>
            )}

            {content && <p className='poppins-medium message-container'  >{content}</p>}

            {/* Attachment */}

            {
                attachments.length > 0 &&
                attachments.map((attachment, attachmentIndex) => {
                    const url = attachment.url;
                    const file = fileFormat(url); // get file type

                    return (
                        <Box key={attachmentIndex}>
                            <a href={url} target='_black' download style={{ color: "black" }}>
                                {RenderAttachment(file, url)}
                            </a>
                        </Box>
                    )
                })
            }

            <p className='poppins-medium'
                style={{ color: "gray", fontSize: "11px", opacity: "0.6", padding: "0", margin: "0" }}
            >{timeAgo}</p>

        </motion.div>
    )
}

export default memo(MessageComponent);