import { useParams } from 'react-router-dom';
import React from 'react';
import { useEffect, useState } from 'react';
import BoxInfo from './BoxInfo';
import GrowInfo from './GrowInfo';
import GrowOut from './GrowOut';
import '../CSS/BoxPage.css'

const BoxPage = ({ socket, boxId }) => {
    // const { boxId } = useParams();
    // const socket = useSocket();
    // 使用 boxId 做你的事情

    return (
        <div className='box-page-container'>
            <h2>Box Page for Box ID: {boxId}</h2>
            <button onClick={() => window.history.back()}>Go Back</button>
            <div className='box-info-container'>
                <BoxInfo boxId={ boxId }></BoxInfo> 
            </div>
                {/* <div className='grow-info-container'>
                    <div className='grow-info-column'>
                        <h3>GrowIN Data</h3>
                        <GrowInfo socket={ socket } boxId={ boxId }></GrowInfo>
                    </div>
                    <div className='grow-info-column'>
                        <h3>GrowOUT Data</h3>
                        <GrowOut socket={ socket } boxId={ boxId }></GrowOut>
                    </div>
                </div> */}
        </div>
    );
}

export default BoxPage;
