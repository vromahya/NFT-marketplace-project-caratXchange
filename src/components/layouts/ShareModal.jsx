import React, { useState,useEffect } from 'react';

import {
  FacebookShareButton,  
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  RedditShareButton,  
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,  
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  EmailIcon,
} from 'react-share';
import { Modal } from "react-bootstrap";

import {AiFillCopy} from 'react-icons/ai'

const ShareModal = (props) => {

    const [Copied, setCopied] = useState(false)
    const url = props.url;
    const title = 'caratxchange'
    
    const copy = async () => {
    await navigator.clipboard.writeText(url); 
    setCopied(true)   
    }

 useEffect(() => {
   setCopied(false);
 
   return () => {}
 }, [])
    

return (

    <Modal
    show={props.show}
    onHide={props.onHide}
  >
    <Modal.Header closeButton></Modal.Header>

    <div className="d-flex justify-content-around gap-2">
        <FacebookShareButton url={url} title={title}>
            <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <TelegramShareButton url={url} title={title}>
            <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <PinterestShareButton url={url} title={title}>
            <PinterestIcon size={32} round />
        </PinterestShareButton>
        <RedditShareButton url={url} title={title}>
            <RedditIcon size={32} round />
        </RedditShareButton>
        <EmailShareButton url={url} title={title}>
            <EmailIcon size={32} round />
        </EmailShareButton>
    </div>
    <div className="d-flex m-4">
        <input type="text" value={url} className='flex-fill p-2' readOnly/>
        <button onClick={copy} className='m-2 p-2' style={{height:"35px", width:"55px"}}><AiFillCopy/></button>
    </div>

    {Copied && <h4 className='text-success text-center my-2'>Copied!!</h4> }
    
    
    </Modal>
    
  );
};

export default ShareModal;
