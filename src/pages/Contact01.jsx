import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import img1 from '../assets/images/blog/thumb-8.png'
import axios from 'axios';

const Contact01 = () => {

    const [formInput, setFormInput] = useState({name:'', email:'',type:'buyers',question:'' })

    const handleSubmit =  (e)=>{
        e.preventDefault();
        console.log(formInput);
       
        const data = JSON.stringify({...formInput})
        axios.post('https://forever-carat-api.herokuapp.com/api/v1/query/',data,{headers:{"Content-Type" : "application/json"}}).then(e=>console.log(e)).catch(e=>console.log(e.response.data))
        

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
                                <h1 className="heading text-center">Contact 1</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Contact</Link></li>
                                    <li>Contact</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <section className="tf-contact tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="box-feature-contact">
                                <img src={img1} alt="Axies" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                            <h2 className="tf-title-heading style-2 mg-bt-12">
                                Drop Up A Message
                            </h2>
                            <h5 className="sub-title style-1">
                                We will get back to you within 24 hours
                            </h5>
                            <div className="form-inner">
                                <form id="contactform" noValidate="novalidate" className="form-submit" onSubmit={handleSubmit} >
                                    <input id="name" name="name" tabIndex="1" aria-required="true" type="text" placeholder="Your Full Name" required onChange={e=>setFormInput({...formInput, name: e.target.value})}/>
                                    <input id="email" name="email" tabIndex="2"  aria-required="true" type="email" placeholder="Your Email Address" required onChange={e=>setFormInput({...formInput, email: e.target.value})}/>
                                    <div className="row-form style-2" id="type">
                                        <select placeholder='Select query type' onChange={e=>setFormInput({...formInput, type: e.target.value})}>
                                            <option value="buyers">Buyer</option>
                                            <option value="sellers">Seller</option>
                                            <option value="developers">Developer</option>
                                        </select>
                                        <i className="icon-fl-down"></i>
                                    </div>
                                    <textarea id="message" name="message" tabIndex="3" aria-required="true" required placeholder="Message" onChange={e=>setFormInput({...formInput, question: e.target.value})} ></textarea>
                                    <button className="submit" type='submit' >Send message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Contact01;
