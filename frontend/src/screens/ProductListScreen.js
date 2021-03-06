import React, { useEffect } from "react";
import { Button, Table, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
  createProduct,
  deleteProduct,
  listProducts,
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { PRODUCT_CREATE_RESET } from "../constant/productConstant";

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const productDelete = useSelector((state) => state.productDelete);
  const productCreate = useSelector((state) => state.productCreate);
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, products, page, pages } = productList;
  const {
    loading: productCreateLoading,
    success: productCreateSuccess,
    error: productCreateError,
    createdProduct,
  } = productCreate;
  const {
    success: productDeleteSuccess,
    error: productDeleteError,
    loading: productDeleteLoading,
  } = productDelete;
  const { userInfo } = userLogin;
  useEffect(() => {
    dispatch({
      type: PRODUCT_CREATE_RESET,
    });

    if (!userInfo?.isAdmin) {
      history.push("/login");
    }

    if (productCreateSuccess) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    userInfo,
    history,
    productCreateSuccess,
    createdProduct,
    productDeleteSuccess,
    pageNumber,
  ]);

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure to delete the product?")) {
      dispatch(deleteProduct(id));
    }
  };
  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>
            CREATE PRODUCT
          </Button>
        </Col>
      </Row>
      {productDeleteLoading && <Loader />}
      {productDeleteError && (
        <Message variant="danger">{productDeleteError}</Message>
      )}
      {productCreateLoading && <Loader />}
      {productCreateError && (
        <Message variant="danger">{productCreateError}</Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>IN STOCK</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.countInStock}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteProductHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Paginate page={page} pages={pages} isAdmin={true} />
    </>
  );
};

export default ProductListScreen;
