import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams } from 'react-router-dom'
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useStateContext } from '../context/ContextProvider'; 

import img6 from '../assets/images/avatar/avt-8.jpg'
import img7 from '../assets/images/avatar/avt-2.jpg'
import imgdetail1 from '../assets/images/box-item/images-item-details2.jpg'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import MarketPlace from '../MarketPlace.json';

import { marketplaceAddress} from '../config';


import axios from 'axios';

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const Buffer = require('buffer/').Buffer;

const APIURL =
  'https://api.thegraph.com/subgraphs/name/vromahya/forevercarat-nftquery';

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})



const ItemDetails = () => {

    const [data, setData] = useState();
    
    const [showAuctionForm, setShowAuctionForm] = useState(false);

    const [showDirectBuyForm, setShowDirectBuyForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [ownerData, setOwnerData] = useState();
    const [creatorData, setCreatorData] = useState();
    const [notOnSale, setNotOnSale] = useState(false);
    const [bidHistory,setBidHistory]= useState()
    const {web3Signer} = useStateContext()

    // const [item, setItem] = useState({name:});

    
    const [price, setPrice]=useState();
    const [priceDirect, setPriceDirect] = useState();
    const { tokenId } = useParams();
    
    const createDirectSale = async () => {
    try {
        
    if(!web3Signer){
        toast.error('Please connect the wallet first',{position: toast.POSITION.BOTTOM_RIGHT})
        return;
    }
    const contract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, web3Signer)
    
    
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(priceDirect.toString(), 'ether') 
    
    const transaction = await contract.settleDirectSale(tokenId, {value:price});
    console.log('transaction', transaction)
    const tx = await transaction.wait();
    
        toast.success(`Success! Transaction hash: ${tx.hash}`,{position: toast.POSITION.BOTTOM_RIGHT})
    } catch (error) {
        if(error.error){
            toast.error(`Error in buying item: ${error.error.data.message}`,{position: toast.POSITION.BOTTOM_RIGHT} )
        }     else{

            toast.error(`Error in buying item: ${error.message}`,{position: toast.POSITION.BOTTOM_RIGHT} )
        }
        console.log(error);
    }

    }
    const placeBid = async () => {
      try {
       
        let minimumBid
        if(price){
             minimumBid = price;
        }
        else throw new Error('Ruko thoda sabra karo');
        
        const value = ethers.utils.parseUnits(minimumBid.toString(), 'ether');
        if(!web3Signer){
        toast.error('Please connect the wallet first',{position: toast.POSITION.BOTTOM_RIGHT})
        return;
    }
        let contract = new ethers.Contract(
            marketplaceAddress,
            MarketPlace.abi,
            web3Signer
            );
            const transaction = await contract.placeBid(tokenId, { value: value });
            await transaction.wait();
            toast.success('Success',{position: toast.POSITION.BOTTOM_RIGHT})
      } catch (error) {
        if(error.error){
            toast.error(`Error: ${error.error.data.message}`,{position: toast.POSITION.BOTTOM_RIGHT})
        }else{
            toast.error(`Error: ${error.message}`,{position: toast.POSITION.BOTTOM_RIGHT})
        }
        console.log(error);
      }
    }

    
    
    // console.log(tokenId)
    
    
useEffect(() => {
        setLoading(true)
        
        const getItem = async () => {
            const query = `
    query($tokenId: String)  {
            token(id: $tokenId)
                    {
                        
                        tokenId
                        tokenURI
                        onAuction
                        onDirectSale
                        reservedPrice
                        createdAtTimestamp
                        auctionEndAt
                        owner {
                                id
                                }
                        creator{
                            id
                        }
                    }
                    bids(where: {token: $tokenId}) {
    bidder {
      id
    }
    bid
    createdAtTimeStamp
  }
            }
`;


async function getData(tokenId) {
    const response = await client
  .query({
    query: gql(query),
    variables: {tokenId: tokenId},
  });
  const data = await response.data.token;
  const history = await response.data.bids;
  const owner = await response.data.token.owner.id
  const creator = await response.data.token.creator.id
  
  return [data,history, owner, creator]
}
            const [data, history, owner, creator] = await getData(tokenId);
            
            const meta = await axios.get(`https://ipfs.io/ipfs/${data.tokenURI}`)
            
            const nftData = {
                    ...data, ...meta.data
            }
            let o = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${owner}`)
            let c = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${creator}`)
            o = o.data.user
            c = c.data.user
            if(o.name==='Not updated') o.name = owner;
            if(c.name==='Not updated') c.name = creator;
            setOwnerData(o);
            setCreatorData(c);
            
            
            setData(nftData)
           
            setBidHistory(history)
            const reservedPrice = data.reservedPrice/1000000000000000000;

            setPriceDirect(reservedPrice);
            // setAdditionalData(data)
            // console.log('API data after set',additionalData);
            
            if(!nftData.onAuction && !nftData.onDirectSale){
                setNotOnSale(true);
            }else{
                
                setNotOnSale(false)
            }

            
            
            // console.log(userData)
            setLoading(false)
            // console.log('data', additionalData)   
            // setAdditionalData(data[0])
            // console.log('after set:', additionalData)
        }
        
        getItem()
        console.log(web3Signer);
        // console.log('final data',data)
    }, [tokenId, web3Signer]);


    const handleSubmitAuction = async (e) => {
        e.preventDefault();
        await placeBid();

    }
    const handleSubmitDirectBuy = async (e) => {
        e.preventDefault();
        await createDirectSale();
    }
    

    return (
        <div className='item-details'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Item Details</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Explore</Link></li>
                                    <li>Item Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="tf-section tf-item-details style-2">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="content-left">
                                <div className="media">
                                    {loading?<img src={imgdetail1} alt="Axies" />:<img src={data.image} alt="Axies" />}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="content-right">
                                <div className="sc-item-details">
                                    <div className="meta-item">
                                        <div className="left">
                                            {loading?<h2>loading</h2>:<h2 className='text-capitalize' >{data.name}</h2>}
                                        </div>
                                        <div className="right">
                                            {/* <span className="viewed eye mg-r-8">225</span> */}
                                            {/* <span to="/login" className="liked heart wishlist-button"><span className="number-like">100</span></span> */}
                                        </div>
                                    </div>
                                    <div className="client-infor sc-card-product">
                                        <div className="meta-info overflow-hidden">
                                            <div className="author ">
                                                <div className="avatar">
                                                    {loading? <img src={img6} alt="Axies" />: <img src={ownerData.avatar} alt="Axies" />}
                                                </div>
                                                <div className="info overflow-hidden">
                                                    <span>Owned By</span>
                                                    {loading?<h6> <Link to="/author-02">Loading</Link> </h6>:<h6> <Link to={`/authors/${data.owner.id}`}>{ownerData.name}</Link> </h6>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author ">
                                                <div className="avatar">
                                                    {loading?<img src={img7} alt="Axies" />:<img src={creatorData.avatar} alt="Axies" />}
                                                </div>
                                                <div className="info">
                                                    <span>Created By</span>
                                                    {loading?<h6> <Link to="/author-02">loading</Link> </h6>:<h6> <Link to={`/authors/${data.creator.id}`}>{creatorData.name}</Link> </h6>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {loading? <p>loading</p>:<p>{data.description}</p>}
                                    <div className="meta-item-details">
                                        <div className="item-style-2 item-details">
                                            <ul className="list-details">
                                                {loading?<li><span>Artist : </span><h6>loading</h6> </li>:<li><span>Artist : </span><h6>{data.creator.name}</h6> </li>}
                                                <li><span>Size : </span><h6>3000 x 3000</h6> </li>
                                                <li><span>Create : </span><h6>04 April , 2021</h6> </li>
                                                <li><span>Collection : </span><h6>Cyberpunk City Art</h6> </li>
                                            </ul>
                                        </div>
                                        {notOnSale?<></>:<div className="item-style-2">
                                            <div className="item meta-price">
                                                {
                                                    loading? <p>loading</p>:data.onAuction? <span className="heading">Minimum Bid</span>:<span className="heading">Price</span>
                                                }
                                                <div className="price">
                                                    <div className="price-box">
                                                        {
                                                            loading? <h5>loading</h5>:data.onAuction? <h5> {Math.round(priceDirect*1.1*1000000)/1000000} ETH</h5>:<h5> {Math.round(priceDirect*1000000)/1000000} ETH</h5>
                                                        }
                                                        {loading?<h5>loading</h5>: <span className='mt-1.5 pt-5'>=${Math.round(priceDirect*1000000)*0.48/1000000} </span>}
                                                    </div>
                                                </div>
                                            </div>
                                                {loading?<h5>Loading</h5>: data.onAuction?<div className="item count-down">
                                                        <Countdown date={data.auctionEndAt*1000}>
                                                        <span>Auction Ended</span>
                                                    </Countdown>      
                                                </div>:<></>}
                                        </div>}
                                    </div>
                                    <div>
                                        {
                                        loading?<h5>loading</h5>:notOnSale?<h5 className='mb-2 p-1'>Not on sale</h5> :data.onAuction? <button onClick={()=>setShowAuctionForm(!showAuctionForm)} className="sc-button loadmore style bag fl-button pri-3"><span>Place a bid</span></button>:<button onClick={()=>{setShowDirectBuyForm(!showDirectBuyForm)}} className="sc-button loadmore style bag fl-button pri-3"><span>Buy Now</span></button>
                                    }
                                    {
                                        showAuctionForm && <form onSubmit={handleSubmitAuction}>
                                            
                                            <input type="text" placeholder="enter bid amount" onChange={e => setPrice(e.target.value)} />
                                            <button className="sc-button loadmore style bag fl-button pri-3 mt-10" type='submit'>Place Bid</button>
                                        </form>
                                    }
                                    {
                                        showDirectBuyForm && <form onSubmit={handleSubmitDirectBuy}>                                            
                                            <button className="sc-button loadmore style bag fl-button pri-3" type='submit'>Confirm Buy</button>
                                        </form>
                                    }
                                    </div>
                                    
                                    <div className="flat-tabs themesflat-tabs">
                                        <Tabs>
                                            <TabList>
                                                <Tab>Bid History</Tab>
                                            </TabList>

                                            <TabPanel>
                                                {
                                                    loading? <></>:
                                                    <ul className="bid-history-list">
                                                    {
                                                        bidHistory.map((item, index) => (
                                                            <li key={index} item={item}>
                                                                <div className="content">
                                                                    <div className="client">
                                                                        <div className="sc-author-box style-2">
                                                                            <div><h5>Bidder</h5></div>
                                                                            <div className="author-infor">
                                                                                <div className="name ml-2">
                                                                                    <h6>{item.bidder.id}</h6> 
                                                                                </div>
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="price md-2">
                                                                        <h5>Bid {Math.round(item.bid/10000000000000)/100000} MATIC</h5>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                                }
                                            </TabPanel>
                                            
                                            
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
            {/* <LiveAuction data={liveAuctionData} /> */}
            <Footer />
        </div>
    );
}

export default ItemDetails;
