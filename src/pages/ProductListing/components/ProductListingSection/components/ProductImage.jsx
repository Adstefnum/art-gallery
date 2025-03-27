import React from 'react';
import Tilt from 'react-parallax-tilt';
import LazyImage from "../../../../../components/LazyImage/LazyImage";

export const ProductImage = ({ product, isFirstProduct }) => {
  const image = (
    <LazyImage 
      src={product.img} 
      alt={product.name}
      className="product-image"
      aspectRatio="1/1"
      priority={!isFirstProduct}
    />
  );

  return (
    <div className="product-card-image">
      {!isFirstProduct ? (
        <Tilt
          tiltMaxAngleX={20}
          tiltMaxAngleY={20}
          perspective={800}
          transitionSpeed={1500}
          scale={1.1}
          gyroscope={false}
          tiltReverse={true}
        >
          {image}
        </Tilt>
      ) : image}
    </div>
  );
}; 