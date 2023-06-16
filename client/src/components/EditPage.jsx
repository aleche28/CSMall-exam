import { useNavigate, useParams } from "react-router-dom";
import { getPage, getUsers, updatePageAdmin } from "../API";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import UserContext from "../UserContext";
import dayjs from "dayjs";

function EditPage(props) {
  const [page, setPage] = useState(undefined);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [blocks, setBlocks] = useState([]);

  const [dirty, setDirty] = useState(false);
  const [dirtyBlocks, setDirtyBlocks] = useState(false);

  const [infoMsg, setInfoMsg] = useState("");

  const user = useContext(UserContext);

  const { pageId } = useParams();
  const navigate = useNavigate();

  // update the fetched page when the user changes (e.g. logout)
  useEffect(() => {
    async function fetchPage() {
      try {
        const fetchedPage = await getPage(Number(pageId));
        setPage(fetchedPage);
        setErrMsg("");
        setLoading(false);
      } catch (err) {
        setErrMsg(err.message);
        setLoading(false);
      }
    }

    if (user) {
      fetchPage();
    } else {
      navigate("/login");
    }
  }, [user, pageId]);

  // update the fields of the forms when the pages changes (e.g. after saving)
  useEffect(() => {
    if (page) {
      setDirty(false);
      setDirtyBlocks(false);  
      setTitle(page.title);
      setAuthor(page.author);
      setPubDate(page.publicationDate);
      setBlocks((old) => page.blocks);
    }
  }, [page])

  // get the list of all users to fill in the author select
  useEffect(() => {
    async function fetchUsers() {
      try {
        if (user && user.role === "Admin") {
          const userList = await getUsers();
          setUsers(userList);
        } else {
          setUsers([]);
        }
      } catch (err) {
        setUsers([]);
      }
    }

    fetchUsers();
  }, [user])

  function handleReset() {
    setDirty(false);
    setDirtyBlocks(false);
    setTitle(page.title);
    setAuthor(page.author);
    setPubDate(page.publicationDate);
    setBlocks(page.blocks);
  }

  function handleSave() {
    const newPage = {
      title: title,
      author: author,
      publicationDate: pubDate, // formatting done at API level
      blocks: dirtyBlocks ? blocks : undefined // pass the blocks array only if it has been modified
    }
    if (user.role === "Admin") {
      updatePageAdmin(pageId, newPage)
        .then((p) => {
          setDirty(false);
          setDirtyBlocks(false);
          setPage(p);
          setInfoMsg("Page saved successfully.");
        })
        .catch((err) => setErrMsg(err.message));
    } else {
      updatePage(author, pageId, newPage)
        .then((p) => {
          setDirty(false);
          setDirtyBlocks(false);
          setPage(p);
          setInfoMsg("Page saved successfully.");
        })
        .catch((err) => setErrMsg(err.message));
    }
  }

  function handleUpdateBlocks(newBlocks) {
    setBlocks((old) => newBlocks);
    setDirty(true);
    setDirtyBlocks(true);
  }

  return (
    // prettier-ignore
    <>
      { // show error alert if there are errors after loading
        loading ? 
          ("Loading...") : 
          ( errMsg && <Alert key={"danger"} variant="danger"> {errMsg} </Alert>)
      }
      
      {infoMsg && <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}

      {!loading && page && user &&
        <>
          <Form>
            <Col xs="5">
                <Form.Group className="mb-4">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" required={true} value={title} onChange={(ev) => {setTitle(ev.target.value); setDirty(true);}}/>
                </Form.Group>
            </Col>
            <Col xs="2">
              <Form.Group className="mb-4">
                <Form.Label>Author</Form.Label>
                <Form.Select disabled={user.role !== "Admin"} value={author} onChange={(ev) => {setAuthor(ev.target.value); setDirty(true);}}>
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
                  <Form.Control type="date" min={dayjs().format("YYYY-MM-DD")} required={true} value={pubDate || ""} onChange={(ev) => {setPubDate(ev.target.value); setDirty(true);}}/>
                </Form.Group>
            </Col>
            <Form.Group className="mb-4">
              <Form.Label>Content blocks</Form.Label>
            </Form.Group>

            <EditBlocks blocks={blocks} updateBlocks={handleUpdateBlocks}/>
            
            <Container className="form-buttons pt-3 pb-5">
              <Button variant="danger" className="mx-3" size="lg" onClick={() => handleReset()}>Reset</Button>
              <Button variant="secondary" className="mx-3" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
              <Button variant="primary" className="mx-3" size="lg" onClick={() => handleSave()} disabled={!dirty}>Save</Button>
            </Container>
          </Form>
        </>
      }
    </>
  );
}

function EditBlocks(props) {
  const [blocks, setBlocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dirty, setDirty] = useState(false);
  
  useEffect(() => {
    setBlocks(props.blocks);
  }, [props])

  useEffect(() => {
    if (dirty) {
      props.updateBlocks(blocks);
      setDirty(false);
    }
  }, [dirty])

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
    setDirty(true);
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
    setDirty(true);
  }

  function deleteBlock(position) {
    setBlocks((oldBlocks) => {
      const newBlocks = [];
      oldBlocks.forEach((b) => {
        if (b.position === position)
          return;
        if (b.position > position)
          return newBlocks.push({...b, position: b.position-1});
        return newBlocks.push(b);
      });
      return newBlocks;
    })
    setDirty(true);
  }

  function addBlock(type, content) {
    console.log("Called addBlock with: " + type + " and " + content);
    setBlocks((oldBlocks) => {
      const maxPos = oldBlocks.length ? Math.max(...oldBlocks.map((b) => b.position)) : 0;
      const newBlocks = [...oldBlocks];
      newBlocks.push({ id: maxPos+1, position: maxPos+1, type: type, content: content });
      return newBlocks;
    });
    setShowForm(false);
    setDirty(true);
  }

  return (
    <>
      {blocks
        .sort((a, b) => a.position - b.position)
        .map((b) => 
          <BlockRow key={b.position} block={b} numBlocks={blocks.length}
            moveUp={moveUp} moveDown={moveDown}
            deleteBlock={deleteBlock}/>)}
      {showForm && <NewBlockForm addBlock={addBlock} closeForm={() => setShowForm(false)}></NewBlockForm>}
      {!showForm && <Button variant="primary" onClick={() => setShowForm(true)}>Add content block</Button>}
    </>
  )
}

function BlockRow(props) {
  return (
    <>
      <Row className="page-row my-3 py-3 ps-5 pe-3 border rounded">
        <Col xs={1}>{props.block.position}</Col>
        <Col>
          <Row>{props.block.type}</Row>
          <Row>{props.block.content}</Row>
        </Col>
        <Col xs={1}>
            <Button disabled={props.block.position === 1} variant="primary" className="mb-1" onClick={() => props.moveUp(props.block.position)}>
              <i className="bi bi-arrow-up"></i>
            </Button>
            <Button disabled={props.block.position === props.numBlocks} variant="primary" className="mb-1" onClick={() => props.moveDown(props.block.position)}>
              <i className="bi bi-arrow-down"></i>
            </Button>
        </Col>
        <Col xs={1}>
          <Button variant="danger" onClick={() => props.deleteBlock(props.block.position)}>
            <i className="bi bi-trash3"></i>
          </Button>
        </Col>
      </Row>
    </>
  )
}

function NewBlockForm(props) {
  const [type, setType] = useState("header");
  const [content, setContent] = useState("");

  return (
    <>
      <Row className="page-row my-3 py-3 ps-5 pe-3 border rounded">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label>Type</Form.Label>
            <Form.Select value={type} onChange={(ev) => {console.log(type);setType(ev.target.value)}}>
              <option key={"header"} value={"header"}>Header</option>
              <option key={"paragraph"} value={"paragraph"}>Paragraph</option>
              <option key={"image"} value={"image"}>Image</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={type === "header" ? 1 : 3} 
              value={content} onChange={(ev) => setContent(ev.target.value)} />
          </Form.Group>
        </Col>
        <Col xs={1}>
          <Button variant="danger" onClick={() => props.closeForm()}>
            <i className="bi bi-trash3"></i>
          </Button>
          <Button variant="success" onClick={() => {props.addBlock(type, content)}}>
            <i className="bi bi-check-lg"></i>
          </Button>
        </Col>
      </Row>
    </>
  )
}

export { EditPage };
