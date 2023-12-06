// BoxInfo.jsx
import React from 'react';

const BoxInfo = ({ data }) => (
  <div>
    <h1>Box Info</h1>
    <p>Box id: {data.id}</p>
    <p>Box name: {data.name}</p>
    <p>Users: {data.users}</p>
    <p>Plant: {data.plant}</p>
  </div>
);

export default BoxInfo;
