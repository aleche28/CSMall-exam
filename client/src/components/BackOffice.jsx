import { Col, Row, Container, Alert } from "react-bootstrap";
import { getAll } from "../API";
import { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function BackOffice(props) {
  const [pages, setPages] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const user = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getAll()
      .then((list) => {
        setErrMsg("");
        setPages(list);
      })
      .catch((err) => {
        setErrMsg(err.message);
      });
    } else {
      navigate("/login");
    }
  }, [user]);

  return (
    <>
      <Container fluid className="pages-list col-md-10">
        {errMsg && <Alert key={"danger"} variant={"danger"}>{errMsg}</Alert>}
        {pages && pages.map((p) => <PageRow key={p.id} page={p} />)}
        <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/back-office/add" /* state={{nextpage: location.pathname}} */> &#43; </Link>
      </Container>
    </>
  );
}

function PageRow(props) {
  const page = props.page;
  const navigate = useNavigate();

  return (
    <>
      <Row className="page-row no-hover my-3 py-3 ps-5 pe-3 border rounded">
        <Col xs={5}>
          <Row><h4>{page.title}</h4></Row>
          <Row><small>Author: {page.author}</small></Row>
        </Col>
        <Col  className="page-row-date">
          <Row>Created on:</Row>
          <Row>{page.creationDate}</Row>
        </Col>
        <Col className="page-row-date">
        {!page.publicationDate && <Row>Draft</Row>}
        {page.publicationDate && (page.publicationDate <= dayjs().format("YYYY-MM-DD") ?
          <><Row>Published on:</Row>
          <Row>{page.publicationDate}</Row></>
          :
          <><Row>Scheduled for:</Row>
          <Row>{page.publicationDate}</Row></>)
        }
        </Col>
        <Col xs={1} className="page-row-btn">
          <Link className="btn btn-primary circular-button" to={`/back-office/pages/${page.id}`}>
            <i className="bi bi-eye-fill"></i>
          </Link>
        </Col>
        <Col xs={1} className="page-row-btn">
          <Link className="btn btn-primary circular-button" to={`/back-office/edit/${page.id}`}>
            <i className="bi bi-pencil-fill"></i>
          </Link>
        </Col>
      </Row>
    </>
  );
}

export { BackOffice };
