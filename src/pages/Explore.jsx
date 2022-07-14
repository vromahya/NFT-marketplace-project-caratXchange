import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TodayPicks from '../components/layouts/explore-01/TodayPicks'

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import axios from 'axios';
import {ethers} from 'ethers';





const APIURL = 'https://api.thegraph.com/subgraphs/name/vromahya/forevercarat-nftquery'

const tokensQuery = `
  query($first: Int, $orderBy: BigInt, $orderDirection: String) {
    tokens(
      first: $first, orderBy: $orderBy, orderDirection: $orderDirection
    ) {
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
  
`
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

const Explore = () => {


    const [dropDownFieldsLeft] = useState([
  {
    id: 0,
    title: 'Status',
    content: [
      {
        index: 0,
        field: 'All',
        value: 'all',
      },
      {
        index: 1,
        field: 'On Auctions',
        value: 'onAuction',
      },
      {
        index: 2,
        field: 'On Direct Sale',
        value: 'onDirectSale',
      },
    ],
    selected: null,
  },
  {
    id: 1,
    title: 'Chains',
    content: [
      {
        index: 0,
        field: 'All',
        value: 'all',
      },
      {
        index: 1,
        field: 'Polygon',
        value: 'polygon',
      },
      {
        index: 2,
        field: 'Ethereum',
        value: 'ethereum',
      },
      {
        index: 3,
        field: 'BSC',
        value: 'bsc',
      },
    ],
    selected: null,
  },
  {
    id: 2,
    title: 'PriceRange',
    content: [
      {
        index: 0,
        field: 'All',
        value: 'all',
      },
      {
        index: 1,
        field: 'Less than 1$',
        value: 'less1Matic',
      },
      {
        index: 2,
        field: '1$ to 3$',
        value: 'bw1and3',
      },
      {
        index: 3,
        field: 'More than 3$',
        value: 'morethan3',
      },
    ],
    selected: null,
  },
  {
    id: 3,
    title: 'Type',
    content: [
      {
        index: 0,
        field: 'All',
        value: 'all',
      },  
      {
        index: 1,
        field: 'Ring',
        value: 'ring',
      },
      {
        index: 2,
        field: 'Pendant',
        value: 'pendant',
      },
      {
        index: 3,
        field: 'Ear Ring',
        value: 'earring',
      },
      {
        index: 4,
        field: 'Others',
        value: 'other',
      },
    ],
    selected: null,
  }
]) 

    const dropDownFieldsRight = [
        {
    id: 0,
    title: 'Brand',
    content: [
      {
        index: 0,
        field: 'All',
        value: 'all',
      },
      {
        index: 1,
        field: 'Tanishq',
        value: 'tanishq',
      },
      {
        index: 2,
        field: 'Avant',
        value: 'avant',
      },
    ],
    selected: null,
  },
  {
    id: 1,
    title: 'Feature',
    content: [
      {
        index: 0,
        field: 'All',
        value: 'all',
      },
       {
        index: 1,
        field: 'Early Access',
        value: 'earlyaccess',
      },
      {
        index: 2,
        field: 'Drops',
        value: 'drops',
      },      
    ],
    selected: null,
  },
]

    const [auctionData, setAuctionData] = useState([])
    const [loading, setLoading] = useState(true);

    const [SortVariablesLeft, setSortVariablesLeft] = useState({Status:'all', Chains:'all', PriceRange:'all', Type:'all'})
    const [SortVariablesRight, setSortVariablesRight] = useState({ Brand:'all', Feature:'all'})
    let search = useLocation().search
    search = new URLSearchParams(search).get('search');


    
    const getData = async ()=>{

    const response = await client
    .query({
      query: gql(tokensQuery),
      variables: {
        first: 100,
        orderBy: 'createdAtTimestamp',
        orderDirection: 'desc',
      },
    });
    const fullData = response.data.tokens;
    let data;
    if(SortVariablesLeft.Status==='all') data = fullData.filter(data=>data.onAuction===true||data.onDirectSale===true);
    
    else if(SortVariablesLeft.Status==='onAuction') data = fullData.filter(data=>data.onAuction===true);
    else data = fullData.filter(data=>data.onDirectSale===true);  




    const items = await Promise.all(data.map(async i => {

      let imgAuthor, nameAuthor;
      const meta = await axios.get(`https://ipfs.io/ipfs/${i.tokenURI}`)
      const met = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${i.owner.id}`)
      const u = met.data.user;
      imgAuthor = u.avatar;
      if(u.name==='Not updated'){
        nameAuthor = i.owner.id; 
      }else{
        nameAuthor = u.name;
      }
      let price;
      price = ethers.utils.formatUnits(i.reservedPrice, 'ether')

        let item = { 
        title: meta.data.name,       
        tokenId: Number(i.tokenId),
        img: meta.data.images[0],
        price: price,
        imgAuthor: imgAuthor,
        nameAuthor: nameAuthor,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        collection: meta.data.collection,
        type: meta.data.type,
        brand: 'all',
        chain: 'polygon'           
        }
        return item;
    }))
    
return items;
} 
    const getDropdownValueLeft = (item)=>{
        return item.content.find((e)=>e.value===SortVariablesLeft[item.title]).field;        
        
        
    }
    const getDropdownValueRight = (item)=>{
        
        return item.content.find((e)=>e.value===SortVariablesRight[item.title]).field;
               
    }
 useEffect(()=>{
            setLoading(true)
            
            async function setData(){
                let items = await getData();
                
                setAuctionData(items)
            }
            setData();
            setLoading(false);
            
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
                                    <li>Explore</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <section className="tf-section sc-explore-1 py-0 mt-20">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="wrap-box explore-1 flex mg-bt-40">
                                <div className="seclect-box style-1 gap-1" id='select-left' >
                                    {dropDownFieldsLeft.map((item)=>(                                        
                                        <div id={item.id} key={item.id} className="dropdown">                                        
                                        <Link to="#" className="btn-selector nolink mx-2 px-5">{item.title+' : ' + getDropdownValueLeft(item) }</Link>
                                        <ul >
                                            {item.content.map((itemm)=>(
                                                <li id={itemm.index} key={itemm.index} onClick={()=>setSortVariablesLeft({...SortVariablesLeft, [item.title]: itemm.value})}><span>{itemm.field}</span></li>                                                
                                            ))}                                                                                        
                                        </ul>
                                    </div>
                                    ))}                                    
                                </div>
                                <div className="seclect-box style-2 box-right overflow-hidden" id='select-right'>
                                    {dropDownFieldsRight.map((item)=>(                                        
                                        <div id={item.id} key={item.id} className="dropdown">                                        
                                        <Link to="#" className="btn-selector nolink mx-2 px-5">{item.title+':'+ getDropdownValueRight(item) }</Link>
                                        <ul >
                                            {item.content.map((itemm)=>(
                                                <li id={itemm.index} key={itemm.index} onClick={()=>setSortVariablesRight({...SortVariablesRight, [item.title]: itemm.value})}><span>{itemm.field}</span></li>                                                
                                            ))}                                                                                        
                                        </ul>
                                    </div>
                                    ))}    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <TodayPicks data={auctionData} SortVariablesLeft={SortVariablesLeft} SortVariablesRight={SortVariablesRight} search={search} />
            <Footer />
        </div>
    );
}


export default Explore;
