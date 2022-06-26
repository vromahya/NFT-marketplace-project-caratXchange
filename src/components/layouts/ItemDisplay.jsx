import React , { useState , Fragment } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'


const ItemDisplay = props => {
    let data = props.data;
    let userData = props.userData;
    console.log(userData)
    
    
    

    if(userData.name==='Not updated'){
        userData.name = userData.id;
    }

    const [visible , setVisible] = useState(8);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
    }
    
    
    return (
        <Fragment>
        <section className="tf-section today-pick">
            <div className="themesflat-container">
                <div className="row">
                    {
                        data.slice(0,visible).map((item,index) => (
                            <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                <div className={`sc-card-product ${item.feature ? 'comingsoon' : '' } `}>
                                    <div className="card-media">
                                        <Link to={`/item-details-02/${item.tokenId}`}><img src={item.img} alt="axies" /></Link>
                                        {/* <Link to="/login" className="wishlist-button heart"><span className="number-like">{item.wishlist}</span></Link> */}
                                        <div className="coming-soon">{item.feature}</div>
                                    </div>
                                    <div className="card-title">
                                        <h5 className="style2"><Link to={`/item-details-02/${item.tokenId}`}>{item.title}</Link></h5>
                                        {/* <div className="tags">{item.tags}</div> */}
                                    </div>
                                    <div className="meta-info">
                                        <div className="author">
                                            <div className="avatar">
                                                <img src={userData.avatar} alt="axies" />
                                            </div>
                                            
                                        </div>
                                         {item.onAuction && <div className="price">
                                                <span>Current Bid</span>
                                                <h5> {item.price/1000000000000000000} MATIC</h5>
                                            </div>}
                                            {
                                                item.onDirectSale && <div className="price">
                                                <span>Price</span>
                                                <h5> {item.price/1000000000000000000} MATIC</h5>
                                            </div>                                            
                                            }
                                            {
                                                item.onAuction || item.onDirectSale || <div className="price">
                                                <span>Not On Sale</span>
                                                <h5>{item.price/1000000000000000000} MATIC</h5>
                                            </div>
                                                
                                            }
                                    </div>
                                    <div className="card-bottom">
                                        {item.onAuction && <Link to={`/item-details-02/${item.tokenId}`}><button className="sc-button style bag fl-button pri-3 no-bg"><span>Place Bid</span></button></Link>}
                                        {item.onDirectSale && <Link to={`/item-details-02/${item.tokenId}`}><button  className="sc-button style bag fl-button pri-3 no-bg"><span>Buy Now</span></button></Link>}
                                        <Link to="/activity-01" className="view-history reload">View History</Link>
                                    </div>
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
        
        </Fragment>
    );
}



ItemDisplay.propTypes = {
    data: PropTypes.array.isRequired,
}


export default ItemDisplay;
