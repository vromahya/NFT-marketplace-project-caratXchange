import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';



const HowItWorks = () => {
    
    return (
        <div>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">How It Works?</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>How It Works</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <div className="tf-section sc-card-blog dark-style2">
                <h1>Coming Soon</h1>
            </div>
            <Footer />
        </div>
    );
}



export default HowItWorks;
