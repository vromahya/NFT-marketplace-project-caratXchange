import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams } from 'react-router-dom'
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import liveAuctionData from '../assets/fake-data/data-live-auction';
import LiveAuction from '../components/layouts/LiveAuction';
import img1 from '../assets/images/avatar/avt-3.jpg'
import img6 from '../assets/images/avatar/avt-8.jpg'
import img7 from '../assets/images/avatar/avt-2.jpg'
import imgdetail1 from '../assets/images/box-item/images-item-details2.jpg'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import MarketPlace from '../MarketPlace.json';
import { marketplaceAddress } from '../config';
import { createClient } from 'urql';
import axios from 'axios';
import users from '../assets/fake-data/users'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const APIURL =
  'https://api.thegraph.com/subgraphs/name/vromahya/forevercarat-nftquery';

const query = `
    query  {
            tokens
                    {
                        
                        tokenId
                        tokenURI
                        onAuction
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
            }
`;
const client = createClient({ url: APIURL });

async function getData(tokenId) {
  const response = await client.query(query).toPromise();
//   console.log(response)
  const fullData = await response.data.tokens;
//   console.log('fullData',fullData)
//   console.log(tokenId)
  const data = fullData.filter((data)=>data.tokenId===tokenId);
//   console.log('filteredData',data);
  return data;
}



const ItemDetails02 = () => {

    const [data, setData] = useState();

    const [additionalData, setAdditionalData ] = useState();

    const [showAuctionForm, setShowAuctionForm] = useState(false);

    const [showDirectBuyForm, setShowDirectBuyForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState();

    // const [item, setItem] = useState({name:});

    
    const [price, setPrice] = useState();
    const [priceDirect, setPriceDirect] = useState();
    const { tokenId } = useParams();
    
    const createDirectSale = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)
    console.log(contract)
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(priceDirect.toString(), 'ether') 
   
    const transaction = await contract.settleDirectSale(tokenId, {value:price});
    console.log(transaction)
    const tx = await transaction.wait();
    console.log(tx)
        toast.success('Success',{position: toast.POSITION.BOTTOM_RIGHT})

    }
    const placeBid = async () => {
      try {
            const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        console.log('tokenId:', tokenId)
        console.log(price)
        const value = ethers.utils.parseUnits(price.toString(), 'ether');
        console.log('price:', value)
        let contract = new ethers.Contract(
            marketplaceAddress,
            MarketPlace.abi,
            signer
            );
            const transaction = await contract.placeBid(tokenId, { value: value });
            await transaction.wait();
            toast.success('Success',{position: toast.POSITION.BOTTOM_RIGHT})
      } catch (error) {
          console.log(error)
      }
    }

    
    
    // console.log(tokenId)
    
    
    useEffect(() => {
        setLoading(true)
        
        const getItem = async () => {
            const data = await getData(tokenId)
            const meta = await axios.get(data[0].tokenURI)
            const data1 = data[0]
            const nftData = {
                    ...data1, ...meta.data
            }
            setPriceDirect(data1.reservedPrice);
            // console.log('nft data',nftData);
            setData(nftData)
            console.log(nftData)
            // console.log('Meta',meta.data)
            // setAdditionalData(data)
            // console.log('API data after set',additionalData);
            const owner = (await users.filter(user=>user.address===nftData.owner.id))[0]
            const creator = (await users.filter(user=>user.address===nftData.creator.id))[0]

            setUserData({owner,creator})
            // console.log(userData)
            setLoading(false)
            // console.log('data', additionalData)   
            // setAdditionalData(data[0])
            // console.log('after set:', additionalData)
        }
        
        getItem()
        // console.log('final data',data)

        
        

    }, []);


    const handleSubmitAuction = async (e) => {
        e.preventDefault();
        await placeBid();

    }
    const handleSubmitDirectBuy = async (e) => {
        e.preventDefault();
        await createDirectSale();
        
    }



    const [dataHistory] = useState(
        [

        ]
    )

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
                                            {loading?<h2>loading</h2>:<h2>{data.name}</h2>}
                                        </div>
                                        <div className="right">
                                            {/* <span className="viewed eye mg-r-8">225</span> */}
                                            {/* <span to="/login" className="liked heart wishlist-button"><span className="number-like">100</span></span> */}
                                        </div>
                                    </div>
                                    <div className="client-infor sc-card-product">
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    {loading? <img src={img6} alt="Axies" />: <img src={userData.owner.avatar} alt="Axies" />}
                                                </div>
                                                <div className="info">
                                                    <span>Owned By</span>
                                                    {loading?<h6> <Link to="/author-02">Loading</Link> </h6>:<h6> <Link to="/author-02">{userData.owner.name}</Link> </h6>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    {loading?<img src={img7} alt="Axies" />:<img src={userData.creator.avatar} alt="Axies" />}
                                                </div>
                                                <div className="info">
                                                    <span>Created By</span>
                                                    {loading?<h6> <Link to="/author-02">loading</Link> </h6>:<h6> <Link to="/author-02">{userData.creator.name}</Link> </h6>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {loading? <p>loading</p>:<p>{data.description}</p>}
                                    <div className="meta-item-details">
                                        <div className="item-style-2 item-details">
                                            <ul className="list-details">
                                                <li><span>Artist : </span><h6>Ralph Garraway</h6> </li>
                                                <li><span>Size : </span><h6>3000 x 3000</h6> </li>
                                                <li><span>Create : </span><h6>04 April , 2021</h6> </li>
                                                <li><span>Collection : </span><h6>Cyberpunk City Art</h6> </li>
                                            </ul>
                                        </div>
                                        <div className="item-style-2">
                                            <div className="item meta-price">
                                                {
                                                    loading? <p>loading</p>:data.onAuction? <span className="heading">Minimum Bid</span>:<span className="heading">Price</span>
                                                }
                                                <div className="price">
                                                    <div className="price-box">
                                                        {
                                                            loading? <h5>loading</h5>:data.onAuction? <h5> {(Number(data.reservedPrice)/1000000000000000000)*1.1} ETH</h5>:<h5> {(Number(data.reservedPrice)/1000000000000000000)} ETH</h5>
                                                        }
                                                        <span>= $12.246</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="item count-down">
                                                {loading?<h5>Loading</h5>: data.onAuction? <Countdown date={data.auctionEndAt-Date.now()}>
                                                    <span>Auction Ended</span>
                                                </Countdown>: <></>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <button onClick={placeBid} className="sc-button loadmore style bag fl-button pri-3"><span>Place a bid</span></button>  */}
                                    {
                                        loading?<h5>loading</h5>:data.onAuction? <button onClick={()=>setShowAuctionForm(!showAuctionForm)} className="sc-button loadmore style bag fl-button pri-3"><span>Place a bid</span></button>:<button onClick={()=>{setShowDirectBuyForm(!showDirectBuyForm)}} className="sc-button loadmore style bag fl-button pri-3"><span>Buy Now</span></button>
                                    }
                                    {
                                        showAuctionForm && <form onSubmit={handleSubmitAuction}>
                                            <h5 className="title-create-item">Minimum bid</h5>
                                            <input type="text" placeholder="enter bid amount" onChange={e => setPrice(e.target.value)} />
                                            <button className="sc-button loadmore style bag fl-button pri-3 mt-3" type='submit'>Place Bid</button>
                                        </form>
                                    }
                                    {
                                        showDirectBuyForm && <form onSubmit={handleSubmitDirectBuy}>                                            
                                            <button className="sc-button loadmore style bag fl-button pri-3" type='submit'>Confirm Buy</button>
                                        </form>
                                    }
                                    <div className="flat-tabs themesflat-tabs">
                                        <Tabs>
                                            <TabList>
                                                <Tab>Bid History</Tab>
                                                <Tab>Info</Tab>
                                                <Tab>Provenance</Tab>
                                            </TabList>

                                            <TabPanel>
                                                <ul className="bid-history-list">
                                                    {
                                                        dataHistory.map((item, index) => (
                                                            <li key={index} item={item}>
                                                                <div className="content">
                                                                    <div className="client">
                                                                        <div className="sc-author-box style-2">
                                                                            <div className="author-avatar">
                                                                                <Link to="#">
                                                                                    <img src={item.img} alt="Axies" className="avatar" />
                                                                                </Link>
                                                                                <div className="badge"></div>
                                                                            </div>
                                                                            <div className="author-infor">
                                                                                <div className="name">
                                                                                    <h6><Link to="/author-02">{item.name} </Link></h6> <span> place a bid</span>
                                                                                </div>
                                                                                <span className="time">{item.time}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="price">
                                                                        <h5>{item.price}</h5>
                                                                        <span>= {item.priceChange}</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </TabPanel>
                                            <TabPanel>
                                                <ul className="bid-history-list">
                                                    <li>
                                                        <div className="content">
                                                            <div className="client">
                                                                <div className="sc-author-box style-2">
                                                                    <div className="author-avatar">
                                                                        <Link to="#">
                                                                            <img src={img1} alt="Axies" className="avatar" />
                                                                        </Link>
                                                                        <div className="badge"></div>
                                                                    </div>
                                                                    <div className="author-infor">
                                                                        <div className="name">
                                                                            <h6> <Link to="/author-02">Mason Woodward </Link></h6> <span> place a bid</span>
                                                                        </div>
                                                                        <span className="time">8 hours ago</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="provenance">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                        It has survived not only five centuries, but also the leap into electronic typesetting,
                                                        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                                                        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                                </div>
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

export default ItemDetails02;
