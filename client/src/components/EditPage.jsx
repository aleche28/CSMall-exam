import { useNavigate, useParams } from "react-router-dom";
import { getPage, getUsers } from "../API";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import UserContext from "../UserContext";

function EditPage(props) {
  const [page, setPage] = useState(undefined);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [blocks, setBlocks] = useState([]);

  const user = useContext(UserContext);

  const { pageId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [user]);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setAuthor(page.author);
      setPubDate(page.publicationDate);
      setBlocks((old) => page.blocks);
    }
  }, [page])

  useEffect(() => {
    if (user && user.role === "Admin") {
      getUsers()
        .then((list) => setUsers((old) => list))
        .catch((err) => setUsers((old) => []));
    } else {
      setUsers((old) => []);
    }
  }, [user])

  function moveUp(oldPosition) {
    setBlocks((oldBlocks) =>
      oldBlocks.map((b) => {
        if (b.position === oldPosition)
          return {...b, position: oldPosition-1};
        if (b.position === (oldPosition-1))
          return {...b, position: oldPosition};
        return b;
      })
    )
  }

  function moveDown(oldPosition) {
    setBlocks((oldBlocks) =>
      oldBlocks.map((b) => {
        if (b.position === oldPosition)
          return {...b, position: oldPosition+1};
        if (b.position === (oldPosition+1))
          return {...b, position: oldPosition};
        return b;
      })
    )
  }

  return (
    // prettier-ignore
    <>
      { // show error alert if there are errors after loading
        loading ? 
          ("Loading...") : 
          ( errMsg && <Alert key={"danger"} variant="danger"> {errMsg} </Alert>)
      }
      
      {!loading && page && user &&
        <>
          <Form>
            <Col xs="5">
                <Form.Group className="mb-4">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" required={true} value={title} onChange={(ev) => setTitle(ev.target.value)}/>
                </Form.Group>
            </Col>
            <Col xs="2">
              <Form.Group className="mb-4">
                <Form.Label>Author</Form.Label>
                <Form.Select disabled={user.role !== "Admin"} value={author} onChange={(ev) => setAuthor(ev.target.value)}>
                  {!users.length && <option key={author} value={author}>{author}</option>}
                  {users.length && users.map((u) => <option key={u} value={u}>{u}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs="5">
                <Form.Group className="mb-4">
                  <Form.Label>Creation date</Form.Label>
                  <Form.Control disabled type="date" required={true} defaultValue={page.creationDate}/>
                </Form.Group>
            </Col>
            <Col xs="5">
                <Form.Group className="mb-4">
                  <Form.Label>Publication date</Form.Label>
                  <Form.Control type="date" required={true} value={pubDate || ""} onChange={(ev) => setPubDate(ev.target.value)}/>
                </Form.Group>
            </Col>
            <Form.Group className="mb-4">
              <Form.Label>Content blocks</Form.Label>
            </Form.Group>
            <EditBlocks blocks={blocks} moveUp={moveUp} moveDown={moveDown}/>
          </Form>
        </>
      }

    </>
  );
}

function EditBlocks(props) {
  return (
    <>
      {props.blocks
        .sort((a, b) => a.position - b.position)
        .map((b) => 
          <BlockRow key={b.id} block={b} moveUp={props.moveUp} moveDown={props.moveDown} numBlocks={props.blocks.length} />)}
    </>
  )
}

function BlockRow(props) {
  return (
    <>
      <Row className="page-row my-3 py-3 ps-5 pe-3 border rounded">
        <Col xs={1}>{props.block.position}</Col>
        <Col>
          <Row>Type: {props.block.type}</Row>
          <Row>{props.block.content}</Row>
        </Col>
        <Col xs={2}>
          <Button disabled={props.block.position === 1} variant="primary circular-button" onClick={() => props.moveUp(props.block.position)}>
            <i className="bi bi-arrow-up"></i>
          </Button>{" "}
          <Button disabled={props.block.position === props.numBlocks} variant="primary circular-button" onClick={() => props.moveDown(props.block.position)}>
            <i className="bi bi-arrow-down"></i>
          </Button>
        </Col>
      </Row>
    </>
  )
}

export { EditPage };
