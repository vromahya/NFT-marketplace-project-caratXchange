import React , { useState, useEffect} from 'react';
import { Link,useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel  } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import avt from '../assets/images/avatar/avt-author-tab.jpg'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import ItemDisplay from '../components/layouts/ItemDisplay';

const APIURL = 'https://api.thegraph.com/subgraphs/name/vromahya/forevercarat-nftquery'


const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

const Authors = () => {
    const [userData, setUserData]=useState();
    const [loading, setLoading]= useState(true);
    const [ownedTokenData, setOwnedTokenData] = useState();
    const [createdTokenData, setCreatedTokenData] = useState();
    
    const [userHimself, setuserHimself] = useState(false)
    
    
    const {address} = useParams()
    
    
    const userQuery = `
                    {
                    user(id:"${address}"){
                        id
                        tokens{
                        tokenURI
                        tokenId
                        name
                        image
                        tokenURI
                        onAuction
                        onDirectSale
                        reservedPrice
                        auctionEndAt
                        }
                        created{
                            tokenURI
                            tokenId
                            name
                            image
                            tokenURI
                            onAuction
                            onDirectSale
                            reservedPrice
                            auctionEndAt
                        }
                    }
                    }
`
    

    
    useEffect(()=>{
        setLoading(true)

        async function getUser(){
        
        const response = await client.query({query: gql(userQuery)});
        const user = await response.data.user
        let tokens = user.tokens;
        let created = user.created;
        const m = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${address}`)
        
        
        const n =  m.data.user
        const u = {...user, ...n}
        setUserData(u)    
        
        
        
    
        tokens = await Promise.all(tokens.map(async (i)=>{
            
         if(i.name){
            let item = { 
        title: i.name,       
        tokenId: Number(i.tokenId),
        img: i.image,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        price: i.reservedPrice,
        auctionEndAt: i.auctionEndAt,
        owner: u.id
        } 
        return item;
         }  else{
            const met = await axios.get(`https://ipfs.io/ipfs/${i.tokenURI}`)
            let item = { 
        title: met.data.name,       
        tokenId: Number(i.tokenId),
        img: met.data.image,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        price: i.reservedPrice,
        auctionEndAt: i.auctionEndAt,
        owner: u.id
        } 
        return item
         } 
        
        }))
        
        setOwnedTokenData(tokens)

        created = await Promise.all(created.map(async (i)=>{
            if(i.name){
                let item = { 
        title: i.name,       
        tokenId: Number(i.tokenId),
        img: i.image,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        price: i.reservedPrice,
        auctionEndAt: i.auctionEndAt
        } 
        return item;
        }else{
             const met = await axios.get(`https://ipfs.io/ipfs/${i.tokenURI}`)
            let item = { 
        title: met.data.name,       
        tokenId: Number(i.tokenId),
        img: met.data.image,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        price: i.reservedPrice,
        auctionEndAt: i.auctionEndAt
        } 
        return item
        }
           
        }))
        
        setCreatedTokenData(created);
        setLoading(false);
    }
        getUser();
        
    },[])
    useEffect(() => {
        const checkUser= async ()=>{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = await provider.getSigner();
            const addressConnection = await signer.getAddress();
    
            
                if(addressConnection.toLowerCase()===address){
                    setuserHimself(true)
                }
        }
        checkUser();
    }, [])
    

    const [menuTab] = useState(
        [
            {
                class: 'active',
                name: 'Tokens Owned'
            },
            {
                class: '',
                name: 'Tokens Created'
            }
            
        ]
    )
   

   

    

    return (
        <div className='authors-2'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">User</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Pages</Link></li>
                                    <li>User</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <section className="tf-section authors">
                <div className="themesflat-container">
                    <div className="flat-tabs tab-authors">
                        <div className="author-profile flex">
                            <div className="feature-profile">
                                {loading?<img src={avt} alt="Axies" className="avatar" />:<img src={userData.avatar} alt="Axies" className="max-width: 50% height: auto rounded-circle" />}
                            </div>
                            <div className="infor-profile">
                                <span>Author Profile</span>
                                {loading?<h2 className="title">Loading</h2>:<h2 className="title">{userData.name}</h2>}
                                {/* <p className="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.</p> */}
                                
                                    
                                
                                
                            </div>
                            <div className="widget-social style-3">
                                
                                {userHimself && <div className="btn-profile"><Link to={`/edit-profile/${address}`} className="sc-button style-1 follow">Edit Profile</Link></div>}
                            </div>
                        </div>
                        <Tabs>
                            <TabList>
                                {
                                    menuTab.map((item,index) => (
                                        <Tab key={index}>{item.name}</Tab>
                                    ))
                                }
                            </TabList>

                            <div className="content-tab">
                                <div className="content-inner">
                                    <div className="row">
                                    <TabPanel>
                                         {loading?<></>:<ItemDisplay className='flex-wrap' data={ownedTokenData} userData={userData} />}       
                                    </TabPanel>
                                    <TabPanel>
                                         {loading?<></>:<ItemDisplay className='flex-wrap' data={createdTokenData} userData={userData} />}       
                                    </TabPanel>
                                    </div>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}

export default Authors;
