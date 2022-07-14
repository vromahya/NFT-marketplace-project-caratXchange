import React, { useState, Fragment, useEffect } from 'react';

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'



const TodayPicks = props => {
    let data = props.data;

    const SortVariablesLeft = props.SortVariablesLeft;

    const SortVariablesRight = props.SortVariablesRight;

    

    const search = props.search;
    
    if (SortVariablesLeft.Chain !== 'all') data = data.filter(data => data.chain === 'polygon')
    
    if (SortVariablesLeft.PriceRange === 'less1Matic') data = data.filter(data => Number(data.price) < 1)
    if (SortVariablesLeft.PriceRange === 'bw1and3') data = data.filter(data => Number(data.price) <= 3 && data.price >= 1)
    if (SortVariablesLeft.PriceRange === 'morethan3') data = data.filter(data => Number(data.price) > 3)
    
    
    if (SortVariablesLeft.Type !== 'all') data = data.filter(data => data.type.toLowerCase() === SortVariablesLeft.Type);
    if (SortVariablesRight.Brand !== 'all') data = data.filter(data => data.brands === SortVariablesRight.Brand)
    
    if (search) data = data.filter(data => data.title === search || data.nameAuthor === search)
    


    const [visible, setVisible] = useState(8);

    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);

    }

    useEffect(() => {
        window.addEventListener('scroll', () => {

            if (document.body.scrollHeight - window.scrollY < 1000) {
                showMoreItems();
            }
        });
        return () => {
            window.removeEventListener('scroll', () => { })
        }
    }, []);


    return (
        <Fragment>
            <section className="tf-section sc-explore-1 pt-0">
                <div className="themesflat-container">
                    <div className="row">
                        {
                            data.slice(0, visible).map((item, index) => (
                                <div key={index} className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                    <div className={`sc-card-product ${item.feature ? 'comingsoon' : ''} `}>
                                        <div className="card-media">
                                            <Link to={`/item-details/${item.tokenId}`} ><img src={item.img} alt="axies" /></Link>
                                            {/* <Link to="/login" className="wishlist-button heart"><span className="number-like">{item.wishlist}</span></Link> */}
                                            {/* <div className="coming-soon">{item.feature}</div> */}
                                        </div>
                                        <div className="card-title">
                                            <h5 className="style2"><Link to={`/item-details/${item.tokenId}`}>{item.title}</Link></h5>
                                            {item.onAuction ? <div className="tags">Auc</div> : <div className="tags">Sale</div>}
                                        </div>
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    <img src={item.imgAuthor} alt="axies" />
                                                </div>
                                                <div className="info">
                                                    <span>Owned By</span>
                                                    <h6> <Link to={`/authors/${item.nameAuthor}`}>{item.nameAuthor}</Link> </h6>
                                                </div>
                                            </div>
                                            <div className="price">
                                                <span>Price/MinimumBid</span>
                                                <h5> {item.price}</h5>
                                                <span>MATIC</span>
                                            </div>
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



TodayPicks.propTypes = {
    data: PropTypes.array.isRequired,
}


export default TodayPicks;