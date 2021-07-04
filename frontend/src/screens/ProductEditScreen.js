import React, { useEffect, useState } from "react";
import { useSetState } from "react-use";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getProduct, updateProduct } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { PRODUCT_UPDATE_RESET } from "../constant/productConstant";
import fetchClient from "../api";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const updatedProduct = useSelector((state) => state.productUpdate);
  const {
    loading: loadingProductDetails,
    error: loadingProductError,
    product,
  } = productDetails;

  const [modifiedProduct, setModifiedProduct] = useSetState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  });
  const {
    loading: updateProductLoading,
    error: updateProductError,
    success: updateProductSuccess,
  } = updatedProduct;

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (updateProductSuccess) {
      dispatch({
        type: PRODUCT_UPDATE_RESET,
      });
      history.push("/admin/products");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(getProduct(productId));
      } else {
        setModifiedProduct({ ...product });
      }
    }
  }, [
    dispatch,
    productId,
    product,
    setModifiedProduct,
    updateProductSuccess,
    history,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct(modifiedProduct));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await fetchClient.post("/api/uploads", formData, config);
      setUploading(false);
      setModifiedProduct({
        image: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/admin/products">
        Go Back
      </Link>
      {loadingProductDetails ? (
        <Loader />
      ) : loadingProductError ? (
        <Message variant="danger">{loadingProductError}</Message>
      ) : (
        <FormContainer>
          <h1>Edit Product</h1>
          {updateProductLoading && <Loader />}
          {updateProductError && (
            <Message variant="danger">{updateProductError}</Message>
          )}
          {loadingProductDetails ? (
            <Loader />
          ) : loadingProductError ? (
            <Message variant="danger">{loadingProductError}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter Name"
                  value={modifiedProduct.name}
                  onChange={(e) => setModifiedProduct({ name: e.target.value })}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Price"
                  value={modifiedProduct.price}
                  onChange={(e) =>
                    setModifiedProduct({ price: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image url"
                  value={modifiedProduct.image}
                  onChange={(e) =>
                    setModifiedProduct({ image: e.target.value })
                  }
                ></Form.Control>
                <Form.File
                  id="image-file"
                  label="Choose File"
                  custom
                  onChange={uploadFileHandler}
                >
                  {uploading && <Loader />}
                </Form.File>
              </Form.Group>

              <Form.Group controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Brand"
                  value={modifiedProduct.brand}
                  onChange={(e) =>
                    setModifiedProduct({ brand: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Category"
                  value={modifiedProduct.category}
                  onChange={(e) =>
                    setModifiedProduct({ category: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="countInStock">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter countInStock"
                  value={modifiedProduct.countInStock}
                  onChange={(e) =>
                    setModifiedProduct({ countInStock: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={modifiedProduct.description}
                  onChange={(e) =>
                    setModifiedProduct({ description: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          )}
        </FormContainer>
      )}
    </>
  );
};

export default ProductEditScreen;
