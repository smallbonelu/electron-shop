import React, { useEffect } from "react";
import { Button, Table, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { getOrderList, orderDelete } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const OrderListScreen = ({ history, match }) => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const orderDeleted = useSelector((state) => state.orderDelete);
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, orders } = orderList;
  const { success: orderDeleteSuccess } = orderDeleted;
  const { userInfo } = userLogin;
  useEffect(() => {
    dispatch(getOrderList());

    if (!userInfo?.isAdmin) {
      history.push("/login");
    }
  }, [dispatch, userInfo, history, orderDeleteSuccess]);

  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure to delete the order?")) {
      dispatch(orderDelete(id));
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/order/${order._id}`}>{order._id}</Link>
                </td>
                <td>{order.user.name}</td>
                <td>{order.createdAt}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteOrderHandler(order._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
