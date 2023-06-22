import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getPage, getPublishedPage, APIURL, updatePage, updatePageAdmin } from "../API";
import UserContext from "../UserContext";
import { Alert, Button, Container, Row, Spinner } from "react-bootstrap";
import dayjs from "dayjs";

function ViewPage(props) {
  const [page, setPage] = useState(undefined);

  const [errMsg, setErrMsg] = useState("");

  const [loading, setLoading] = useState(true);

  const user = useContext(UserContext);

  const { pageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
  
        let fetchedPage;
        if (location.pathname === `/pages/${pageId}`) {
          fetchedPage = await getPublishedPage(Number(pageId));
        } else {
          if (!user) {
            navigate("/login");
            return;
          }
          fetchedPage = await getPage(Number(pageId));
        }
  
        setPage(fetchedPage);
        setErrMsg("");
      } catch (err) {
        setPage(undefined);
        setErrMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();    
  }, [user, pageId]);

  return (
    // prettier-ignore
    <>
      {!loading && errMsg &&
        <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}

      {loading && 
        <Container className="d-flex my-5 justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>}

      {!loading && page && <Page page={page} />}
      
      { // show the edit button if the user is authenticated and the route is /back-office/...
        !loading && user && page &&
          location.pathname === `/back-office/pages/${pageId}` &&
          (user.role === "Admin" || user.username === page.author) &&
          <Link className="btn btn-primary btn-lg fixed-right-bottom" to={`/back-office/edit/${pageId}`}/* state={{nextpage: location.pathname}} */>
            <i className="bi bi-pencil-fill"></i>
          </Link>
      }
    </>
  );
}

function Page(props) {
  const page = props.page;

  //prettier-ignore
  return (
    <>
      <Container className="page-view-container">

            <Row>Created on: {page.creationDate}</Row>
            {!page.publicationDate && <Row className="page-status">Draft</Row>}
            {page.publicationDate && (page.publicationDate <= dayjs().format("YYYY-MM-DD") ?
              <><Row className="page-status">Published on: {page.publicationDate}</Row></> :
              <><Row className="page-status">Scheduled for: {page.publicationDate}</Row></>)}
        
            <Row><h1>{page.title}</h1></Row>
            <Row><address className="author">By {page.author}</address></Row>
            {page.blocks.length && page.blocks.sort((a, b) => a.position - b.position).map((b) => <Block key={b.id} block={b} />)}
      </Container>
    </>
  );
}

function Block(props) {
  return (
    <>
      <Container className="mb-2">
        {props.block.type === "header" && <h3>{props.block.content}</h3>}
        {props.block.type === "paragraph" && <p>{props.block.content}</p>}
        {props.block.type === "image" && <img className="view-image" src={APIURL + "/static/images/" + props.block.content} alt={props.block.content}></img>}
        <br/>
      </Container>
    </>
  )
}

export { ViewPage };
