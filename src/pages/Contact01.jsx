import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import img1 from '../assets/images/contactus.jpg'
import axios from 'axios';
import Calendly from '../components/calendly'

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
                                <h1 className="heading text-center">Contact</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Schedule Meeting</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <Calendly/>
            <Footer />
        </div>
    );
}

export default Contact01;
