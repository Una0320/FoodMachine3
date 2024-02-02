//UserList.jsx
import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import "../CSS/UserList.css";

const UserList = ({ isLoggedIn, setLoginstatue, CurUser, onSelectClick }) => {
    const navigate = useNavigate();
    const [userList, setuserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(CurUser.userName);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // const onLogin = async (username, password) => {
    //     try {
    //         const response = await fetch(`http://192.168.1.213:8000/login/`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 username: username,
    //                 password: password,
    //             }),
    //         });
        
    //         const data = await response.json();
    //         if (response.ok) {
    //             setLoginstatue(true);
    //             onSelectClick(data.id)
    //             console.log(data);
    //         } else {
    //             console.error(data.error);
    //         }
    //     } catch (error) {
    //         console.error('An error occurred during login:', error);
    //     }
    // };
      
    // const handleLogin = async () => {
    //     console.log(username, password)
    //     await onLogin(username, password);
    // };

    const handleLogout = () => {
        // 執行登出操作
        if (isLoggedIn && setLoginstatue) {
            setLoginstatue(false);
            window.location.replace('/');
            setUsername('');
            setPassword('');
        }
    };

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
            <ul className="userlistnav">
                <li key={null}>
                    {selectedUser || "Select User"}
                    <ul className="dropdown">
                        <li>setting</li>
                        <li onClick={handleLogout}>Logout</li>
                    {/* {userList.map((user) => (
                        <li key={user.id} onClick={(e) => handleOptionClick(e, user.id, user.username)}>
                        {user.username}
                        </li>
                    ))} */}
                    </ul>
                </li>
            </ul>
            {/* <ul className="userlistnav">
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
            </ul> */}
        </>
    );
};

export default UserList;