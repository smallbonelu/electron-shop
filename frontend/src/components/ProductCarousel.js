import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { getTopProducts } from "../actions/productActions";
import Loader from "./Loader";
import Message from "./Message";
import "./ProductCarousel.css";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const topRatingProducts = useSelector((state) => state.productTop);
  const { topRatingProductsLoading, topRatingProductsError, products } =
    topRatingProducts;
  useEffect(() => {
    dispatch(getTopProducts());
  }, [dispatch]);
  return topRatingProductsLoading ? (
    <Loader />
  ) : topRatingProductsError ? (
    <Message variant="danger">{topRatingProductsError}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image alt={product.description} src={product.image} />
            <Carousel.Caption>
              <h2>{product.name}</h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
