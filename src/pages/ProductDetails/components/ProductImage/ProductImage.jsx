import "./ProductImage.css";
import Tilt from "react-parallax-tilt";
import  LazyImage  from "../../../../components/LazyImage/LazyImage";

import React from "react";

export const ProductImage = ({ selectedProduct }) => {
  return (
    <Tilt
      tiltEnable={false}
      scale={1.15}
      transitionSpeed={1000}
      className="product-details-image"
    >
      <LazyImage 
        src={selectedProduct?.img} 
        alt={selectedProduct.name}
        priority={true}
      />
    </Tilt>
  );
};
