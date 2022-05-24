import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel  } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import img1 from '../assets/images/box-item/image-box-6.jpg'
import avt from '../assets/images/avatar/avt-9.jpg'
import {create as ipfsHttpClient} from 'ipfs-http-client';

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'


import NFTMarket from '../NFTMarket.json';
import {nftMarketAddress} from '../config';

import users from '../assets/fake-data/users';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateItem = () => {

const [fileUrl, setFileUrl] = useState(null);

const [formInput, setFormInput] = useState({price:'', name: '', description:''});
const [formInput2, setFormInput2] = useState({name:'', minimumBid:'', duration:''});
const [previewStateFixedPice, setPreviewState] = useState(true);

const [loading, setLoading] = useState(true);

const [user, setUser] = useState();



async function onChange(e) {
  const file = e.target.files[0];
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    const url = `https://gateway.pinata.cloud/ipfs/${added.path}`;
    setFileUrl(url);
  } catch (error) {
    console.log('Error uploading file: ', error);
  }
//   console.log(`File url: ${fileUrl}`);
}

async function uploadToIPFS() {
  const { name, description} = formInput;
  if (!name || !description || !fileUrl) return;
  /* first, upload to IPFS */
  const data = JSON.stringify({
    name,
    description,
    image: fileUrl,
  });
  try {
    const added = await client.add(data);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    /* after file is uploaded to IPFS, return the URL to use it in the transaction */
    return url;
  } catch (error) {
    console.log('Error uploading file: ', error);
  }
}
async function uploadToIPFS2() {
  const { name, description } = formInput2;
  if (!name || !description || !fileUrl) return;
  /* first, upload to IPFS */
  const data = JSON.stringify({
    name,
    description,
    image: fileUrl,
  });
  try {
    const added = await client.add(data);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    /* after file is uploaded to IPFS, return the URL to use it in the transaction */
    return url;
  } catch (error) {
    console.log('Error uploading file: ', error);
  }
}
async function listNFTForDirectSale() {
  const url = await uploadToIPFS();
  
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  /* next, create the item */
  const price = ethers.utils.parseUnits(formInput.price, 'ether');
  let contract = new ethers.Contract(
    nftMarketAddress,
    NFTMarket.abi,
    signer
  );

  let transaction = await contract.mintToken(url);
  let tx = await transaction.wait();

  let eventVal = tx.events.find(event => event.event === "Transfer").args.tokenId;

  
  let tokenId = Number(eventVal._hex);
  

  let createDirectSale = await contract.createDirectSaleItem(tokenId, price);
  await createDirectSale.wait();
  
}
async function listNFTForAuction(){

    const url = await uploadToIPFS2();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
  /* next, create the item */
  const price = ethers.utils.parseUnits(formInput.price, 'ether');
  let contract = new ethers.Contract(
    nftMarketAddress,
    NFTMarket.abi,
    signer
  );

  let transaction = await contract.mintToken(url);
  let tx = await transaction.wait();
  const duration = formInput2.duration*24*60*60;
  let eventVal = tx.events.find(event => event.event === "Transfer").args.tokenId;
  let tokenId = Number(eventVal._hex);

  let createAuctionItem = await contract.createAuction(tokenId, price, duration);
  await createAuctionItem.wait();

  
}

const handleSubmitTab1 = async (e) =>{
e.preventDefault();
listNFTForDirectSale();

}
const handleSubmitTab2 = async (e) =>{
    e.preventDefault();
    listNFTForAuction();
    // console.log(formInput2.duration*24*60*60);
    console.log('success');
    
}
useEffect(()=>{
    async function getUser(){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress(); 
    const user = users.filter((user)=>user.address===userAddress);
    setUser(user[0])
    setLoading(false);
    console.log(userAddress);
    console.log(user);
}

    getUser();


},[])

    return (
        <div className='create-item'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Create Item</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Pages</Link></li>
                                    <li>Create Item</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <div className="tf-create-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                         <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <h4 className="title-create-item">Preview item</h4>
                            <div className="sc-card-product">
                                <div className="card-media">
                                    {
                                        fileUrl?<img src={fileUrl} alt="Axies" />:<img src={img1} alt="Axies" />
                                    }
                                    {formInput2.duration && 
                                    <div className="featured-countdown">
                                        <span className="slogan"></span>
                                         <Countdown date={Date.now() + (formInput2.duration*24*60*60)}>
                                            <span>You are good to go!</span>
                                        </Countdown>
                                    </div>
                                        }
                                </div>
                                <div className="card-title">
                                    {
                                       previewStateFixedPice? <h5>{formInput.name}</h5> : <h5>{formInput2.name}</h5> 
                                    }
                                    {/* <div className="tags">bsc</div> */}
                                </div>
                                <div className="meta-info">
                                    <div className="author">
                                        <div className="avatar">
                                            {
                                                loading? <img src={avt} alt="Axies" />:<img src={user.avatar} alt="Axies" />
                                            }
                                        </div>
                                        <div className="info">
                                            <span>Owned By</span>
                                            {
                                                loading?<h6> <Link to="/author-02">Freddie Carpenter</Link></h6>:<h6> <Link to="/author-02">{user.name}</Link></h6>
                                            }
                                        </div>
                                    </div>
                                    <div className="price">
                                        {
                                            previewStateFixedPice?
                                        <div>
                                            <span>Price</span>
                                            <h5>{formInput.price} Eth</h5>
                                        </div>:
                                        <div>
                                            <span>Current Bid</span>
                                            <h5>{formInput2.minimumBid}</h5>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className="card-bottom">
                                    {
                                        previewStateFixedPice? 
                                        <h5 className="sc-button style bag fl-button pri-3"><span>Buy Now</span></h5>:
                                        <h5 className="sc-button style bag fl-button pri-3"><span>Place Bid</span></h5>
                                    }
                                    <h5 className="view-history reload">View History</h5>
                                </div>
                            </div>
                         </div>
                         <div className="col-xl-9 col-lg-6 col-md-12 col-12">
                             <div className="form-create-item">
                                 <form action="#">
                                    <h4 className="title-create-item">Upload file</h4>
                                    <label className="uploadFile">
                                        <span className="filename">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</span>
                                        <input type="file" className="inputfile form-control" name="file"  onChange={onChange}/>
                                    </label>
                                 </form>
                                <div className="flat-tabs tab-create-item">
                                    <h4 className="title-create-item">Select method</h4>
                                    <Tabs>
                                        <TabList>
                                            <Tab onClick={()=>setPreviewState(true)}><span className="icon-fl-tag" ></span>Fixed Price</Tab>
                                            <Tab onClick={()=>setPreviewState(false)}><span className="icon-fl-clock"></span>Timed Auction</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <form onSubmit={handleSubmitTab1} >
                                                <h4 className="title-create-item">Price</h4>
                                                <input type="text" placeholder="Enter price for one item (ETH)" onChange={(e)=>{setFormInput({...formInput, price: e.target.value})}}  />

                                                <h4 className="title-create-item">Title</h4>
                                                <input type="text" placeholder="Item Name" onChange={(e)=>{setFormInput({...formInput, name: e.target.value})}} />

                                                <h4 className="title-create-item">Description</h4>
                                                <textarea placeholder="e.g. “This is very limited item”" onChange={(e)=>{setFormInput({...formInput, description: e.target.value})}}></textarea>

                                                
                                                <button className="mt-12" type='submit'>Create Item</button>
                                            </form>
                                        </TabPanel>
                                        <TabPanel>
                                            <form onSubmit={handleSubmitTab2}>
                                                <h4 className="title-create-item">Minimum bid</h4>
                                                <input type="text" placeholder="enter minimum bid" onChange={e=>setFormInput2({...formInput2, minimumBid: e.target.value})} />
                                                <div >
                                                    <div className="col">
                                                        <h5 className="title-create-item">Duration</h5>
                                                        <input type="number" name="duration" id="duration" className="form-control" min="1" onChange={e=>setFormInput2({...formInput2, duration: e.target.value})}/>
                                                    </div>                            
                                                </div>

                                                <h4 className="title-create-item">Title</h4>
                                                <input type="text" placeholder="Item Name" onChange={e=>setFormInput2({...formInput2, name: e.target.value})}/>

                                                <h4 className="title-create-item">Description</h4>
                                                <textarea placeholder="e.g. “This is very limited item”" onChange={e=>setFormInput2({...formInput2, description: e.target.value})}></textarea>
                                            <button className="mt-12" type='submit'>Create Item</button>
                                            </form>
                                        </TabPanel>
                                        
                                    </Tabs>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CreateItem;
