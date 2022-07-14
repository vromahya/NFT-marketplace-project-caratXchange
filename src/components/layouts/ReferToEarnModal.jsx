import React from 'react';
import { Modal } from "react-bootstrap";
import {Link} from 'react-router-dom'
import './ReferToEarnModal.css'

const ReferToEarnModal = (props) => {
  return (
    <Modal
    show={props.show}
    onHide={props.onHide}
    >
    <Modal.Header closeButton></Modal.Header>
    <div className="modal-body space-y-20 pd-40">
        <h3 className="text-center">Refer & Earn up to $1000!</h3>
        <div className="h-1 w-full" style={{borderWidth: "1px", borderStyle: 'solid', borderColor: '#cccccc', borderRadius: '10px'}}></div>
        
        <ol id='ol'>
          <li className='li'>Refer up to 10 friends to join CaratXchange and purchase a jewelery NFT</li>
          <li className='li'>Enter their Email IDs on this <a href="https://docs.google.com/forms/d/e/1FAIpQLSdN_lDFNWMKI5DASR1-to6KpxmV8a3euWMSOU-KeCYTOOREqQ/viewform?usp=sf_link" id='link'>form</a>  </li>
          <li className='li'>You and your friend will each receive 10% of your friend’s first transaction’s value as a cash reward* in your crypto wallets!</li>
        </ol>
        <div className="d-flex justify-content-center">
          <button id='refBtn'><a href="https://docs.google.com/forms/d/e/1FAIpQLSdN_lDFNWMKI5DASR1-to6KpxmV8a3euWMSOU-KeCYTOOREqQ/viewform?usp=sf_link" >Refer & Earn</a></button>
        </div>
        <div className="d-flex justify-content-between">
          <p className='para'>Note: Rewards will be credited every Friday till offer lasts</p>
          <p className='para'>*Terms and conditions apply</p>
        </div>
    </div>
    </Modal>
  );
};

export default ReferToEarnModal;
