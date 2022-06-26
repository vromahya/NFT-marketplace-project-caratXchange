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






const ExplorePage = () => {

const [auctionData, setAuctionData] = useState([])
const [Checked, setChecked] = useState([[0,0],[1,0],[2,0]]);




const handleChecked = (f,g)=>{
    
    return Checked[f].indexOf(g,1)===-1?false:true

    // if(current===-1) return false;
    // return true;    
}

const handleChange= (f,g)=>{
    

    let current = Checked[f].indexOf(g,1);

    
    const newChecked = [...Checked];
    
    if(current===-1) newChecked[f][1] = g;
    
    setChecked(newChecked)
}
const sort = async ()=>{
    setLoading(true)
    const [status, orderBy, orderDirection] = getSortVariables();
    const items = await getData(status, orderBy, orderDirection);
    setAuctionData(items)
    setLoading(false)
}

const getSortVariables = ()=>{
    
const status = widgetSidebarData[0].content[Checked[0][1]].value;
const orderBy = widgetSidebarData[1].content[Checked[1][1]].value;
const orderDirection = widgetSidebarData[2].content[Checked[2][1]].value;

return [status, orderBy, orderDirection] 
    
}


const getData = async (status, orderBy, orderDirection)=>{

   const response = await client
  .query({
    query: gql(tokensQuery),
    variables: {
      first: 100,
      orderBy: orderBy,
      orderDirection: orderDirection,
    },
  });
  const fullData = response.data.tokens;
  let data;
  if(status==='all') data = fullData.filter(data=>data.onAuction===true||data.onDirectSale===true);
  
  else if(status==='onAuction') data = fullData.filter(data=>data.onAuction===true);
  else data = fullData.filter(data=>data.onDirectSale===true);
  

  
  

  

    const items = await Promise.all(data.map(async i => {

      let imgAuthor, nameAuthor;
      const meta = await axios.get(`https://ipfs.io/ipfs/${i.tokenURI}`)
      const met = await axios.get(`https://forever-carat-api.herokuapp.com/api/v1/user/${i.owner.id}`)
      const u = met.data.user;
      if(u.name==='Not updated'){
        imgAuthor = defAvatar;
        nameAuthor = i.owner.id; 
      }else{
        imgAuthor = u.avatar;
        nameAuthor = u.name;
      }
      let price;
      if(i.reservedPrice){ price = ethers.utils.formatUnits(i.reservedPrice, 'ether')}
      else price = 'NA'
   
      
        let item = { 
        title: meta.data.name,       
        tokenId: Number(i.tokenId),
        img: meta.data.image,
        price: price,
        imgAuthor: imgAuthor,
        nameAuthor: nameAuthor,
        onAuction: i.onAuction,
        onDirectSale: i.onDirectSale,
        collection: meta.data.collection            
        }
        return item;
    }))
return items;
} 
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
            setLoading(true)
            const [name, orderBy, orderDirection]= getSortVariables()
            async function setData(){
                let items = await getData(name, orderBy, orderDirection);
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
                        {loading?<></>:<div id="side-bar" className="side-bar style-3">
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
                                                                    <input type="checkbox" name ={item.name} value={itemm.field} id={itemm.field} checked={handleChecked(item.id, itemm.index)}  onChange={()=>handleChange(item.id,itemm.index)}  />
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
                        </div>}
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

export default ExplorePage;
