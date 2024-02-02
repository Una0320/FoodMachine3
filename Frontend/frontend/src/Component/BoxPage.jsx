import React from 'react';
import BoxInfo from './BoxInfo';
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

        </div>
    );
}

export default BoxPage;
