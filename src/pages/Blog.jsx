import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import blogData from  '../assets/fake-data/data-blog'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import axios from 'axios'
import { useEffect } from 'react';

const {parse} = require('rss-to-json')
const url = 'https://corsproxy.io/?https://nftplazas.com/feed/'

const Blog = () => {
    const [data, setData] = useState(blogData);
    const getFeed = async ()=>{
        
        let feed = await parse(url);
        
        feed = feed.items;
        const items = await Promise.all(feed.map((i)=>{
            
            
            let img = i.content.split('src=\"')[1].split('class=')[0].trim()
            img = img.slice(0,img.length-1)
            
            let desc = i.description

            desc = desc.split('<p>')[1].split('&#8230;</p>')[0];

            

            let date = Date(i.created);
            date = date.slice(0,15);
            
            const item = {
                title: i.title,
                nameAuthor: i.author,
                link: i.link,
                img:img,
                time: date, 
                content: desc
            }
            return item;
        }))
        return items;
    }
    /*
    "<img width="800" height="380" src="https://nftplazas.com/wp-content/uploads/2022/06/France-to-Adopt-NFT-Ticketing-for-Major-Sporting-Events.jpg" class="webfeedsFeaturedVisual wp-post-image" alt="France to Adopt NFT Ticketing for Major Sporting Events" style="display: block; margin: auto; margin-bottom: 5px;max-width: 100%;" link_thumbnail="" loading="lazy" srcset="https://nftplazas.com/wp-content/uploads/2022/06/France-to-Adopt-NFT-Ticketing-for-Major-Sporting-Events.jpg 800w, https://nftplazas.com/wp-content/uploads/2022/06/France-to-Adopt-NFT-Ticketing-for-Major-Sporting-Events-300x143.jpg 300w, https://nftplazas.com/wp-content/uploads/2022/06/France-to-Adopt-NFT-Ticketing-for-Major-Sporting-Events-768x365.jpg 768w, https://nftplazas.com/wp-content/uploads/2022/06/France-to-Adopt-NFT-Ticketing-for-Major-Sporting-Events-370x176.jpg 370w, https://nftplazas.com/wp-content/uploads/2022/06/France-to-Adopt-NFT-Ticketing-for-Major-Sporting-Events-760x361.jpg 760w" sizes="(max-width: 800px) 100vw, 800px" /><p>Following a widely reported ticketing fiasco at this year’s Champions League final, the entirety of France has emerged as&#8230;</p>
<p>The post <a rel="nofollow" href="https://nftplazas.com/france-adopt-nft-ticketing/">France to Adopt NFT Ticketing for Major Sporting Events</a> appeared first on <a rel="nofollow" href="https://nftplazas.com">NFT Plazas</a>.</p>
"
     */
    useEffect(()=>{
        const getData = async ()=>{
            const d = await getFeed();
            setData(d);
        }
        getData()
    },[])
    

    const [visible , setVisible] = useState(6);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 3);
    }
    return (
        <div>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Blog</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>Blog</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <div className="tf-section sc-card-blog dark-style2">
                <div className="themesflat-container">
                    <div className="row">
                        {
                            data.slice(0,visible).map((item,index) => (
                                <BlogItem key={index} item={item} />
                            ))
                        }
                        {
                            visible < data.length && 
                            <div className="col-md-12 wrap-inner load-more text-center"> 
                                <Link to="#" id="load-more" className="sc-button loadmore fl-button pri-3 mt-6" onClick={showMoreItems}><span>Load More</span></Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const BlogItem = props => (
    <div className="fl-blog fl-item2 col-lg-4 col-md-6">
        <article className="sc-card-article">
            <div className="card-media">
                <a href={props.item.link} to="/blog-details"><img src={props.item.img} alt="Axies" /></a>
            </div>
            <div className="meta-info">
                <div className="author">
                    
                    <div className="info">
                        <span>Post owner</span>
                        <h6>{props.item.nameAuthor}</h6>
                    </div>
                </div>
                <div className="date">{props.item.time}</div>
            </div>
            <div className="text-article">
                <h3><a href={props.item.link} >{props.item.title}</a></h3>
                <p>{props.item.content}</p>
            </div>
            <a href={props.item.link} className="sc-button fl-button pri-3"><span>Read More</span></a>
        </article>
    </div>
)

export default Blog;
