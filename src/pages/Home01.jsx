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

import { useState, useEffect } from 'react';

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
                            owner {
                                id
                            }
                            }
            }
`;
const client = createClient({ url: APIURL });

async function getData() {
  const response = await client.query(query).toPromise();
  const fullData = response.data.tokens;
  const data = fullData.filter((data)=>data.onAuction===true);
  console.log(data)
}

const Home01 = () => {
    useEffect(()=>{
        getData()
    },[])
    const [realAuctionData, setRealAuctionData] = useState({img:'', title:'', tags: 'MTC',imgAuthor: liveAuctionData[0].imgAuthor, price: '2 ETH', priceChange: '$12.246',
    wishlist: '100',
    imgCollection: liveAuctionData[0].imgCollection,
    nameCollection: 'Colorful Abstract'  });
    
    return (
        <div className='home-1'>
            <Header />
            <Slider data={heroSliderData} />
            <LiveAuction data={liveAuctionData} />
            <TopSeller data={topSellerData} />
            <TodayPicks data={todayPickData} />
            <PopularCollection data={popularCollectionData} />
            <Create />
            <Footer />
        </div>
    );
}

export default Home01;
