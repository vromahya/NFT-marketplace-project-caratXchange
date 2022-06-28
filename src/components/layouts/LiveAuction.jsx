import React , {  Fragment } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import Countdown from "react-countdown";


import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

const LiveAuction = props => {

    let data = props.data.filter(data=> data.onAuction===true);
    
    // console.log(data)
    data = data.filter(data=>(Date.now()/1000)<Number(data.auctionEndAt));    

    return (
        <Fragment>
            <section className="tf-section live-auctions">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="heading-live-auctions">
                                <h2 className="tf-title pb-20">
                                    Live Auctions</h2>
                                <Link to="/explore" className="exp style2">EXPLORE MORE</Link>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                spaceBetween={30}

                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    767: {
                                    slidesPerView: 2,
                                    },
                                    991: {
                                    slidesPerView: 3,
                                    },
                                    1300: {
                                        slidesPerView: 4,
                                    },
                                }}
                                navigation
                                pagination={{ clickable: true }}
                                scrollbar={{ draggable: true }}
                            >
                                    {
                                        data.slice(0,7).map((item,index) => (
                                            
                                            <SwiperSlide key={index}>
                                                    <div className="swiper-container show-shadow carousel auctions">
                                                        <div className="swiper-wrapper">
                                                            <div className="swiper-slide">
                                                                <div className="slider-item">										
                                                                    <div className="sc-card-product">
                                                                        <div className="card-media">                                                                            
                                                                            <Link to={`/item-details/${item.tokenId}`}><img src={item.img} alt="axies" /></Link>
                                                                            {/* <Link to="/login" className="wishlist-button heart"><span className="number-like">{item.wishlist}</span></Link> */}
                                                                            <div className="featured-countdown">
                                                                                <span className="slogan"></span>
                                                                                <Countdown date={item.auctionEndAt*1000}>
                                                                                    <span>Auction Ended</span>
                                                                                </Countdown>
                                                                            </div>
                                                                            
                                                                        </div>
                                                                        <div className="card-title">
                                                                            <h5><Link to={`/item-details/${item.tokenId}`}>{item.title}</Link></h5>
                                                                        </div>
                                                                        <div className="meta-info">
                                                                            <div className="author">
                                                                                <div className="avatar">
                                                                                    <img src={item.imgAuthor} alt="axies" />
                                                                                </div>
                                                                                <div className="info">
                                                                                    <span>Seller</span>
                                                                                    <h6> <Link to={`/authors/${item.owner}`}>{item.nameAuthor}
                                                                                    </Link> </h6>
                                                                                </div>
                                                                            </div>
                                                                            <div className="price">
                                                                                <span>Current Bid</span>
                                                                                <h5> {item.price} MATIC</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>    	
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </SwiperSlide>
                                        ))
                                    }
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
            
        </Fragment>
        
    );
}

LiveAuction.propTypes = {
    data: PropTypes.array.isRequired,
}


export default LiveAuction;
