//UserList.jsx
import React, {useState, useEffect} from "react";
import "../CSS/UserList.css";

const UserList = ({ onSelectClick }) => {
    const [userList, setuserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('root1');

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

    const handleOptionClick = (event, userId, username) => {
        event.stopPropagation(); // 阻止事件冒泡
        setSelectedUser(username);
        onSelectClick(userId);
    };
      
    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <>
            {/* <select className="selectclass" onChange={(e) => onSelectClick(e.target.value)}>
                <option value={null}>Select User</option>
                {userList.map((user) => (
                <option key={user.id} value={user.id}>
                    {user.username}
                </option>
                ))}
            </select> */}
            <ul className="userlistnav">
                <li key={null}>
                    {selectedUser || "Select User"}
                    <ul className="dropdown">
                    {userList.map((user) => (
                        <li key={user.id} onClick={(e) => handleOptionClick(e, user.id, user.username)}>
                        {user.username}
                        </li>
                    ))}
                    </ul>
                </li>
            </ul>
        </>
    );
};

export default UserList;