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

import NFTMarket from '../NFTMarket.json';
import { nftMarketAddress } from '../config';
import { createClient } from 'urql';

const APIURL =
    'https://api.thegraph.com/subgraphs/name/vromahya/jewelverse-api';

const query = `
    query  {
            tokens(first: 5) 
                            {
                            id
                            tokenId
                            tokenURI
                            onAuction
                            reservedPrice
                            owner {
                                id
                            }
                            }
            }
`;
const client = createClient({ url: APIURL });




const ItemDetails02 = () => {

    const [data, setData] = useState();

    const [showFormAuctionForm, setShowAuctionForm] = useState(false);

    const [showDirectBuyForm, setShowDirectBuyForm] = useState(false);

    const [loading, setLoading] = useState(true);

    // const [item, setItem] = useState({name:});


    const [price, setPrice] = useState();
    const { tokenId } = useParams();

    const createDirectSale = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const value = ethers.utils.parseUnits(price, 'ether');
        let contract = new ethers.Contract(
            nftMarketAddress,
            NFTMarket.abi,
            signer
        );

        const transaction = await contract.createDirectSale(tokenId, { value: value });
        await transaction.wait();

    }
    const placeBid = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const value = ethers.utils.parseUnits(price, 'ether');
        let contract = new ethers.Contract(
            nftMarketAddress,
            NFTMarket.abi,
            signer
        );
        const transaction = await contract.placeBid(tokenId, { value: value });
        await transaction.wait();
    }



    // console.log(tokenId)


    useEffect(() => {
        const getItem = async () => {
            const response = await client.query(query).toPromise();
            const fullData = response.data.tokens;
            const data = fullData.filter(data => data.tokenId === tokenId);
            setData(data)
            
            setLoading(false);
            console.log(data);
            

        }
        getItem();


    }, [tokenId]);


    const handleSubmitAuction = async (e) => {
        e.preventDefault();
        await placeBid();
        console.log('success');

    }
    const handleSubmitDirectBuy = async (e) => {
        e.preventDefault();
        setPrice(Number(data[0].reservedPrice)/1000000000000000000);
        await createDirectSale();
        console.log("success");
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
                                <h1 className="heading text-center">Item Details 2</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Explore</Link></li>
                                    <li>Item Details 2</li>
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
                                    <img src={imgdetail1} alt="Axies" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="content-right">
                                <div className="sc-item-details">
                                    <div className="meta-item">
                                        <div className="left">
                                            <h2>“The Pretty Fantasy Flower illustration ”</h2>
                                        </div>
                                        <div className="right">
                                            <span className="viewed eye mg-r-8">225</span>
                                            <span to="/login" className="liked heart wishlist-button"><span className="number-like">100</span></span>
                                        </div>
                                    </div>
                                    <div className="client-infor sc-card-product">
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    <img src={img6} alt="Axies" />
                                                </div>
                                                <div className="info">
                                                    <span>Owned By</span>
                                                    <h6> <Link to="/author-02">Ralph Garraway</Link> </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    <img src={img7} alt="Axies" />
                                                </div>
                                                <div className="info">
                                                    <span>Create By</span>
                                                    <h6> <Link to="/author-02">Freddie Carpenter</Link> </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Habitant sollicitudin faucibus cursus lectus pulvinar dolor non ultrices eget.
                                        Facilisi lobortisal morbi fringilla urna amet sed ipsum vitae ipsum malesuada.
                                        Habitant sollicitudin faucibus cursus lectus pulvinar dolor non ultrices eget.
                                        Facilisi lobortisal morbi fringilla urna amet sed ipsum</p>
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
                                                    loading? <p>loading</p>:data[0].onAuction? <span className="heading">Minimum Bid</span>:<span className="heading">Price</span>
                                                }
                                                <div className="price">
                                                    <div className="price-box">
                                                        {
                                                            loading? <h5>loading</h5>:<h5> {Number(data[0].reservedPrice)/1000000000000000000}</h5>
                                                        }
                                                        <span>= $12.246</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="item count-down">
                                                <Countdown date={Date.now() + 500000000}>
                                                    <span>You are good to go!</span>
                                                </Countdown>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <button onClick={placeBid} className="sc-button loadmore style bag fl-button pri-3"><span>Place a bid</span></button> */}
                                    {
                                        loading?<h5>loading</h5>:data[0].onAuction? <button onClick={()=>setShowAuctionForm(true)} className="sc-button loadmore style bag fl-button pri-3"><span>Place a bid</span></button>:<button onClick={()=>{setShowDirectBuyForm(true)}} className="sc-button loadmore style bag fl-button pri-3"><span>Buy Now</span></button>
                                    }
                                    {
                                        showFormAuctionForm && <form onSubmit={handleSubmitAuction}>
                                            <h1 className="title-create-item">Minimum bid</h1>
                                            <input type="text" placeholder="enter bid amount" onChange={e => setPrice(e.target.value)} />
                                            <button className="sc-button loadmore style bag fl-button pri-3" type='submit'>Place Bid</button>
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
            <LiveAuction data={liveAuctionData} />
            <Footer />
        </div>
    );
}

export default ItemDetails02;