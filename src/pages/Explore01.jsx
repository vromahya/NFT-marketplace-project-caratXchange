import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TodayPicks from '../components/layouts/explore-01/TodayPicks'
import todayPickData from '../assets/fake-data/data-today-pick';
import { createClient } from 'urql';
import axios from 'axios';
import {ethers} from 'ethers';
import users from '../assets/fake-data/users';

const APIURL =
  'https://api.thegraph.com/subgraphs/name/vromahya/jewelverse-api-v2';

const query = `
    query  {
            tokens
                    {
                        
                        tokenId
                        tokenURI
                        onAuction
                        onDirectSale
                        reservedPrice
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
//   console.log(fullData)
  

    const items = await Promise.all(fullData.map(async i => {
    //   console.log(i);

      const meta = await axios.get(i.tokenURI)
      console.log(i.reservedPrice);
      let price;
      if(i.reservedPrice){ price = ethers.utils.formatUnits(i.reservedPrice, 'ether')}
      else price = 'NA'
      
      
      const user = await users.filter(user=>user.address===i.owner.id)
    //   console.log(user)
      let item = { 
        title: meta.data.name,       
        tokenId: Number(i.tokenId),
        img: meta.data.image,
        price: price,
        imgAuthor: user[0].avatar,
        nameAuthor: user[0].name,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale
      }
      return item
    }))
return items;
}

const Explore01 = () => {
    const [auctionData, setAuctionData] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(()=>{

            async function setData(){
                const items = await getData();
                await setAuctionData(items)
            }
            setData();
            setLoading(false);
            // console.log(auctionData)
        },[])
    return (
        <div>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Explore</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Explore</Link></li>
                                    <li>Explore</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            {loading?<TodayPicks data={todayPickData} />:<TodayPicks data={auctionData} />}
            <Footer />
        </div>
    );
}


export default Explore01;
