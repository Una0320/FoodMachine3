//Loginout.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../CSS/Loginout.css';

const Loginout = ({ isLoggedIn, setLoginstatue, setCurUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onLogin = async (username, password) => {
        try {
            const response = await fetch(`http://192.168.1.213:8000/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
        
            const data = await response.json();
            // console.log('API Response:', response);

            // 根據後端的回應執行相應的操作
            if (response.ok) {
                setLoginstatue(true);
                setCurUser({id:data.id, userName:data.name})
                console.log(data);
                // 登入成功，導航到 Dashboard 頁面
                navigate('/dashboard');
            } else {
                // 登入失敗，顯示錯誤訊息
                console.error(data.error);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };
      
    const handleLogin = async () => {
        // 執行登入請求
        console.log(username, password)
        await onLogin(username, password);
    };

    const handleLogout = () => {
        // 執行登出操作
        setLoginstatue(false);
        setUsername('');
        setPassword('');
    };

    return (
    <div className='backdrop'>
        {isLoggedIn ? (
            <div>
                <p>{username}!</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <div className='center_panel'>
                <h3>Login FoodMachine</h3>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button onClick={handleLogin}>Login</button>
            </div>
        )}
    </div>
    );
};

export default Loginout;
