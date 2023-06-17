import { Col, Row, Container, Alert, Button, Spinner } from "react-bootstrap";
import { getAll, deletePageAdmin, deletePageAuthor } from "../API";
import { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function BackOffice(props) {
  const [pages, setPages] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const user = useContext(UserContext);

  const navigate = useNavigate();

  async function fetchPages(user) {
    if (user) {
      try {
        const pages = await getAll();
        setErrMsg("");
        setPages(pages);
      } catch(err) {
        setErrMsg(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  }

  useEffect(() => {
    fetchPages(user);
  }, [user]);

  async function handleDelete(pageId, author) {
    console.log("called");
    try {
      user.role === "Admin"
        ? await deletePageAdmin(pageId)
        : await deletePageAuthor(pageId, author);

      setInfoMsg("Page deleted successfully.");
      fetchPages(user);
    } catch (err) {
      setErrMsg(err.message);
    }
  }

  return (
    <>
      <Container fluid className="pages-list col-md-10">
        {!loading && errMsg &&
          <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}

        {!loading && infoMsg &&
          <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}

        {loading && 
          <Container className="d-flex my-5 justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>}

        {!loading && pages && 
          <>
            {pages.sort((a, b) => b.creationDate.localeCompare(a.creationDate)).map((p) => <PageRow key={p.id} page={p} deletePage={handleDelete}/>)}
            <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/back-office/add"> &#43; </Link>
          </>}
      </Container>
    </>
  );
}

function PageRow(props) {
  const page = props.page;
  const user = useContext(UserContext);
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
          <Button variant={"primary"} className="circular-button" onClick={() => navigate(`/back-office/edit/${page.id}`)}
            disabled={user && user.role !== "Admin" && page.author !== user.username}>
            <i className="bi bi-pencil-fill"></i>
          </Button>
        </Col>
        <Col xs={1} className="page-row-btn">
          <Button variant={"danger"} className="circular-button" onClick={() => props.deletePage(page.id, page.author)}
            disabled={user && user.role !== "Admin" && page.author !== user.username}>
            <i className="bi bi-trash3"></i>
          </Button>
        </Col>
      </Row>
    </>
  );
}

export { BackOffice };
