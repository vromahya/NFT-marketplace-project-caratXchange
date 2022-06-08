import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import heroSliderData from '../assets/fake-data/data-slider';
import Slider from '../components/slider/Slider';
import liveAuctionData from '../assets/fake-data/data-live-auction';
import LiveAuction from '../components/layouts/LiveAuction';
import TopSeller from '../components/layouts/TopSeller';
import topSellerData from '../assets/fake-data/data-top-seller'
import TodayPicks from '../components/layouts/TodayPicks';
import todayPickData from '../assets/fake-data/data-today-pick';
import PopularCollection from '../components/layouts/PopularCollection';
import popularCollectionData from '../assets/fake-data/data-popular-collection';
import Create from '../components/layouts/Create';
import { createClient } from 'urql';
import axios from 'axios';
import {ethers} from 'ethers';
import defAvatar from '../assets/images/avatar/defaultAvatar.png';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
// import users from '../assets/fake-data/users'

import { useState, useEffect } from 'react';
import users from '../assets/fake-data/users';

const APIURL =
  'https://api.thegraph.com/subgraphs/name/vromahya/forevercarat-nftquery';

const query = `
    query($orderBy: BigInt, $orderDirection: String)  {
            tokens(orderBy: $orderBy, orderDirection: $orderDirection)
                    {
                        
                        tokenId
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
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

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
//   console.log(fullData)
  

    const items = await Promise.all(fullData.map(async i => {
    //   console.log(i);

      const meta = await axios.get(i.tokenURI)
      let price;
      if(i.reservedPrice) {price = ethers.utils.formatUnits(i.reservedPrice, 'ether')}
      else price = 'NA'
      
    //   console.log(user)
      let item = { 
        title: meta.data.name,       
        tokenId: Number(i.tokenId),
        img: meta.data.image,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        price: price,
        imgAuthor: defAvatar,
        nameAuthor: i.owner.id,
        auctionEndAt: i.auctionEndAt
      }
      return item
    }))
return items;
}

const Home01 = () => {

    const [auctionData, setAuctionData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        async function setData(){
            const items = await getData();
            await setAuctionData(items)
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
            <TopSeller data={topSellerData} />
            <TodayPicks data={auctionData} />
            <Create />
            <Footer />
        </div>
    );
}

export default Home01;
