import { Col, Row, Container } from "react-bootstrap";
import { getPublished } from "../API";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FrontOffice(props) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    getPublished().then((list) => {
      setPages(list);
    });
  }, []);

  return (
    <>
      <Container fluid className="col-sm-8">
        {pages && pages.map((p) => <PublishedPageRow key={p.id} page={p} />)}
      </Container>
    </>
  );
}

function PublishedPageRow(props) {
  const page = props.page;

  const navigate = useNavigate();

  return (
    <>
      <Row className="page-row my-3 py-3 px-5 border rounded" onClick={() => navigate(`/pages/${page.id}`)}>
        <Col>
          <Row><h4>{page.title}</h4></Row>
          <Row><small>by {page.author}</small></Row>
        </Col>
        <Col>
          <Row>Published on:</Row>
          <Row>{page.publicationDate}</Row>
        </Col>
      </Row>
    </>
  );
}

export { FrontOffice };
