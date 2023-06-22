import { Col, Row, Container, Alert, Spinner } from "react-bootstrap";
import { getPublished } from "../API";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function FrontOffice(props) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    async function fetchPublished() {
      try {
        const list = await getPublished();
        setErrMsg("");
        setPages(list);
      } catch (err) {
        setErrMsg(err.message);
        setPages([]);
      }
      setLoading(false);
    }
    
    fetchPublished();
  }, []);

  return (
    <>
      <Container fluid className="col-md-10">
        {loading &&
          <Container className="d-flex my-5 justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>}

        {!loading && errMsg &&
          <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}

        {!loading && pages &&
          pages
            .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
            .map((p) => <PublishedPageRow key={p.id} page={p} />)}
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
        <Col xs={6}>
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
      </Row>
    </>
  );
}

export { FrontOffice };
