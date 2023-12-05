// AddBoxForm.jsx

import React, { useEffect, useState } from "react";

const AddBoxForm = ({ onClose, onBoxAdded }) => {
    const [boxData, setBoxData] = useState({
        boxname: "",
        users:[],
        plant:[]
    // 其他 box 屬性
    });

    const [UserOptions, setUserOptions] = useState([]);
    const [plantOptions, setPlantOptions] = useState([]);

    const handleInputChange = (e) => {
        const { name, value, options } = e.target;
        console.log(name, value);

        // 如果是多選的 select 元素
        if (options) {
            const selectedValues = Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value);

            setBoxData({ ...boxData, [name]: selectedValues });
            /*
            const selectedValues = [];
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.selected) {
                    selectedValues.push(option.value);
                }
            }
            */
        } else {
            // 如果是其他 input 元素
            setBoxData({ ...boxData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 發送 POST 請求，新增 boxData 到資料庫

        // 假設 API endpoint 是 http://127.0.0.1:8000/newbox
        console.log(JSON.stringify(boxData));
        const response = await fetch("http://127.0.0.1:8000/newbox/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(boxData),
        });

        if (response.ok) {
            // 新增成功，執行回調函數
            onBoxAdded();
        } else {
            // 新增失敗，處理錯誤
            console.error("Failed to add box");
        }
    };

    useEffect(() => {
        // 獲取使用者資料的 API 請求
        const fetchUser = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/userlist/");
                if (response.ok) {
                    const userData = await response.json();
                    // 將使用者資料轉換為選項格式（id 和 label）
                    const UserOptions = userData.map((user) => ({
                        id: user.id,
                        label: user.username,
                    }));
                    setUserOptions(UserOptions);
                } else {
                    console.error(`Failed to fetch user data. Status: ${response.status}`);
                }
            } catch (error) {
                console.error("An error occurred while fetching user data:", error);
            }
        };
    
        // 執行植物資料的 API 請求
        fetchUser();
        }, []); //empty array means only run in first render

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <label>
                New Boxname:
                <input type="text" name="boxname" value={boxData.boxname} onChange={handleInputChange} />
            </label>
            <label>
                Box User: 
                {/* <input type="text" name="name" value={boxData.users} onChange={handleInputChange} /> */}
                <select
                    name="users"
                    multiple
                    value={boxData.users}
                    onChange={handleInputChange}
                >
                    {UserOptions.map((user) => (
                        <option key={user.id} value={user.id}>{user.label}</option>
                    ))}
                </select>
            </label>
            {/* 其他 box 屬性的輸入欄位 */}
            <button type="submit">Add Box</button>
        </form>
        <button onClick={onClose}>Close</button>
    </div>
    );
};

export default AddBoxForm;
