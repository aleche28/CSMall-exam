import { Col, Row, Container } from "react-bootstrap";
import { getPublished } from "../API";
import { useEffect, useState } from "react";

function FrontOffice(props) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    getPublished().then((list) => {
      setPages(list);
    });
  }, []);

  return (
    <>
      <Container fluid>
        {pages && pages.map((p) => <PublishedPageRow key={p.id} page={p} />)}
      </Container>
    </>
  );
}

function PublishedPageRow(props) {
  const page = props.page;

  return (
    <>
      <Row className="page-row mb-3 mt-3 p-3 p-3 border rounded">
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
