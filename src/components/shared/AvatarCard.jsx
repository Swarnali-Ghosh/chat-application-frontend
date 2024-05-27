import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'
import { transformImage } from '../../lib/features'

const AvatarCard = ({ avatar = [], max = 4 }) => {
    return (
        <Stack direction={"row"} spacing={0.5}>
            <AvatarGroup
                max={max}
                sx={{
                    position: "relative"
                }}
            >
                <Box width={"4rem"} height={"3rem"} paddingTop={"5px"} justifyContent={"center"} >
                    {
                        avatar.length > 0 && avatar.map((i, index) => (
                            <Avatar
                                key={Math.random() * 100}
                                src={transformImage(i)}
                                alt={`Avatar ${index}`}
                                sx={{
                                    width: "2rem",
                                    height: "2rem",
                                    position: "absolute",
                                    left: {
                                        xs: `${0.5 + index}rem`,
                                        sm: `${index}rem`
                                    }
                                }}
                            />
                        ))
                    }
                </Box>
            </AvatarGroup>
        </Stack>
    )
}

export default AvatarCard