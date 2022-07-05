import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import avt from '../assets/images/avatar/avata_profile.jpg'

import {create as ipfsHttpClient} from 'ipfs-http-client';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import { useStateContext } from '../context/ContextProvider'; 

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const EditProfile = () => {

    const {address} = useParams()
    
    const [formData, setFormData] = useState({address: address, name:'', email:'', avatar:''})

    const [userHimself, setuserHimself] = useState(false)
    const {web3Signer} = useStateContext();


    useEffect(() => {
        const checkUser= async ()=>{
            const addressConnection= web3Signer._address
            
                if(addressConnection.toLowerCase()===address){
                    setuserHimself(true)
                }            
        }
        checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])   
    
    async function onChange(e) {
        const file = e.target.files[0];
        try {
            const added = await client.add(file, {
            progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = `https://ipfs.io/ipfs/${added.path}`;
            setFormData({...formData, avatar:url});
            toast.success('File uploaded',{position: toast.POSITION.BOTTOM_RIGHT})
        } catch (error) {
            errorNotification('Error uploading file: ', error);
        }
    }
    const errorNotification = (errorIn,e)=>{
    toast.error(`${errorIn}: ${e}`,{position: toast.POSITION.BOTTOM_RIGHT})
    }
    const notify = ()=>{
    toast.success('Success',{position: toast.POSITION.BOTTOM_RIGHT});
}
    const handleSubmit = (e)=>{
        e.preventDefault();
        
        const data = JSON.stringify({...formData})  
          
        
        axios.put(`https://forever-carat-api.herokuapp.com/api/v1/user/${address}`,data,{headers:{"Content-Type" : "application/json"}})
        .then(e=>notify(e))
        .catch(e=>errorNotification('Error in updating profile',e.response.data))
    }
    if(!userHimself){
        return <div>
            <h1>
                Unauthorized
            </h1>
        </div>
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
                                <h1 className="heading text-center">Edit Profile</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Pages</Link></li>
                                    <li>Edit Profile</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <div className="tf-create-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                         <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                            <div className="sc-card-profile text-center">
                                <div className="card-media">
                                    {
                                        formData.avatar?<img src={formData.avatar} alt="Axies" />:<img src={avt} alt="Axies" />
                                    }                         
                                </div>
                            <div id="upload-profile">
                                <Link to="#" className="btn-upload">
                                    Upload New Photo </Link>
                                    <input id="tf-upload-img" type="file" name="profile" required="" onChange={onChange} />
                            </div>
                            <button to="#" className="btn-upload style2">
                                Delete</button>
                            </div>
                         </div>
                         <div className="col-xl-9 col-lg-8 col-md-12 col-12">
                             <div className="form-upload-profile">
                                                                

                                <form onSubmit={handleSubmit} className="form-profile">
                                    <div className="form-infor-profile">
                                        <div className="info-account">
                                            <h4 className="title-create-item">Account info</h4>                                    
                                                <fieldset>
                                                    <h4 className="title-infor-account">Display name</h4>
                                                    <input type="text" placeholder="Trista Francis" required onChange={(e)=>setFormData({...formData, name:e.target.value})} />
                                                </fieldset>
                                                
                                                <fieldset>
                                                    <h4 className="title-infor-account">Email</h4>
                                                    <input type="email" placeholder="Enter your email" required onChange={(e)=>setFormData({...formData, email:e.target.value})}/>
                                                </fieldset>
                                                
                                        </div>
                                        <div className="info-social">
                                            
                                        </div> 
                                    </div>
                                    <button className="tf-button-submit mg-t-15" type="submit">
                                        Update Profile
                                    </button>           
                                </form>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
            <Footer />
        </div>
    );
}

export default EditProfile;
