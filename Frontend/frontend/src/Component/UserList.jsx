//UserList.jsx
import React, {useState, useEffect} from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "../CSS/UserList.css";

const UserList = ({ onSelectClick }) => {
    const [userList, setuserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    const fetchUserData = async () => {
        try {
            const response = await fetch("http://192.168.1.213:8000/userlist/");
            if (response.ok) {
                const jsonData = await response.json();
                setuserList(jsonData);
                console.log(jsonData)
            } else {
                console.log(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <>
            <select className="selectclass" onChange={(e) => onSelectClick(e.target.value)}>
                <option value={null}>Select User</option>
                {userList.map((user) => (
                <option key={user.id} value={user.id}>
                    {user.username}
                </option>
                ))}
            </select>
        </>
        // <FormControl sx={{ m: 1, minWidth: 80, color: 'white' }}>
        //     <InputLabel id="user-select-label">Select User</InputLabel>
        //     <Select
        //         labelId="user-select-label"
        //         id="user-select"
        //         value={selectedUser}
        //         label="Select User"
        //         onChange={(e) => onSelectClick(e.target.value)}
        //     >
        //         <MenuItem value="">
        //         <em>None</em>
        //         </MenuItem>
        //         {userList.map((user) => (
        //         <MenuItem key={user.id} value={user.id}>
        //             {user.username}
        //         </MenuItem>
        //         ))}
        //     </Select>
        // </FormControl>
    );
};

export default UserList;