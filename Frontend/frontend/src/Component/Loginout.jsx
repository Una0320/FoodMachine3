//Loginout.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


import '../CSS/Loginout.css';

const Loginout = ({ isLoggedIn, setLoginstatue, setCurUser }) => {
    const api_url = 'http://192.168.1.182:8000'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [regname, setRegname] = useState('');
    const [regpwd, setRegpwd] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);
    const isDisabled = usernameExists || invalidUsername || regname === '';

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const onLogin = async (username, password) => {
        try {
            const response = await fetch(`${api_url}/login/`, {
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
        // 登出後導航到登入頁面
        navigate('/');
    };

    const handleRegisterClick = () => {
        setIsRegistering(!isRegistering); // 點擊註冊按鈕時設置狀態為註冊中
    };

    const handleRegisterING = async () => {
        await registerNew(regname, regpwd);
        setIsRegistering(false);
    };

    const registerNew = async (regusername, regpassword) => {
        try {
            const response = await fetch(`${api_url}/newuser/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: regusername,
                    password: regpassword,
                }),
            });
        
            const data = await response.json();
            // console.log('API Response:', response);

            // 根據後端的回應執行相應的操作
            if (response.ok) {
                console.log(data);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    }

    const handleUsernameChange = async (e) => {
        const newUsername = e.target.value;

        // 檢查用戶名是否包含錯誤字符的邏輯
        const invalidCharactersRegex = /[^a-zA-Z0-9_]/;
        if (invalidCharactersRegex.test(newUsername)) {
            setInvalidUsername(true);
        } else {
            setInvalidUsername(false);
        }

        // 檢查用戶名是否已存在的邏輯
        // 使用 API 請求檢查用戶名是否已存在
        try {
            const response = await fetch(`${api_url}/checkname/${newUsername}/`);
            if (response.ok) {
                // 如果請求成功，解析回應的 JSON 數據
                const data = await response.json();
                const usernameExists = data.message; // 從回應數據中獲取用戶名是否已存在的信息
                setUsernameExists(usernameExists); // 設置用戶名是否已存在的狀態
            } else {
                console.error('Failed to check username existence:', response.statusText);
            }
        } catch (error) {
            console.error('Error checking username existence:', error);
        }


        // 更新用戶名狀態
        setRegname(newUsername);
    };

    return (
    <div className='backdrop'>
        {isLoggedIn ? (
            <div>
                <p>{username}!</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <div className='container'>
               
            <div className={`center_panel ${isRegistering ? 'registering' : ''}`}>
                <h3>Login FoodMachine</h3>
                <TextField
                    id="standard-basic" label="Username" variant="standard"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                <img 
                                    style={{ width: '20px', height: '20px' }} 
                                    src='/user.png' // 替換為您的用戶名圖示路徑
                                    alt="username icon"
                                />
                                </IconButton>
                            </InputAdornment>
                        ),
                        style: { color: 'white', borderBottom: '1px solid white' },
                    }}
                    InputLabelProps= {{
                        style: { color: 'white' },
                    }}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    id="standard-password-input" label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    // edge="false"
                                    style={{color:'white'}}
                                    >
                                    <img 
                                        style={{ width: '20px', height: '20px' }} 
                                        src='/key.png' // 替換為您的用戶名圖示路徑
                                        alt="password icon"
                                    />
                                    {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                                </IconButton>
                                {/* <img style={{width:'20px', height:'20px'}} src='/key.png'></img> */}
                                {/* <AccountCircle style={{ color: 'white' }} src='/key.png'/> */}
                            </InputAdornment>
                        ),
                        style: { color: 'white', borderBottom: '1px solid white' },
                    }}
                    variant="standard"
                    InputLabelProps= {{
                        style: { color: 'white' },
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className='btnarea'>
                    <button className='submitbtn' onClick={handleLogin}>Login</button>
                    <button className='submitbtn' onClick={handleRegisterClick}>Register</button>
                </div>
            </div>
            {isRegistering && (
                <div className='register_panel'>
                    <h3>Register</h3>
                    <TextField 
                        id="register-username" label="Username"
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                
                                <InputAdornment position="end">
                                    <Tooltip open={regname !== ''}
                                            placement="right"
                                            title={usernameExists ? "Username is already registered" : (invalidUsername ? "Username contains invalid characters" : "")}>
                                    <AccountCircle style={{ color: 'white' }} />
                                    </Tooltip>
                                </InputAdornment>
                                
                            ),
                            style: { color: 'white', borderBottom: '1px solid white' },
                        }}
                        InputLabelProps= {{
                            style: { color: 'white' },
                        }}
                        value={regname}
                        onChange={handleUsernameChange}
                        // onChange={(e) => setRegname(e.target.value)}
                    />
                    <TextField
                        id="register-password" label="Password"
                        type="password"
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <img style={{width:'20px', height:'20px'}} src='/key.png'></img>
                                </InputAdornment>
                            ),
                            style: { color: 'white', borderBottom: '1px solid white' },
                        }}
                        variant="standard"
                        InputLabelProps= {{
                            style: { color: 'white' },
                        }}
                        onChange={(e) => setRegpwd(e.target.value)}
                    />
                    {/* 註冊按鈕 */}
                    <div className='btnarea'>
                        <button className='submitbtn' 
                                onClick={handleRegisterING}
                                disabled={isDisabled}>Register</button>
                    </div>
                </div>
            )}
            </div>
        )}
    </div>
    );
};

export default Loginout;
