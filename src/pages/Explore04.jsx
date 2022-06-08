import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Explore from '../components/layouts/explore-04/Explore';
import widgetSidebarData from '../assets/fake-data/data-widget-sidebar'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import axios from 'axios';
import {ethers} from 'ethers';
import users from '../assets/fake-data/users';
import { Accordion } from 'react-bootstrap-accordion'
import ExploreItem from '../components/layouts/explore-04/ExploreItem';
import defAvatar from '../assets/images/avatar/defaultAvatar.png';


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






const Explore04 = () => {

const [auctionData, setAuctionData] = useState([])

const [status, setStatus] = useState('All');
const [orderBy, setOrderBy] = useState('createdAtTimeStamp');
const [orderDirection, setOrderDirection] = useState('desc');



const handleChange= (e)=>{
    console.log(e.target.value);
    if(e.target.value==='All') setStatus('All');
    if(e.target.value==='onAuction') setStatus('onAuction')
    if(e.target.value==='onDirectSale') setStatus('onDirectSale')
    if(e.target.value==='Time created') setOrderBy('createdAtTimestamp')
    if(e.target.value==='tokenId') setOrderBy('tokenId')
    if(e.target.value==='price') setOrderBy('price')
    if(e.target.value==='Ascending') setOrderDirection('asc')
    if(e.target.value==='Descending') setOrderDirection('desc')

    

}
const sort = ()=>{
    async function setData(){
                const items = await getData();
                setAuctionData(items)
                console.log(items);
            }
            setData();
            setLoading(false);
}

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

  

    const items = await Promise.all(fullData.map(async i => {


      const meta = await axios.get(i.tokenURI)
   
      let price;
      if(i.reservedPrice){ price = ethers.utils.formatUnits(i.reservedPrice, 'ether')}
      else price = 'NA'
   
      try {
          const res = await axios.get(` https://forever-carat-api.herokuapp.com/api/v1/user/${i.owner.id}`);
          const {name, avatar, address} = res.data;
        let item = { 
        title: meta.data.name,       
        tokenId: Number(i.tokenId),
        img: meta.data.image,
        price: price,
        imgAuthor: avatar,
        nameAuthor: name,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        collection: meta.data.collection,
        address: address
      }
      return item
      } catch (error) {
          console.log(error)
          
          const name = '';
          const avatar = defAvatar;
          const address = i.owner.id;
           let item = { 
        title: meta.data.name,       
        tokenId: Number(i.tokenId),
        img: meta.data.image,
        price: price,
        imgAuthor: avatar,
        nameAuthor: name,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        collection: meta.data.collection,
        address: address
      }
      return item
      }      
    }))
return items;
} 
    const [loading, setLoading] = useState(true);
    useEffect(()=>{

            async function setData(){
                let items = await getData();
                items = items.filter(item=>item.onAuction===true||item.onDirectSale===true);
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
                                    <li><Link to="#">Explore</Link></li>
                                    <li>Explore</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <section className="tf-explore tf-section">
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12">
                        <div id="side-bar" className="side-bar style-3">
                            {
                                widgetSidebarData.map((item,index) => (
                                    <div className="widget widget-category mgbt-24 boder-bt" key={index}>
                                        <div className="content-wg-category">
                                            <Accordion title={item.title} show={true}>
                                                <form action="#">
                                                    {
                                                        item.content.map((itemm , index) => (
                                                            <div key={index}>
                                                                <label>{itemm.field}
                                                                    <input type="checkbox" name ={item.name} value={itemm.field} id={itemm.field} defaultChecked={itemm.checked}  onChange={handleChange}  />
                                                                    <span className="btn-checkbox"></span>
                                                                </label><br/>
                                                            </div>
                                                        ))
                                                    }                                            
                                                </form>
                                            </Accordion>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                            <button onClick={sort}>Sort/Filter</button>
                    </div>
                    
                    <div className="col-xl-9 col-lg-9 col-md-12">
                        <ExploreItem data={auctionData} />
                    </div>
                </div>
            </div>
            </section>
            
            <Footer />
        </div>
    );
}

export default Explore04;
