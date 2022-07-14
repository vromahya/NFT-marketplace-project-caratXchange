import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams, useLocation } from 'react-router-dom'
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useStateContext } from '../context/ContextProvider';

import img6 from '../assets/images/avatar/avt-8.jpg'
import img7 from '../assets/images/avatar/avt-2.jpg'
import imgdetail1 from '../assets/images/box-item/images-item-details2.jpg'
import { ethers } from 'ethers'
import MarketPlace from '../MarketPlace.json';
import CardModal from '../components/layouts/CardModal';
import { marketplaceAddress } from '../config';
import { IconContext } from "react-icons";
import { BsShare } from 'react-icons/bs'
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ImageGallery from '../components/ImageGallery';
import { AiFillHeart } from 'react-icons/ai'
import ShareModal from '../components/layouts/ShareModal';


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
    const [bidHistory, setBidHistory] = useState()
    const { web3Signer } = useStateContext()
    const [BidLoad, setBidLoad] = useState(true)
    const [modalShow, setModalShow] = useState(false);
    const [shareModalShow, setShareModalShow] = useState(false);

    const [WishList, setWishList] = useState(false)
    // const [item, setItem] = useState({name:});
    const { pathname } = useLocation()
    const url = `https://www.caratxchange.com${pathname}`

    const [price, setPrice] = useState();
    const [priceDirect, setPriceDirect] = useState();
    const { tokenId } = useParams();

    const createDirectSale = async () => {
        try {

            if (!web3Signer) {
                toast.error('Please connect the wallet first', { position: toast.POSITION.BOTTOM_RIGHT })
                return;
            }
            const contract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, web3Signer)


            /* user will be prompted to pay the asking proces to complete the transaction */
            const price = ethers.utils.parseUnits(priceDirect.toString(), 'ether')

            const transaction = await contract.settleDirectSale(tokenId, { value: price });
            console.log('transaction', transaction)
            const tx = await transaction.wait();

            toast.success(`Success! Transaction hash: ${tx.hash}`, { position: toast.POSITION.BOTTOM_RIGHT })
        } catch (error) {
            if (error.error) {
                toast.error(`Error in buying item: ${error.error.data.message}`, { position: toast.POSITION.BOTTOM_RIGHT })
            } else {

                toast.error(`Error in buying item: ${error.message}`, { position: toast.POSITION.BOTTOM_RIGHT })
            }
            console.log(error);
        }

    }
    const placeBid = async () => {
        try {

            let minimumBid
            if (price) {
                minimumBid = price;
            }


            const value = ethers.utils.parseUnits(minimumBid.toString(), 'ether');
            if (!web3Signer) {
                toast.error('Please connect the wallet first', { position: toast.POSITION.BOTTOM_RIGHT })
                return;
            }
            let contract = new ethers.Contract(
                marketplaceAddress,
                MarketPlace.abi,
                web3Signer
            );
            const transaction = await contract.placeBid(tokenId, { value: value });
            await transaction.wait();
            toast.success('Success', { position: toast.POSITION.BOTTOM_RIGHT })
        } catch (error) {
            if (error.error) {
                toast.error(`Error: ${error.error.data.message}`, { position: toast.POSITION.BOTTOM_RIGHT })
            } else {
                toast.error(`Error: ${error.message}`, { position: toast.POSITION.BOTTOM_RIGHT })
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
                        variables: { tokenId: tokenId },
                    });
                const data = await response.data.token;
                const history = await response.data.bids;
                const owner = await response.data.token.owner.id
                const creator = await response.data.token.creator.id

                return [data, history, owner, creator]
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
            if (o.name === 'Not updated') o.name = owner;
            if (c.name === 'Not updated') c.name = creator;
            setOwnerData(o);
            setCreatorData(c);


            setData(nftData)


            const reservedPrice = data.reservedPrice / 1000000000000000000;

            setPriceDirect(reservedPrice);
            // setAdditionalData(data)
            // console.log('API data after set',additionalData);

            if (!nftData.onAuction && !nftData.onDirectSale) {
                setNotOnSale(true);
            } else {

                setNotOnSale(false)
            }
            // console.log(userData)
            setLoading(false)
            if (nftData.onAuction) {

                const bidData = await getBidData(history);

                setBidHistory(bidData)
            }
            if(nftData.onDirectSale){

                

                const getOffers = async ()=>{
                    let offers = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/offers/offerbyid/${tokenId}`)
                    if(!offers) return [];
                offers = offers.data.offers;
                const offerData = Promise.all(offers.map(async offer=>{
                    const meta = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${offer.offerer}`)
                    
                    const time= Math.floor((Date.now()-Date.parse(new Date(offer.createdAt)))/1000)/3600

                    const { avatar, name, address } = meta.data.user;
                    const bidder = {
                        id: address,
                        bidder: name === 'Not updated' ? address : name,
                        image: avatar,
                        time: time,
                        price: offer.amount,
                    }
                    return bidder;
                }))
                return offerData
                }
                const bidData = await getOffers();
                setBidHistory(bidData)
                
            }

            checkWishList()
            setBidLoad(false)
            // console.log('data', additionalData)   
            // setAdditionalData(data[0])
            // console.log('after set:', additionalData)
        }

        getItem()

        // console.log('final data',data)

        return () => { }
    }, [tokenId]);

    const checkWishList = async () => {

        const address = web3Signer?._address;
        
        
        const wishCheck = async ()=>{
            let buyer = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${address}`)
        const wishList = buyer.data.user.wishList
        if (!wishList) return;
        
        if (wishList.indexOf(tokenId) === -1) return;
        else setWishList(true)       
        }
        if(!address) {
                setTimeout(wishCheck, 5000)
            }
        else{
        let buyer = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${address}`)
        const wishList = buyer.data.user.wishList
        if (!wishList) return;
        
        if (wishList.indexOf(Number(tokenId)) === -1) return;
        else setWishList(true) 
        }    
        
   }

    const handleSubmitAuction = async (e) => {
        e.preventDefault();
        await placeBid();

    }
    const handleSubmitDirectBuy = async (e) => {
        e.preventDefault();
        await createDirectSale();
    }

    const getBidData = async (history) => {
        if (history.length === 0) return [];

        const bidData = await Promise.all(history.map(async bidData => {

            const meta = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${bidData.bidder.id}`)
            const time = Math.floor(((Date.now() / 1000) - bidData.createdAtTimeStamp) / 3600)
            const { avatar, name, address } = meta.data.user;

            const bidder = {
                id: address,
                bidder: name === 'Not updated' ? address : name,
                image: avatar,
                time: time,
                price: bidData.bid / 1000000000000000000
            }

            return bidder
        }))
        return bidData
    }
    const handleWishList = async () => {
        if (!web3Signer) toast.error(`Error: Please connect wallet first, if connected wait for some time`, { position: toast.POSITION.BOTTOM_RIGHT })
        
        
        if (WishList) {
            axios.put(`https://forever-carat-api.herokuapp.com/api/v1/user/wishlist/${web3Signer._address}`, { tokenId: tokenId }, { headers: { "Content-Type": "application/json" } })
            
        } else {
            axios.put(`https://forever-carat-api.herokuapp.com/api/v1/user/wishlistrm/${web3Signer._address}`, { tokenId: tokenId }, { headers: { "Content-Type": "application/json" } })
        }
        setWishList(!WishList)
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
                                    {loading ? <img src={imgdetail1} alt="Axies" /> : <ImageGallery images={data.images} />}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="content-right">
                                <div className="sc-item-details">
                                    <div className="meta-item">
                                        <div className="left">
                                            {loading ? <h2>loading</h2> : <h2 className='text-capitalize' >{data.name}</h2>}
                                        </div>
                                        <div className="right d-flex flex-row-reverse mr-1">
                                            <IconContext.Provider value={{ color: (() => (WishList ? "red" : ""))(), size: "22px" }}>
                                                <div onClick={handleWishList} className='m-3' style={{ cursor: "pointer" }}>
                                                    <AiFillHeart />
                                                </div>
                                            </IconContext.Provider>
                                            <IconContext.Provider value={{ size: "22px" }}>
                                                <div onClick={() => setShareModalShow(true)} className='m-3' style={{ cursor: "pointer" }}>
                                                    <BsShare />
                                                </div>
                                            </IconContext.Provider>
                                        </div>
                                    </div>
                                    <div className="client-infor sc-card-product">
                                        <div className="meta-info overflow-hidden">
                                            <div className="author ">
                                                <div className="avatar">
                                                    {loading ? <img src={img6} alt="Axies" /> : <img src={ownerData.avatar} alt="Axies" />}
                                                </div>
                                                <div className="info">
                                                    <span>Owned By</span>
                                                    {loading ? <h6> <Link to="/author-02">Loading</Link> </h6> : <h6 className='overflow-hidden'> <Link to={`/authors/${data.owner.id}`}>{ownerData.name}</Link> </h6>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author ">
                                                <div className="avatar">
                                                    {loading ? <img src={img7} alt="Axies" /> : <img src={creatorData.avatar} alt="Axies" />}
                                                </div>
                                                <div className="info">
                                                    <span>Created By</span>
                                                    {loading ? <h6> <Link to="/author-02">loading</Link> </h6> : <h6 className='overflow-hidden'> <Link to={`/authors/${data.creator.id}`}>{creatorData.name}</Link> </h6>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {loading ? <p>loading</p> : <p>{data.description}</p>}
                                    <div className="meta-item-details">
                                        <div className="item-style-2 item-details">
                                            <ul className="list-details">
                                                {loading ? <li><span>Artist : </span><h6>loading</h6> </li> : <li><span>Artist : </span><h6>{data.creator.name}</h6> </li>}
                                                <li><span>Size : </span><h6>3000 x 3000</h6> </li>
                                                <li><span>Create : </span><h6>04 April , 2021</h6> </li>
                                                <li><span>Collection : </span><h6>Cyberpunk City Art</h6> </li>
                                            </ul>
                                        </div>
                                        {notOnSale ? <></> : <div className="item-style-2">
                                            <div className="item meta-price">
                                                {
                                                    loading ? <p>loading</p> : data.onAuction ? <span className="heading">Minimum Bid</span> : <span className="heading">Price</span>
                                                }
                                                <div className="price">
                                                    <div className="price-box">
                                                        {
                                                            loading ? <h5>loading</h5> : data.onAuction ? <h5> {Math.round(priceDirect * 1.1 * 1000000) / 1000000} ETH</h5> : <h5> {Math.round(priceDirect * 1000000) / 1000000} ETH</h5>
                                                        }
                                                        {loading ? <h5>loading</h5> : <span className='mt-1.5 pt-5'>=${Math.round(priceDirect * 1000000) * 0.48 / 1000000} </span>}
                                                    </div>
                                                </div>
                                            </div>
                                            {loading ? <h5>Loading</h5> : data.onAuction ? <div className="item count-down">
                                                <Countdown date={data.auctionEndAt * 1000}>
                                                    <span>Auction Ended</span>
                                                </Countdown>
                                            </div> : <></>}
                                        </div>}
                                    </div>
                                    <div className="d-flex">
                                        <div>
                                            {
                                                loading ? <h5>loading</h5> : notOnSale ? <h5 className='mb-2 p-1'>Not on sale</h5> : data.onAuction ? <button onClick={() => setShowAuctionForm(!showAuctionForm)} className="sc-button loadmore style bag fl-button pri-3"><span>Place a bid</span></button> : <button onClick={() => { setShowDirectBuyForm(!showDirectBuyForm) }} className="sc-button loadmore style bag fl-button pri-3"><span>Buy Now</span></button>
                                            }
                                            {
                                                showAuctionForm &&
                                                <div >
                                                    <form onSubmit={handleSubmitAuction} className='d-flex' style={{ height: '40px' }} >
                                                        <input type="text" placeholder="enter bid amount" onChange={e => setPrice(e.target.value)} />
                                                        <button className="loadmore fl-button" type='submit'>Place Bid</button>
                                                    </form>
                                                </div>

                                            }
                                            {
                                                showDirectBuyForm &&
                                                <div className='ml-5'>
                                                    <form onSubmit={handleSubmitDirectBuy}>
                                                        <button className="sc-button loadmore style bag fl-button pri-3" type='submit'>Confirm Buy</button>
                                                    </form>
                                                </div>
                                            }
                                        </div>
                                        {loading ? <></> : notOnSale ? <></> : data.onDirectSale && <div>
                                            <button className="sc-button loadmore style bag fl-button pri-3 ml-5" type='submit' onClick={() => { setModalShow(true) }}>Make an Offer</button>
                                        </div>}
                                    </div>

                                    <div className="flat-tabs themesflat-tabs">
                                        <Tabs>
                                            <TabList>
                                                <Tab>{loading?'loading':data.onAuction? 'Bid History':'Offers History'}</Tab>
                                                <Tab>Info</Tab>
                                            </TabList>
                                            <TabPanel>
                                                {BidLoad ? <div>Loading</div> : <ul className="bid-history-list">
                                                    {
                                                        bidHistory.length !== 0 && bidHistory.map((item, index) => (
                                                            <li key={index} item={item}>
                                                                <div className="content">
                                                                    <div className="client">
                                                                        <div className="sc-author-box style-2">
                                                                            <div className="author-avatar">
                                                                                <Link to={`/authors/${item.id}`}>
                                                                                    <img src={item.image} alt="Axies" className="avatar" />
                                                                                </Link>
                                                                                <div className="badge"></div>
                                                                            </div>
                                                                            <div className="author-infor">
                                                                                <div className="name">
                                                                                    <h6><Link to={`/authors/${item.id}`}>{item.bidder} </Link></h6> <span> Placed a bid</span>
                                                                                </div>
                                                                                <span className="time">{item.time} hours ago</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="price">
                                                                        <h5>{item.price} MATIC</h5>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>}
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="provenance">
                                                    {loading ? <p>loading</p> : <p>{creatorData.userInfo}</p>}
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
            <ToastContainer />
            {/* <LiveAuction data={liveAuctionData} /> */}
            <div className="ml-5 px-3">
                <h3 className="text-grey fw-bold text-decoration-underline">Proof of Authenticity</h3>
            </div>
            <div className="d-flex m-5">
                <div className="flex-column p-2 mx-2" style={{ borderWidth: "1px", borderStyle: 'solid', borderColor: '#c0c0c0', borderRadius: '10px' }} >
                    <h4 className='p-1 m-1'>Contract Address</h4>
                    <div className="h-1 w-full" style={{ borderWidth: "1px", borderStyle: 'solid', borderColor: '#5142fc', borderRadius: '10px' }}></div>
                    <a className='p-1 m-1' href='https://mumbai.polygonscan.com/address/0x421d38e77c71350aa4B3F28e90071751F4f4acd9'><h4 className='overflow-hidden'>0x421d38e77c71350aa4B3F28e90071751F4f4acd9</h4></a>
                </div>
                <div className="flex-column p-2 mx-2" style={{ borderWidth: "1px", borderStyle: 'solid', borderColor: '#c0c0c0', borderRadius: '10px' }}>
                    <h4 className='p-1 m-1'>BlockChain</h4>
                    <div className="h-1 w-full" style={{ borderWidth: "1px", borderStyle: 'solid', borderColor: '#5142fc', borderRadius: '10px' }}></div>
                    <h4 className='fs-4 fw-bolder p-1 m-1' >Polygon</h4>
                </div>
                <div className="flex-column p-2 mx-2" style={{ borderWidth: "1px", borderStyle: 'solid', borderColor: '#c0c0c0', borderRadius: '10px' }} >
                    <h4 className='p-1 m-1'>Token ID</h4>
                    <div className="h-1 w-full" style={{ borderWidth: "1px", borderStyle: 'solid', borderColor: '#5142fc', borderRadius: '10px' }}></div>
                    <h4 className='fs-4 p-1 m-1 text-center'>{tokenId}</h4>
                </div>
            </div>
            <CardModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                tokenId={tokenId}
            />
            <ShareModal
                show={shareModalShow}
                onHide={() => setShareModalShow(false)}
                url={url} />
            <Footer />
        </div>
    );
}

export default ItemDetails;
