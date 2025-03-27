import React, { memo } from 'react';
import Tilt from 'react-parallax-tilt';
import LazyImage from "../../../../../components/LazyImage/LazyImage";

export const ProductImage = memo(({ product, isFirstProduct }) => {
  const image = (
    <LazyImage 
      src={product.img} 
      alt={product.name}
      className="product-image"
      aspectRatio="1/1"
      priority={isFirstProduct}
    />
  );

  if (isFirstProduct) {
    return <div className="product-card-image">{image}</div>;
  }

  return (
    <div className="product-card-image">
      <Tilt
        tiltMaxAngleX={20}
        tiltMaxAngleY={20}
        perspective={800}
        transitionSpeed={1500}
        scale={1.1}
        gyroscope={false}
        tiltReverse={true}
        trackOnWindow={false}
        glareEnable={false}
      >
        {image}
      </Tilt>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.product.img === nextProps.product.img && 
         prevProps.isFirstProduct === nextProps.isFirstProduct;
});

ProductImage.displayName = 'ProductImage'; 