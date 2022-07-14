import React from 'react';
import { Carousel } from 'react-responsive-carousel';

const ImageGallery = props => {

    const images = props.images;
    console.log(images)
    return (
        <Carousel autoPlay>
            {
                images.map((image, index) => {
                    const type = image.slice(image.length-3,image.length)
                    if(type==='mp4' || type === 'avi' || type ==='ebm'){
                        return (<>
                            <div key={index}>
                                <video controls alt="item" src={image} />                        
                            </div>
                        </>)
                    }
                        return (<div>
                            <img src={image} alt="item" />
                        </div>)                       
                })
            }
        </Carousel>)
};

export default ImageGallery;
