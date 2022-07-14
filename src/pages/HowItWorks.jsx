import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { BsInfoCircle } from 'react-icons/bs';
import { CgPlayButtonR } from 'react-icons/cg';
import { BiShoppingBag } from 'react-icons/bi'
import { BsCurrencyDollar } from 'react-icons/bs'
import { GiGearHammer } from 'react-icons/gi'
import { FaRegHandshake } from 'react-icons/fa'
import { AiOutlineRight } from 'react-icons/ai'
import Tab from 'react-bootstrap/Tab'
import { Row, Col, Nav } from 'react-bootstrap'
import './HowItWorks.css'



const HelpCenter = () => {

    const [selected, setSelected] = useState(false);
    const [index, setIndex] = useState();

    const [dataBox] = useState(
        [
            {
                index: 1,
                icon: BsInfoCircle,
                title: 'Getting Started',
                description: 'Learn about CaratXchange and understand basic things about us',
                details: [{
                    question: 'What is a Non-Fungible Token (NFT)?',
                    answer: 'A non-fungible token (NFT) is a unique digital item. Non-Fungible Tokens (NFTs) are unique, digital items with blockchain-managed ownership. Examples of NFTs include digital art, collectibles, virtual reality items, crypto domain names, ownership records for physical assets, and more. The unique item that you create/ possess can be dropped here as an NFT and can be collected by collectors. The transaction is made possible through the use of block chain technology.'
                },
                {
                    question: 'What kind of transaction information is recorded on-chain?',
                    answer: "Ownership transfer records are recorded on the chain. Each collectible has a unique id. When a change of ownership occurs, the unique user id of the new owner and the item's serial number will be recorded on the blockchain."
                },
                {
                    question: 'What is CaratXchange?',
                    answer: 'CaratXchange is Worlds’s first Fine Jewelry  Marketplace. Discover, Collect, Rare Digital and Physical Fine Jewelry NFT'
                },
                {
                    question: 'How Can I Register on CaratXchange?',
                    answer: "You can simply sign in from the wallet, you don't need to give us your personal information to enjoy shopping on the website. However, you will need to give use personal information when you want physical possession of jewelery"
                },
                {
                    question: 'What if I want to create my own item on the platform?',
                    answer: 'Currently, we do not permit self-creation of NFTs on our platform. To get your products/jewelery listed as NFTs on our platform please submit your request to support@caratxchange.io. Admin will evaluate & get back to you.'
                },

                ]
            },
            {
                index: 2,
                icon: CgPlayButtonR,
                title: 'Creating',
                description: 'Learn about how to set up your wallet and what you can do on CaratXchange',
                details: [
                    {
                        question: 'How do I search for NFTs?',
                        answer: "You can use the searchbar at top to search for specific NFT's"
                    },
                    {
                        question: 'How to setup my crypto wallet',
                        answer: "You can freely purchase NFT's after adding crypto wallet extensions to your browser"
                    },
                    {
                        question: 'Which chains do we currently provide service on',
                        answer: "We are currently using POLYGON as our blockchain, we will add more chains as the time/usage allows"
                    },
                ]
            },
            {
                index: 3,
                icon: BiShoppingBag,
                title: 'Buying',
                description: 'Learn about how to buy NFTs and get physical possession of jewelery',
                details: [
                    {
                        question: "I'm trying to buy my first item. How do I make the Payment?",
                        answer: "You can go to the product page via explore or homepage or via search. You can freely buy product using you crypto wallet if the product is listed on sale. For products, on auction you can bid on them in hopes to win the auction"
                    },
                    {
                        question: "What is the pattern of auctions",
                        answer: "Our auctions follow simple english auction pattern with minimum bid increment of 10%"
                    },
                    {
                        question: "Is there a delivery charge?",
                        answer: "Yes, depending on your location and the size of the jewelery, there shall be a nominal delivery charge levied that shall be communicated to you through mail."
                    },
                    {
                        question: "How much time does it take for the collectible to reach me?",
                        answer: "It usually takes about 20-25 working days for your collectible to reach you."
                    },
                    {
                        question: "Why does it take so much time to deliver my collectible?",
                        answer: "Since the collectibles are highly valued and mostly delicate, we ensure that you receive a super secure delivery."
                    },
                    {
                        question: "Why does it take so much time to deliver my collectible?",
                        answer: "Since the collectibles are highly valued and mostly delicate, we ensure that you receive a super secure delivery."
                    },
                ]
            },
            {
                index: 4,
                icon: BsCurrencyDollar,
                title: 'Selling',
                description: 'Learn about how to sell your items on CaratXchange and listing fees on CaratXchange',
                details: [
                    {
                        question: "Does Fantico charge anything from the buyer ?",
                        answer: "No, Fantico doesn't charge any amount from the buyer unless the buyer resell the NFT."
                    },
                    {
                        question: "How are the items in sales priced?",
                        answer: "There are two pricing models: The fixed price model and the Auction model. In the fixed-price model, the seller/creator sets a fixed price for the item and the buyer gets the item at its fixed price. In the auction model, the item is given a minimum bid amount and an auction end date. The buyer can place bids that are 5% greater than the previous bid within the auction period. The seller can end the auction early by cancelling the auction and refunding the highest bidder or by ending the auction early thereby the current highest bidder wins the auction."
                    },
                    {
                        question: "What happens when the NFT I own is sold?",
                        answer: "The NFT's status os changed to order in transit and the seller need to prepare for the delivery. The funds for selling are reflected in the crypto-wallet as soon as NFT is sold"
                    },
                    {
                        question: "Why is the transaction confirmation time taking so long?",
                        answer: "Sometimes, blockchain may be congested with previous transactions, hence transaction confirmation can take longer than expected. If you are experiencing a delay, you can write to us on support@caratxchange.io."
                    },

                ]
            },
            {
                index: 5,
                icon: GiGearHammer,
                title: 'Creating',
                description: 'Learn about who can create sell on CaratXchange',
                details: [
                    {
                        question: "How do I create an NFT?",
                        answer: "CaratXchange is a curated Only platform which means that every NFT on our platform goes through a stringent verification process to provide our customers only with the most unique and authentic product."
                    },
                    {
                        question: 'What if I want to put a unique item I possess as NFT, on CaratxChange?',
                        answer: 'Please submit your request to marketing@caratxchange.io. Our team will evaluate the item and proposal & come back to you.'
                    }
                ]
            },
            {
                index: 6,
                icon: FaRegHandshake,
                title: 'Developers',
                description: 'We look forward to partnerships opportunities feel free to reach out',
                details: [
                    {
                        question: "How can I partner with Fantico?",
                        answer: "We look forward to partnership opportunities, please contact marketing@caratxchange.io"
                    },
                    {
                        question: 'Do you offer technical support for developers?',
                        answer: 'Please contact support@caratxchange.io with details for what exact support you are looking for'
                    }
                ]
            },
        ]
    )
    const handleClick = (index) => {
        setIndex(index);
        setSelected(true)
    }
    const handleTabChange = (index) => {
        console.log(index)
        setIndex(index)
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
                                <h1 className="heading text-center">Help Center</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>Help Center</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-help-center tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="tf-title-heading ct style-2 fs-30 mg-bt-10">
                                How Can We Help You?
                            </h2>
                            <p className="text-center mg-t-40 mg-bt-60">Choose a categories to quickly find the help you need</p>
                        </div>
                    </div>
                    {!selected && <div className="sc-box-icon-inner style-3">
                        {
                            dataBox.map((item) => {
                                const Icon = item.icon;
                                console.log(Icon)
                                return (
                                    <div key={item.index} className={`sc-box-icon`} id='clickable' onClick={() => handleClick(item.index)}>
                                        <div className="icon">
                                            <div className="icon-item">
                                                <Icon className='text-white w-50 h-50' />
                                            </div>
                                        </div>
                                        <h4 className="heading">{item.title}</h4>
                                        <p className="content">{item.description}</p>
                                    </div>)
                            })
                        }

                    </div>}
                    {selected && <Tab.Container id="left-tabs-example" activeKey={index} >
                        <Row>
                            <Col sm={3} className='ml-15' >
                                <Nav variant="pills" className="flex-column gap-3">

                                    {dataBox.map((item, id) => {
                                        const Icon = item.icon;
                                        return (
                                            <Nav.Item style={{ cursor: 'pointer' }} >
                                                <Nav.Link eventKey={item.index} onClick={() => handleTabChange(item.index)} className='m-2'><h5 className='flex fs-5 p-2' ><span><Icon className={` px-2 w-100 h-100 ${() => item.index === index ? 'text-white bg:light grey' : 'text-black'}`} /></span>{item.title} <span className={`${() => item.index === index ? 'text-white' : 'hidden'}`} style={{ marginLeft: "auto" }} ><AiOutlineRight /></span></h5> </Nav.Link>
                                            </Nav.Item>
                                        )
                                    })}
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    {dataBox.map((item, id) => (
                                        <Tab.Pane eventKey={item.index}>
                                            <div className='flex-row'>
                                                {item.details.map((itemm, id) => (
                                                    <div className="qa" key={id}>
                                                        <h4 className='p-3 ml-2 mt-10' >{itemm.question}</h4>
                                                        <hr />
                                                        <p className='p-3 ml-2'>{itemm.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </Tab.Pane>
                                    ))}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                    }
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default HelpCenter;
