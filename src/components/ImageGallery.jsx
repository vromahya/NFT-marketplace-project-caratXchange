import React from 'react';
import { Carousel } from 'react-responsive-carousel';

const ImageGallery = props => {

    const images = props.images;

    return (
        <Carousel autoPlay>
            {
                images.map((image, index) => (
                    <div key={index}>
                        <img alt="item" src={image} />
                        <p className="legend">Image {index + 1}</p>
                    </div>
                ))
            }
        </Carousel>)
};

export default ImageGallery;
