import { useInputValidation } from '6pp'
import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem';
import { sampleUsers } from '../../constants/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import toast from 'react-hot-toast';
import { useAsyncMutation } from '../../hooks/hook';

const Search = () => {
    const [searchUser] = useLazySearchUserQuery();
    const { user } = useSelector((state) => state.auth);
    console.log("user", user)
    // addFriendHandler >> useAsyncMutation (Inside hook.jsx)
    // const [sendFriendRequest] = useSendFriendRequestMutation();
    const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

    const dispatch = useDispatch();
    const { isSearch } = useSelector(state => state.misc)

    const search = useInputValidation();

    const [users, setUsers] = useState([])

    // addFriendHandler >> useAsyncMutation (Inside hook.jsx)
    const addFriendHandler = async (id) => {
        await sendFriendRequest("Sending friend request...", { userId: id })
    }

    // const addFriendHandler = async (id) => {
    //     try {
    //         console.log(id);
    //         const res = await sendFriendRequest({ userId: id });
    //         if (res.data) {
    //             toast.success("Friend request sent");
    //             console.log(res.data)
    //         } else {
    //             toast.error(res?.error?.data?.message || "Something went wrong");
    //             // console.log(res.error.data.message)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Something went wrong");
    //     }
    // }

    const searchCloseHandler = () => dispatch(setIsSearch(false));

    useEffect(() => {
        console.log("search", search);
        // debouching 
        const timeOutId = setTimeout(() => {
            searchUser(search?.value ? search?.value : "")
                .then(({ data }) => {
                    let filteredData = data?.users.filter((userData) => userData._id != user._id)
                    setUsers(filteredData)
                })

                .catch((error) => {
                    console.log(error)
                })
        }, 1000);

        return () => {
            clearTimeout(timeOutId)
        }

    }, [search.value])

    return (
        <Dialog open={isSearch} onClose={searchCloseHandler}>
            <Stack p={"2rem"} direction={"column"} width={"25rem"}>
                <DialogTitle textAlign={"center"} style={{ fontWeight: "660", color: "#25D366" }}><span className='poppins-medium'>Find People</span></DialogTitle>
                <TextField
                    label=""
                    value={search.value}
                    onChange={search.changeHandler}
                    variant='outlined'
                    size='small'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
                <List>

                    {
                        users.length > 0 ? users?.map((i, index) => (

                            <div key={index}>
                                {/*  user list */}
                                {

                                    <UserItem
                                        user={i}
                                        key={i._id}
                                        handler={addFriendHandler}
                                        handlerIsLoading={isLoadingSendFriendRequest}
                                    />

                                }

                            </div>
                        )) : <p className='poppins-medium' style={{ textAlign: "center" }}>no users available!</p>
                    }
                </List>
            </Stack>
        </Dialog>
    )
}

export default Search