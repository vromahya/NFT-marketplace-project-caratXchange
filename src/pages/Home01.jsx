import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import heroSliderData from '../assets/fake-data/data-slider';
import Slider from '../components/slider/Slider';

import LiveAuction from '../components/layouts/LiveAuction';
import TopSeller from '../components/layouts/TopSeller';

import TodayPicks from '../components/layouts/TodayPicks';

import Create from '../components/layouts/Create';
import axios from 'axios';
import {ethers} from 'ethers';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
// import users from '../assets/fake-data/users'

import { useState, useEffect } from 'react';


const APIURL =
  'https://api.thegraph.com/subgraphs/name/vromahya/forevercarat-nftquery';

const query = `
    query($orderBy: BigInt, $orderDirection: String)  {
            tokens(orderBy: $orderBy, orderDirection: $orderDirection)
                    {
                        
                        tokenId
                        name
                        image
                        tokenURI
                        onAuction
                        onDirectSale
                        reservedPrice
                        auctionEndAt
                        owner {
                                id
                                }
                        }
            }
`;
const userQuery = `query {
    users(where:{seller:true},first:10 ){
      id
      seller
    }
  }`
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});
async function getSellers(){
  const res = await client.query({
    query: gql(userQuery)
  })
  let u = res.data.users;
  
  const users = Promise.all(u.map(async i=>{
    
    const f = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${i.id}`)
    const g = f.data.user;
    let user={
      img: g.avatar,
      name: g.name,
      address: i.id
    }
    return user;
  }))
  return users;
}
async function getData() {
  const response = await client
  .query({
    query: gql(query),
    variables: {
      orderBy: 'auctionEndAt',
      orderDirection: 'asc',
    },
  });

  const fullData = response.data.tokens;
  
  

    const items = await Promise.all(fullData.map(async i => {
    //   console.log(i);

      let imgAuthor, nameAuthor;
      let price;
      if(i.reservedPrice) {price = ethers.utils.formatUnits(i.reservedPrice, 'ether')}
      else price = 'NA'

      const m = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${i.owner.id}`)

      const u = m.data.user
      
         imgAuthor = u.avatar;

         if(u.name==='Not updated'){
          nameAuthor=i.owner.id
         }
         nameAuthor = u.name;
      
      
      if(i.name){
        let item = { 
        title: i.name,       
        tokenId: Number(i.tokenId),
        img: i.image,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        price: price,
        imgAuthor: imgAuthor,
        nameAuthor: nameAuthor,
        auctionEndAt: i.auctionEndAt,
        owner: i.owner.id
      }
      return item
      }
      else{
        const met = await axios.get(`https://ipfs.io/ipfs/${i.tokenURI}`)
        let item = { 
        title: met.data.name,       
        tokenId: Number(i.tokenId),
        img: met.data.image,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        price: price,
        imgAuthor: imgAuthor,
        nameAuthor: nameAuthor,
        auctionEndAt: i.auctionEndAt,
        owner: i.owner.id
      }
      
      return item
      }
      

    }))
return items;
}

const Home01 = () => {

    const [auctionData, setAuctionData] = useState([])
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState();

    useEffect(()=>{
        setLoading(true)
        async function setData(){
            const items = await getData();
            const users = await getSellers();
            setUserData(users)
            setAuctionData(items)
            // console.log(items)
            setLoading(false);
        }
        setData();
        // console.log(auctionData)
    },[])

    // const [realAuctionData, setRealAuctionData] = useState({img:'', title:'', tags: 'MTC',imgAuthor: liveAuctionData[0].imgAuthor, price: '2 ETH', priceChange: '$12.246',
    // wishlist: '100',
    // imgCollection: liveAuctionData[0].imgCollection,
    // nameCollection: 'Colorful Abstract'  });
    
    return (
        <div className='home-1'>
            <Header />
            <Slider data={heroSliderData} />
            <LiveAuction data={auctionData} />
            {!loading && <TopSeller data={userData} />}
            <TodayPicks data={auctionData} />
            <Create />
            <Footer />
        </div>
    );
}

export default Home01;
