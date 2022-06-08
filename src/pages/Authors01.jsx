import React , { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TopSeller from '../components/layouts/authors/TopSeller';
import topSellerData from '../assets/fake-data/data-top-seller'
import popularCollectionData from '../assets/fake-data/data-popular-collection';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const APIURL = 'https://api.thegraph.com/subgraphs/name/vromahya/forevercarat-nftquery'


const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})


const Authors01 = () => {
    const [data] = useState(popularCollectionData);

    const address = useParams()
    const userQuery = `
                    {
                    user(id:"${address}"){
                        id
                        tokens{
                        id
                        tokenURI
                        }
                    }
                    }
`
    async function getUser(){
        const response = await client.query({query: gql(userQuery)});
        const user = response.data.user
        console.log(user);
    }

    const [visible , setVisible] = useState(6);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 3);
    }
    useEffect(()=>{
        getUser()
    },[])
    return (
        <div className='authors'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Authors</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Pages</Link></li>
                                    <li>Authors</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <TopSeller data={topSellerData} />

            <section className="tf-section our-creater dark-style2">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="tf-title style4 mg-bt-38">
                                Our Creator</h2>
                        </div>
                        {
                            data.slice(0,visible).map((item,index) => (
                                <div key={index} className="col-lg-4 col-md-6 col-12">
                                    <div className="sc-card-collection style-2">
                                        <div className="card-bottom">
                                            <div className="author">
                                                <div className="sc-author-box style-2">
                                                    <div className="author-avatar">
                                                        <img src={item.imgAuthor} alt="Axies" className='avatar' />
                                                    <div className="badge"></div>
                                                </div>
                                                </div>
                                                <div className="content">
                                                    <h4><Link to="/author-02">{item.name}</Link></h4>
                                                    <div className="infor">
                                                        <span>{item.count}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to="/login" className="sc-button fl-button pri-3"><span>Following</span></Link>
                                        </div>
                                        <Link to="/author-02">
                                            <div className="media-images-collection">
                                                <div className="box-left">
                                                    <img src={item.imgleft} alt="Axies" />
                                                </div>
                                                <div className="box-right">
                                                    <div className="top-img">
                                                        <img src={item.imgright1} alt="Axies" />
                                                        <img src={item.imgright2} alt="Axies" />
                                                    </div>
                                                    <div className="bottom-img">
                                                        <img src={item.imgright3} alt="Axies" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                        {
                        visible < data.length && 
                        <div className="col-md-12 wrap-inner load-more text-center"> 
                            <Link to="#" id="load-more" className="sc-button loadmore fl-button pri-3" onClick={showMoreItems}><span>Load More</span></Link>
                        </div>
                    }
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Authors01;
