import React, {useState, useEffect} from 'react';

import axios from 'axios';

import { Modal } from "react-bootstrap";
import { useStateContext } from '../../context/ContextProvider';


const CardModal = (props) => {

    const tokenId = props.tokenId;
    

    const {web3Signer} = useStateContext();

    const [amount, setAmount] = useState();
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false);
    const [walletError, setWalletError] = useState();
    

    const makeOffer= async ()=>{
        console.log(web3Signer)
        if(!web3Signer){
            setError(true)
            setWalletError('Connect Wallet Please!')
            return;
        }
         try {
            
            const data = {tokenId, offerer: web3Signer._address, amount}
            console.log(data)
             await axios.post(`https://forever-carat-api.herokuapp.com/api/v1/offers/`,data,{headers:{"Content-Type" : "application/json"}})
            setSuccess(true)
         } catch (error) {
            setError(true)
         }
         
    }
    useEffect(()=>{
        setError(false)
        setSuccess(false)
        return ()=>{}
    },[])
    
    

return (

    <Modal
    show={props.show}
    onHide={props.onHide}
  >
    <Modal.Header closeButton></Modal.Header>

    <div className="modal-body space-y-20 pd-40">
        <h3>Make an offer</h3>
        <input type="text" className="form-control"
            placeholder="00.00 MATIC" onChange={(e)=>setAmount(e.target.value)}/>
        <button className="btn btn-primary" onClick={makeOffer} >Make Offer</button> 
    </div>
    {success&& <div className='bg-success opacity-50'>
        <h3 className='text-center mb-2'>Success!!</h3>
    </div> }
    {
        error && <div className="bg-danger opacity-50">
            <h3 className='text-center mb-2'>Error!{walletError}</h3>
        </div>
    }
    </Modal>
    
  );
};

export default CardModal;
