import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { createProductReview, getProduct } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constant/productConstant";
import Meta from "../components/Meta";

const ProductScreen = ({ match, history }) => {
  const id = match.params.id;
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const productDetails = useSelector((state) => state.productDetails);
  const { userInfo } = useSelector((state) => state.userLogin);
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { loading, error, product } = productDetails;
  const {
    loading: productReviewCreateLoading,
    error: productReviewCreateError,
    success: productReviewCreateSuccess,
  } = productReviewCreate;

  useEffect(() => {
    if (productReviewCreateSuccess) {
      setRating(0);
      setComment("");
      console.log("product review success created.");
    }
    if (!product._id || product._id !== id) {
      dispatch(getProduct(id));
      dispatch({
        type: PRODUCT_REVIEW_CREATE_RESET,
      });
    }
  }, [dispatch, id, productReviewCreateSuccess, product]);

  const addToCart = () => {
    history.push(`/cart/${id}?qty=${qty}`);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };

  return (
    <>
      <Meta title={product.name} />
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 ? (
                    <ListGroup.Item>
                      <Form.Control
                        as="select"
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((key) => (
                          <option key={key} value={key + 1}>
                            {key + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </ListGroup.Item>
                  ) : null}
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCart}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating}></Rating>
                  <p>{review.createdAt.toString().substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>Write a Review</h2>
                {productReviewCreateSuccess && (
                  <Message variant="success">
                    Review submit successfully.
                  </Message>
                )}
                {productReviewCreateLoading && <Loader />}
                {productReviewCreateError && (
                  <Message variant="danger">{productReviewCreateError}</Message>
                )}
                {userInfo ? (
                  <Form onSubmit={onSubmitHandler}>
                    <Form.Group>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={productReviewCreateLoading}
                      type="submit"
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    Please <Link to="/login">sign in</Link> to write a review{" "}
                  </Message>
                )}
              </ListGroup.Item>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
