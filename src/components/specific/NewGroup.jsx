import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from "../shared/UserItem";
import { useInputValidation } from '6pp';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const NewGroup = () => {
    const { isNewGroup } = useSelector(state => state.misc)
    const dispatch = useDispatch();
    const { isError, isLoading, error, data } = useAvailableFriendsQuery("");

    console.log("isError", isError);
    console.log("isLoading", isLoading);
    console.log("error", error);
    console.log("data", data)

    {/**

    isError false
    isLoading false
    error undefined

    data    {
        "success": true,
        "friends": [
            {
                "_id": "662512b486686f73bbd02eb9",
                "name": "SwarnaliGhosh",
                "avatar": "https://res.cloudinary.com/dlb7miibc/image/upload/v1713705651/cc81066e-dc4f-4707-b3da-d65d844fb301.png"
            }
        ]
    }


    */ }

    const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)

    const groupName = useInputValidation("")
    const [selectedMembers, setSelectedMembers] = useState([]);

    const errors = [{
        isError,
        error
    }]

    useErrors(errors)

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id])
    }

    const submitHandler = () => {

        if (!groupName.value) return toast.error("Group name is required");

        if (selectedMembers.length < 2)
            return toast.error("Please select atleast 3 members");

        //  Creating Group
        newGroup("Creating New Group...", { name: groupName.value, members: selectedMembers })

        closeHandler();
    }

    const closeHandler = () => {
        dispatch(setIsNewGroup(false));
    }

    return (
        <Dialog onClose={closeHandler} open={isNewGroup} >


            <Stack p={"2rem"} direction={"column"} width={"25rem"}>
                <DialogTitle textAlign={"center"} style={{ fontWeight: "660", color: "#25D366" }}><span className='poppins-medium'>New Group</span></DialogTitle>
                <TextField className='poppins-medium' label="Group Name" size='small' value={groupName.value} onChange={groupName.changeHandler} />
                <p className='poppins-medium' style={{ borderBottom: "1px solid #ebebeb", color: "#666666", marginTop: "15px" }}>Members</p>
                <Stack>
                    {isLoading ? (<Skeleton />) :
                        (data?.friends?.map((i) => (
                            <UserItem
                                user={i}
                                key={i._id}
                                handler={selectMemberHandler}
                                isAdded={selectedMembers.includes(i._id)}
                            />
                        )))
                    }
                </Stack>

                <Stack direction={"row"} justifyContent={"space-evenly"} style={{ marginTop: "15px" }}>
                    <Button variant="outlined" color="error" size='large'
                        onClick={closeHandler}>Cancel</Button>
                    <Button variant="contained" size='large'
                        disabled={isLoadingNewGroup}
                        onClick={submitHandler}>Create</Button>
                </Stack>
            </Stack>
        </Dialog >
    )
}

export default NewGroup