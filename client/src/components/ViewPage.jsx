import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getPage, getPublishedPage, APIURL, updatePage, updatePageAdmin } from "../API";
import UserContext from "../UserContext";
import { Alert, Button, Container, Row, Spinner } from "react-bootstrap";
import dayjs from "dayjs";

function ViewPage(props) {
  const [page, setPage] = useState(undefined);

  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [loading, setLoading] = useState(true);

  const user = useContext(UserContext);

  const { pageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    fetchPage();    
  }, [user, pageId]);

  async function handlePublish() {
    try {
      setLoading(true);

      const publishedPage = { ...page, publicationDate: dayjs().format("YYYY-MM-DD") };
      user.role === "Admin" ?
        await updatePageAdmin(pageId, publishedPage) :
        await updatePage(page.author, pageId, publishedPage);
      
      fetchPage();
      setInfoMsg("Page has been published.");
    } catch(err) {
      // the error caught here is from the updatePage, because the errors in fetchPage are already handled inside it
      setErrMsg(err.message + " Page hasn't been published.");
      setLoading(false);
    }
  }

  return (
    // prettier-ignore
    <>
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

      {!loading && page && <Page page={page} />}
      
      { // show the edit button if the user is authenticated and the route is /back-office/...
        !loading && user && page &&
          location.pathname === `/back-office/pages/${pageId}` &&
          (user.role === "Admin" || user.username === page.author) &&
          <Link className="btn btn-primary btn-lg fixed-right-bottom" to={`/back-office/edit/${pageId}`}/* state={{nextpage: location.pathname}} */>
            <i className="bi bi-pencil-fill"></i>
          </Link>
      }

      { // show the "publish now" button if the user is authenticated and is the author of the page
        !loading && user && page &&
          (!page.publicationDate || page.publicationDate > dayjs().format("YYYY-MM-DD")) &&
          <Button disabled={user.username !== page.author} variant="primary" size="lg" className="fixed-left-bottom" onClick={() => handlePublish()}>
            Publish now
          </Button>
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
      {props.block.type === "header" && <h3>{props.block.content}</h3>}
      {props.block.type === "paragraph" && <p>{props.block.content}</p>}
      {props.block.type === "image" && <img src={APIURL + "/static/images/" + props.block.content} alt={props.block.content}></img>}
    </>
  )
}

export { ViewPage };
