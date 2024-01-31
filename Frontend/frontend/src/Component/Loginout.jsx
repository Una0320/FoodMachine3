//Loginout.jsx

import React, { useState } from 'react';

const Loginout = ({ isLoggedIn, setLoginstatue }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                console.log(data);
                // 登入成功，可能需要儲存 token 或其他資訊
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
    <div>
        {isLoggedIn ? (
            <div>
                <p>Hello, {username}!</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <div>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                <br />
                <button onClick={handleLogin}>Login</button>
            </div>
        )}
    </div>
    );
};

export default Loginout;
