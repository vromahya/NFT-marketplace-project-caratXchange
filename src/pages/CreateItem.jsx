import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel  } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import img1 from '../assets/images/box-item/img1.png'
import avt from '../assets/images/avatar/avt-9.jpg'
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from "react-router-dom";
// import {sellers} from '../assets/fake-data/sellers'
import axios from 'axios';

import { ethers } from 'ethers'


import NFTMint from '../NFTMint.json';
import {nftMintAddress} from '../config';
import MarketPlace from '../MarketPlace.json';
import { marketplaceAddress } from '../config';
import { useStateContext } from '../context/ContextProvider'; 

import users from '../assets/fake-data/users';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');




const CreateItem = () => {
    
    let navigate = useNavigate();


const [directBuyData,setDirectBuyData] = useState();
const [auctionData, setAuctionData]= useState();
const [formInput, setFormInput] = useState({price:'', name: '', description:'', collection:'',type:''});
const [formInput2, setFormInput2] = useState({name:'', minimumBid:'', duration:'', collection:'',type:''});
const [previewStateFixedPice, setPreviewState] = useState(true);

const [loading, setLoading] = useState(true);

const [ImagesAdded, setImagesAdded] = useState(false)

const [user, setUser] = useState();

const [FileObjects, setFileObjects] = useState([])
const [FileArray, setFileArray] = useState([])

const {web3Signer} = useStateContext();




const uploadFiles = async (fileArray) => {

    const urls = await Promise.all(fileArray.map(async (file,index)=>{

        const fileParts = file.name.split('.');
        const fileName = fileParts[0];
        const fileType = fileParts[1];
        const res=await axios.post("https://forever-carat-api.herokuapp.com/api/v1/sign_s3",{
            fileName : fileName,
            fileType : fileType
        })
        const returnData = res.data.data.returnData;
        const signedRequest = returnData.signedRequest;
        
        const url = returnData.url;
        
        const options = {
         headers: {
          "Content-Type": fileType,
          "Access-Control-Allow-Origin":"*"
         }
        };

        try {
            
            await axios.put(signedRequest,file,options)              
            return url
        } catch (error) {
            errorNotification("error",JSON.stringify(error))
            return;
        }       
      
    }))
     return urls   
}


const uploadMultipleFiles = (e)=>{
    setImagesAdded(false);

    let fileObj = [];

    fileObj.push(e.target.files)    
    
    
    let fileObjects = FileObjects
    let fileArray = FileArray;

    for(let i=0;i<fileObj.length; i++){
        for(let j=0; j<fileObj[i].length;j++){
            
            if(fileObj[i][j].size>50000000){
                fileArray=[];
                setFileArray([])
                setFileObjects([])
                errorNotification('Error in file size:', 'Upload media less than 50Mb');
                return;
            } 
            if(fileObj[i][j].type==='image/png'|| fileObj[i][j].type==='image/jpeg'|| fileObj[i][j].type==='image/jpg') {
                fileArray.push({type:'image', url: URL.createObjectURL(fileObj[i][j])});     
                fileObjects.push(fileObj[i][j]);           
            }
            else if(fileObj[i][j].type==='video/mp4'|| fileObj[i][j].type==='video/avi'|| fileObj[i][j].type==='video/webm') {
                fileArray.push({type:'video', url: URL.createObjectURL(fileObj[i][j])})
                fileObjects.push(fileObj[i][j]);
            }
            else {
                fileArray=[];
                setFileArray([])
                setFileObjects([])                
                errorNotification('Error in file type:', 'Upload only PNG, JPEG, JPG, AVI, MP4, WEBM');
                return;
            }
        }
    }

    setFileArray(fileArray);
    setFileObjects(fileObjects)
    console.log(FileArray)
    setImagesAdded(true)
       
}

const chooseMultipleFiles = (e)=>{
console.log(e)
}



async function uploadToIPFS() {

    const { name, description, collection, type} = formInput;
    
    if (!name || !description ||FileObjects.length===0) {
        toast.error('Please check item details! Name, description and image are required',{position: toast.POSITION.BOTTOM_RIGHT})
        return;
    }
    const media = await uploadFiles(FileObjects);
    
  /* first, upload to IPFS */
  const data = JSON.stringify({
    name,
    description,
    images: media,
    collection,
    type
  });
  try {
    const added = await client.add(data);
    const hash = added.path;
    /* after file is uploaded to IPFS, return the URL to use it in the transaction */
    return hash;
  } catch (error) {
    errorNotification('Error uploading meta file:', error);
  }
}
async function uploadToIPFS2() {
  const { name, description, collection, type } = formInput2;
  if (!name || !description || !FileObjects.length===0) return;

  const media = await uploadFiles(FileObjects)
  /* first, upload to IPFS */
  const data = JSON.stringify({
    name,
    description,
    images: media,
    collection,
    type
  });
  try {
    const added = await client.add(data);
    const hash = added.path;
    /* after file is uploaded to IPFS, return the URL to use it in the transaction */
    return hash;
  } catch (error) {
    errorNotification('Error uploading meta file:', error);
  }
}
async function listNFTForDirectSale() {
    if(!web3Signer){
      toast.error('Please connect wallet first',{position: toast.POSITION.BOTTOM_RIGHT})
      return;
    }
  try {
    
  const hash = await uploadToIPFS();
  if(!hash) {    
    return;
  }
  


  /* next, create the item */
  let mint = new ethers.Contract(
      nftMintAddress,
    NFTMint.abi,
    web3Signer
  );

    let transaction = await mint.mint(hash);
    let tx = await transaction.wait();
    
    let eventVal = await tx.events.find(event => event.event === "Transfer").args.tokenId;
    

  
    let tokenId = Number(eventVal._hex);
    
  
    let market = new ethers.Contract(
      marketplaceAddress,
      MarketPlace.abi,
      web3Signer
      )
      
      let listingPrice = await market.getListingFee();
            listingPrice = listingPrice.toString();
      const price = ethers.utils.parseUnits(directBuyData.price, 'ether');

    let createDirectSale = await market.createDirectSaleItem(tokenId, price, {value:listingPrice});
    await createDirectSale.wait();
    notify()

    setTimeout(() => {
        navigate("/");
    }, 5000);
    } catch (error) {
        if(error.error){
            let e= error.error.data.message;
            if(e==='execution reverted: ER_CODE_1'){
            toast.error(`Only seller can create item`,{position: toast.POSITION.BOTTOM_RIGHT} )
            return;
        }else{
            toast.error(`Error ${e}`,{position: toast.POSITION.BOTTOM_RIGHT} )
            return;
        }
        }
        if(error.message){
            errorNotification('Error in putting item on sale',error.message);
            console.log(error)
        }else {
            errorNotification('Error', error )
            console.log(error)
        }

         
    }
    
}
async function listNFTForAuction(){

    if(!web3Signer){
    toast.error('Please connect wallet first',{position: toast.POSITION.BOTTOM_RIGHT})
    return;
    }

    try {    
    const hash = await uploadToIPFS2();
    if(!hash){
    toast.error('Error in uploading files, Please wait for some time',{position: toast.POSITION.BOTTOM_RIGHT})
    return;
    }
    
    // console.log('clean initial code')

    const address = web3Signer._address;
    
    
    const startTime = Math.floor(Date.now()/1000);
    // console.log('clean getting address and startime')
    
    
    let mint = new ethers.Contract(
        nftMintAddress,
        NFTMint.abi,
        web3Signer
        );
        
        let transaction = await mint.mint(hash);
        let tx = await transaction.wait();
        
        

        let eventVal = tx.events.find(event => event.event === "Transfer").args.tokenId;
        
        
        let tokenId = Number(eventVal._hex);
        
        let market = new ethers.Contract(
            marketplaceAddress,
            MarketPlace.abi,
            web3Signer            
            )
            const minimumBid = ethers.utils.parseUnits(auctionData.minimumBid, 'ether');
            let listingPrice = await market.getListingFee();
            listingPrice = listingPrice.toString();
            // listingPrice = ethers.utils.parseUnits(listingPrice, 'ether');
            
            const duration = auctionData.duration*86400;  
    
    let createAuctionItem = await market.createAuction(nftMintAddress,tokenId, duration, minimumBid, address, startTime, {value: listingPrice});
    await createAuctionItem.wait();
    notify()
    setTimeout(() => {
      navigate("/");
  }, 5000);
    } catch (error) {
        if(error.error){
            let e= error.error.data.message;
            if(e==='execution reverted: ER_CODE_1'){
            toast.error(`Only seller can create item`,{position: toast.POSITION.BOTTOM_RIGHT} )
            return;
        }else{
            toast.error(`Error ${e}`,{position: toast.POSITION.BOTTOM_RIGHT} )
            return;
        }
        }
        if(error.message){
            errorNotification('Error in putting item on sale',error.message);
            console.log(error);
        }else {
            errorNotification('Error', error )
            console.log(error);

        } 
    }
}
const notify = ()=>{
    toast.success('Success',{position: toast.POSITION.BOTTOM_RIGHT});
}
const errorNotification = (errorIn,e)=>{
    toast.error(`${errorIn}: ${e}`,{position: toast.POSITION.BOTTOM_RIGHT})
}



const handleSubmitTab1 = async (e) =>{
    e.preventDefault();
    await listNFTForDirectSale();
}
const handleSubmitTab2 = async (e) =>{
    e.preventDefault();    
    await listNFTForAuction();  
}
useEffect(()=>{
    
    setLoading(true)    
    setUser(users[0])
    setLoading(false);
},[])

useEffect(()=>{

setDirectBuyData({...formInput});

setAuctionData({...formInput2});

},[formInput, formInput2])





    return (
        <div className='create-item'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Create Item</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="#">Pages</Link></li>
                                    <li>Create Item</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <div className="tf-create-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                         <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <h4 className="title-create-item">Preview item</h4>
                            <div className="sc-card-product">
                                <div className="card-media">
                                    {
                                        ImagesAdded?<img src={FileArray[0].url} alt="Axies" />:<img src={img1} alt="Axies" />
                                    }
                                    {formInput2.duration && 
                                    <div className="featured-countdown">
                                        <span className="slogan"></span>
                                         <Countdown date={Date.now() + (formInput2.duration*86400000)}>
                                            <span>You are good to go!</span>
                                        </Countdown>
                                    </div>
                                        }
                                </div>
                                <div className="card-title">
                                    {
                                       previewStateFixedPice? <h5>{formInput.name}</h5> : <h5>{formInput2.name}</h5> 
                                    }
                                    {/* <div className="tags">bsc</div> */}
                                </div>
                                <div className="meta-info">
                                    <div className="author">
                                        <div className="avatar">
                                            {
                                                loading? <img src={avt} alt="Axies" />:<img src={user.avatar} alt="Axies" />
                                            }
                                        </div>
                                        <div className="info">
                                            <span>Owned By</span>
                                            {
                                                loading?<h6> Freddie Carpenter</h6>:<h6> {user.name}</h6>
                                            }
                                        </div>
                                    </div>
                                    <div className="price">
                                        {
                                            previewStateFixedPice?
                                        <div>
                                            <span>Price</span>
                                            <h5>{formInput.price} MATIC</h5>
                                        </div>:
                                        <div>
                                            <span>Current Bid</span>
                                            <h5>{formInput2.minimumBid} MATIC</h5>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className="card-bottom">
                                    {
                                        previewStateFixedPice? 
                                        <h5 className="sc-button style bag fl-button pri-3"><span>Buy Now</span></h5>:
                                        <h5 className="sc-button style bag fl-button pri-3"><span>Place Bid</span></h5>
                                    }
                                    <h5 className="view-history reload">View History</h5>
                                </div>
                            </div>
                         </div>
                         <div className="col-xl-9 col-lg-6 col-md-12 col-12">
                             <div className="form-create-item">
                                 <form action="#">
                                    <h4 className="title-create-item">Choose files</h4>
                                    <label className="uploadFile">
                                        <span className="filename">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</span>
                                        <input type="file" className="inputfile form-control" name="file"  onChange={(e)=>uploadMultipleFiles(e)} onDrop={(e)=>chooseMultipleFiles(e)} multiple />
                                    </label>
                                    <div className="form-group multi-preview ml-10 mb-5">
                                        <div className="d-flex gap-2">
                                            {ImagesAdded && FileArray.map((media, index) => (
                                            <div key={index} className='m-1 p-1' style={{height:"90px", width:"160px"}}>
                                                {media.type==='image'? 
                                                
                                                <img  src={media.url} alt="..." className='img-thumbnail' style={{height:"100%", width:"auto"}}/> :
                                                
                                                <video  src={media.url} alt="..." className='img-thumbnail' style={{height:"100%", width:"auto"}}/> }
                                                
                                            </div>
                                            ))} 
                                        </div>                                                                                                                       
                                    </div>                                    
                                 </form>
                                 
                                <div className="flat-tabs tab-create-item">
                                    <h4 className="title-create-item mt-8">Select method</h4>
                                    <Tabs>
                                        <TabList>
                                            <Tab onClick={()=>setPreviewState(true)}><span className="icon-fl-tag" ></span>Fixed Price</Tab>
                                            <Tab onClick={()=>setPreviewState(false)}><span className="icon-fl-clock"></span>Timed Auction</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <form onSubmit={handleSubmitTab1} >
                                                <h4 className="title-create-item">Price</h4>
                                                <input type="text" placeholder="Enter price for one item (MATIC)" onChange={(e)=>{setFormInput({...formInput, price: e.target.value})}}  />

                                                <h4 className="title-create-item">Title</h4>
                                                <input type="text" placeholder="Item Name" onChange={(e)=>{setFormInput({...formInput, name: e.target.value})}} />
                                                <div className="d-flex gap-1">
                                                    <div>
                                                        <h4 className="title-create-item px-1">Collection <span className='text-muted' >(Optional)</span> </h4>
                                                    <input className='mx-2' type='text' placeholder="e.g. “King collection”" onChange={(e)=>{setFormInput({...formInput, collection: e.target.value})}}></input>
                                                    </div>
                                                    <div className='ml-10'>
                                                        <h4 className="title-create-item px-1">Type</h4>
                                                    <input className='mx-2' type='text' placeholder="e.g. “Ring”" onChange={(e)=>{setFormInput({...formInput, type: e.target.value})}}></input>
                                                    </div>
                                                </div>
                                                
                                                <h4 className="title-create-item">Description</h4>
                                                <textarea placeholder="e.g. “This is very limited item”" onChange={(e)=>{setFormInput({...formInput, description: e.target.value})}} maxLength={500}></textarea>
                                                                                              
                                                <button className="mt-12" type='submit' >Create Item</button>
                                            </form>
                                        </TabPanel>
                                        <TabPanel>
                                            <form onSubmit={handleSubmitTab2}>
                                                <h4 className="title-create-item">Minimum bid</h4>
                                                <input type="text" placeholder="Enter Minimum Bid (MATIC)" onChange={(e)=>setFormInput2({...formInput2, minimumBid: e.target.value})} />
                                                <div className="row">
                                                    
                                                    <div className="col-md-6">
                                                        <h5 className="title-create-item">Duration</h5>
                                                        <input type="number" placeholder='Duration in Days' name="duration" id="duration" className="form-control" min="1" onChange={e=>setFormInput2({...formInput2, duration: e.target.value})}/>
                                                    </div>                            
                                                </div>

                                                <h4 className="title-create-item">Title</h4>
                                                <input type="text" placeholder="Item Name" onChange={e=>setFormInput2({...formInput2, name: e.target.value})}/>

                                                <div className="d-flex gap-1">
                                                    <div>
                                                        <h4 className="title-create-item px-1">Collection <span className='text-muted' >(Optional)</span> </h4>
                                                    <input className='mx-2' type='text' placeholder="e.g. “King collection”" onChange={(e)=>{setFormInput({...formInput2, collection: e.target.value})}}></input>
                                                    </div>
                                                    <div className='ml-10'>
                                                        <h4 className="title-create-item px-1">Type</h4>
                                                    <input className='mx-2' type='text' placeholder="e.g. “Ring”" onChange={(e)=>{setFormInput({...formInput2, type: e.target.value})}}></input>
                                                    </div>
                                                </div>
                                                <h4 className="title-create-item">Description</h4>
                                                <textarea placeholder="e.g. “This is very limited item”" onChange={e=>setFormInput2({...formInput2, description: e.target.value})} maxLength={500}></textarea>
                                            <button className="mt-12" type='submit' >Create Item</button>
                                            </form>
                                        </TabPanel>
                                        
                                    </Tabs>
                                </div>
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

export default CreateItem;
