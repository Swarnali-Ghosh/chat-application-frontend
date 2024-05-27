import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { Suspense, lazy, memo, useEffect, useState } from 'react'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon
} from "@mui/icons-material"
import { useNavigate, useSearchParams } from "react-router-dom"
import AvatarCard from '../components/shared/AvatarCard';
import { Link } from '../components/styles/StyledComponents';
import { sampleChats, sampleUsers } from '../constants/sampleData';
import UserItem from '../components/shared/UserItem';
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import Loaders from '../components/layout/Loaders';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';
const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"))
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"))

const Groups = () => {
    let chatId = useSearchParams()[0].get("group");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAddMember } = useSelector(state => state.misc)

    const myGroups = useMyGroupsQuery("");

    const groupDetails = useChatDetailsQuery(
        { chatId, populate: true },
        { skip: !chatId }
    )

    const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false);
    const [groupName, setGroupName] = useState();
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

    const [members, setMembers] = useState([]);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

    const errors = [{
        isError: myGroups.isError,
        error: myGroups.error
    },
    {
        isError: groupDetails.isError,
        error: groupDetails.error
    }]

    useErrors(errors);

    useEffect(() => {
        let groupData = groupDetails.data;
        if (groupData) {
            setGroupName(groupData?.chat?.name);
            setGroupNameUpdatedValue(groupData?.chat?.name)
            setMembers(groupData.chat.members)
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setMembers([]);
            setIsEdit(false);
        }

    }, [groupDetails.data])

    const navigateBack = () => {
        navigate("/");
    }
    const handleMobile = () => {
        setIsMobileMenuOpen((prev) => !prev);
    }

    const handleMobileClose = () => setIsMobileMenuOpen(false);

    const updateGroupName = () => {
        setIsEdit(false);
        updateGroup("Updating Group Name...", {
            chatId,
            name: groupNameUpdatedValue
        })

    }

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);

    }

    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false)
    }

    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true))
    }

    const deleteHandler = () => {

        deleteGroup("Deleting Group...", chatId);
        closeConfirmDeleteHandler();
        navigate("/groups");
    }

    const removeMemberHandler = (userId) => {
        removeMember("Removing Member...", { chatId, userId })
    }

    useEffect(() => {
        if (chatId) {
            setGroupName(`Group Name ${chatId}`);
            setGroupNameUpdatedValue(`Group Name ${chatId}`);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setIsEdit(false)
        }
    }, [chatId])

    const IconBtns = (<>
        <Box
            sx={{
                display: {
                    xs: "block",
                    sm: "none",
                    position: "fixed",
                    right: "1rem",
                    top: "1rem"
                }
            }}>
            <Tooltip title="menu">
                <IconButton onClick={handleMobile}>
                    <MenuIcon />
                </IconButton>
            </Tooltip>
        </Box>
        <Tooltip title="back">
            <IconButton
                sx={{
                    position: "absolute",
                    top: "2rem",
                    left: "2rem",
                    bgcolor: "#EAEAEA",
                    color: "white"
                }}
                onClick={navigateBack}
            >
                <KeyboardBackspaceIcon />
            </IconButton>
        </Tooltip>
    </>)

    const GroupName = (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={"1rem"}
            padding={"3rem"}
        >{isEdit ?
            (<>
                <input className='poppins-medium'
                    value={groupNameUpdatedValue}
                    onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                />
                <IconButton onClick={updateGroupName}
                    disabled={isLoadingGroupName} >
                    <DoneIcon />
                </IconButton>
            </>) :
            (<>
                <p className='poppins-medium'>{groupName}</p>
                <IconButton onClick={() => setIsEdit(true)}
                    disabled={isLoadingGroupName}
                ><EditIcon /> </IconButton>
            </>)}
        </Stack>
    )

    const ButtonGroup = (
        <Stack
            direction={{
                sm: "row",
                xs: "column-reverse"
            }}
            spacing={"1rem"}
            p={{
                xs: "0",
                sm: "1rem",
                md: "1rem 4rem"
            }}
        >
            <Button
                // size='large'
                color="error"
                variant='outlined'
                // startIcon={<DeleteIcon />}
                onClick={openConfirmDeleteHandler}
            ><span className='poppins-medium'>Delete Group</span></Button>
            <Button
                // size='large'
                variant='contained'
                // startIcon={<AddIcon />}
                onClick={openAddMemberHandler}
            ><span className='poppins-medium'>Add Member</span></Button>
        </Stack>
    )

    return myGroups.isLoading ? <Loaders /> : (
        <Grid container height={"100vh"}>
            <Grid
                item
                sx={{
                    display: {
                        xs: "none",
                        sm: "block"
                    },
                }}
                md={3}
                sm={4}
                style={{
                    // border: "1px solid red",
                    overflowY: "auto"
                }}
                bgcolor={"bisque"}
            >
                <GroupList
                    myGroups={myGroups?.data?.groups} chatId={chatId}
                />
            </Grid>

            <Grid
                item
                xs={12}
                md={9}
                sm={8}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem 3rem"
                }}
            >
                {IconBtns}


                {
                    groupName ? (
                        <>
                            <p className='poppins-medium'>{GroupName}</p>


                            {/* <p className='poppins-medium'>
                                Members
                            </p> */}

                            <Stack
                                maxWidth={"45rem"}
                                width={"100%"}
                                boxSizing={"border-box"}
                                padding={{
                                    sm: "1rem",
                                    xs: "0",
                                    md: "1rem 6rem"
                                }}

                                spacing={"0.1rem"}
                                // bgcolor={"bisque"}
                                height={"50vh"}
                                overflow={"auto"}
                            >

                                {/* Members */}
                                {
                                    isLoadingRemoveMember ? (<CircularProgress />) :
                                        members?.map((i) => (
                                            <UserItem
                                                user={i}
                                                key={i._id}
                                                isAdded
                                                styling={{
                                                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                                                    padding: "1rem 2rem",
                                                    borderRadius: "1rem"
                                                }}

                                                handler={removeMemberHandler}
                                            />
                                        ))}
                            </Stack>
                            <br></br>
                            {/* ButtonGroup */}
                            {ButtonGroup}
                        </>
                    ) : (
                        <div style={{ paddingTop: "30%" }}>
                            <h2 className='poetsen-one-regular' >manage your groups</h2>
                        </div>
                    )
                }
            </Grid>

            {/* Add Member dialog */}

            {
                isAddMember && (
                    <Suspense fallback={<Backdrop open />}>
                        <AddMemberDialog chatId={chatId} />
                    </Suspense>
                )
            }

            {confirmDeleteDialog && (
                <Suspense fallback={<Backdrop open />}>
                    <ConfirmDeleteDialog
                        open={confirmDeleteDialog}
                        handleClose={closeConfirmDeleteHandler}
                        deleteHandler={deleteHandler}
                    />
                </Suspense>
            )
            }

            <Drawer sx={{
                display: {
                    xs: "block",
                    sm: "none"
                }
            }}
                open={isMobileMenuOpen} onClose={handleMobileClose}>
                {/* open drawer */}
                <GroupList

                    // ---> mobile view width
                    w={"50vw"}
                    // <--- mobile view width

                    myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Drawer>
        </Grid>
    )
};

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
    return (
        <Stack width={w}
            sx={{
                height: "100vh"
            }}>
            {
                myGroups.length > 0 ? myGroups.map((group) => (
                    <GroupListItem group={group} chatId={chatId} key={group._id} />

                )) :
                    <p className='poppins-medium' style={{ textAlign: "center", padding: "10px" }} padding="1rem">no groups available</p>
            }
        </Stack>
    )
}

const GroupListItem = memo(({ group, chatId }) => {
    // chatId (selected chat)
    const { name, avatar, _id } = group;

    return <Link to={`?group=${_id}`}

        // ----> not loaded multiple times when click on same group chat
        onClick={(e) => {
            if (chatId === _id) e.preventDefault();
        }}
    // <---- not loaded multiple times when click on same group chat
    >
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
            <AvatarCard avatar={avatar ? avatar : ""} />
            <p className='poppins-medium' >{name}</p>

        </Stack>
    </Link>
})


export default Groups