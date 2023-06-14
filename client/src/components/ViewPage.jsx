import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getPage, getPublishedPage, APIURL } from "../API";
import UserContext from "../UserContext";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
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
    if (location.pathname === `/pages/${pageId}`) {
      //published page: auth not required
      getPublishedPage(Number(pageId))
        .then((p) => {
          setErrMsg("");
          setPage(p);
          setLoading(false);
        })
        .catch((err) => {
          setErrMsg(err.message);
          setLoading(false);
        });
    } else {
      // back-office page view: auth required
      if (user) {
        getPage(Number(pageId))
          .then((p) => {
            setPage(p);
            setErrMsg("");
            setLoading(false);
          })
          .catch((err) => {
            setErrMsg(err.message);
            setLoading(false);
          });
      } else {
        navigate("/login");
      }
    }
  }, [user]);

  function handlePublish() {

  }

  return (
    // prettier-ignore
    <>
      { // show error alert if there are errors after loading
        loading ? 
          ("Loading...") : 
          ( errMsg && <Alert key={"danger"} variant="danger"> {errMsg} </Alert>)
      }
      
      {!loading && page && <Page page={page} />}
      
      { // show the edit button if the user is authenticated and the route is /back-office/...
        !loading && user && page && location.pathname === `/back-office/pages/${pageId}` &&
          <Link className="btn btn-primary btn-lg fixed-right-bottom" to={`/back-office/edit/${pageId}`}/* state={{nextpage: location.pathname}} */>
            <i className="bi bi-pencil-fill"></i>
          </Link>
      }

      { // show the "publish now" button if the user is authenticated and is the author of the page
        !loading && user && page &&
          (!page.publicationDate || page.publicationDate > dayjs().format("YYYY-MM-DD")) &&
          <Button disabled={user.username !== page.author} variant="primary" size="lg" className="fixed-left-bottom" onClick={() => handlePublish()} /* state={{nextpage: location.pathname}} */>
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
