import { useNavigate, useParams } from "react-router-dom";
import { getPage, getUsers, updatePageAdmin, updatePage, deletePageAdmin, deletePageAuthor, getImages } from "../API";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Spinner } from "react-bootstrap";
import UserContext from "../UserContext";
import dayjs from "dayjs";
import { EditBlocks } from "./EditBlocks";

function EditPage(props) {
  const user = useContext(UserContext);

  // store page fetched from db
  const [page, setPage] = useState(undefined);
  // store list of all users, so that admin can change authorship
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // store error/info messages to show them in an alert
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // store values of the input forms
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [blocks, setBlocks] = useState([]);

  /* 
   * If dirty is set (some info of the page has been modified),
   * then the "save" button is enable and, on click,
   * the page is updated in the db with the edited info from the forms
   */
  const [dirty, setDirty] = useState(false);

  /* 
   * Updating the page blocks is an expensive operation, so if the blocks
   * have not been modified, the update of the page will not update the blocks
   */ 
  const [dirtyBlocks, setDirtyBlocks] = useState(false);

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

  // update the fields of the input forms when the pages changes (e.g. after saving/loading)
  useEffect(() => {
    if (page) {
      setDirty(false);
      setDirtyBlocks(false);  
      setTitle(page.title);
      setAuthor(page.author);
      setPubDate(page.publicationDate);
      setBlocks(page.blocks);
    }
  }, [page])

  // fetch the list of all users to fill in the author select menu
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

  // reset all input forms to the original values
  function handleReset() {
    setDirty(false);
    setDirtyBlocks(false);
    setTitle(page.title);
    setAuthor(page.author);
    setPubDate(page.publicationDate);
    setBlocks(page.blocks);
  }

  // 
  async function handleSave() {
    if (
      !blocks.some((b) => b.type === "header") ||
      !blocks.some((b) => b.type !== "header")
    ) {
      setErrMsg("There must be at least one header block and an image/paragraph block.");
      return;
    }

    const newPage = {
      title: title,
      author: author,
      publicationDate: pubDate, // formatting done at API level
      blocks: dirtyBlocks ? blocks : undefined // pass the blocks array only if it has been modified
    };
    
    try {
      const updatedPage = user.role === "Admin"
        ? await updatePageAdmin(pageId, newPage)
        : await updatePage(author, pageId, newPage);

      setDirty(false);
      setDirtyBlocks(false);
      setPage(updatedPage);
      setInfoMsg("Page saved successfully.");
    } catch (err) {
      setErrMsg(err.message);
    }
  }

  async function handleDelete() {
    try {
      user.role === "Admin"
        ? await deletePageAdmin(pageId)
        : await deletePageAuthor(pageId, author);

      setLoading(true);
      setInfoMsg("Page deleted successfully.\nYou are being redirected to the back-office main page...");
      setTimeout(() => navigate("/back-office"), 2000);
    } catch (err) {
      setErrMsg(err.message);
    }
  }

  function handleUpdateBlocks(newBlocks) {
    setBlocks(newBlocks);
    setDirty(true);
    setDirtyBlocks(true);
  }

  return (
    // prettier-ignore
    <>
      {infoMsg && <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}

      
      { // show error alert if there are errors after loading
        loading ? 
          <Container className="d-flex my-5 justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container> :
          ( errMsg && <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>)
      }

      {!loading && page && user &&
        <>
          <Form>
            
            <Col xs="5">
                <Form.Group className="mb-4" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" required={true} value={title} 
                    onChange={(ev) => {
                      setTitle(ev.target.value);
                      setDirty(true);
                    }}/>
                </Form.Group>
            </Col>

            <Col xs="2">
              <Form.Group className="mb-4" controlId="formAuthor">
                <Form.Label>Author</Form.Label>
                <Form.Select disabled={user.role !== "Admin"} value={author}
                  onChange={(ev) => {
                    setAuthor(ev.target.value);
                    setDirty(true);
                  }}>
                  {!users.length && <option key={author} value={author}>{author}</option>}
                  {users.length && users.map((u, idx) => <option key={idx} value={u}>{u}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col xs="2">
                <Form.Group className="mb-4" controlId="formCreationDate">
                  <Form.Label>Creation date</Form.Label>
                  <Form.Control disabled type="date" required={true} defaultValue={page.creationDate}/>
                </Form.Group>
            </Col>

            <Col xs="2">
                <Form.Group className="mb-4" controlId="formPublicationDate">
                  <Form.Label>Publication date</Form.Label>
                  <Form.Control type="date" required={true} value={pubDate || ""}
                    min={dayjs().format("YYYY-MM-DD")}
                    onChange={(ev) => {
                      setPubDate(ev.target.value);
                      setDirty(true);
                    }}/>
                </Form.Group>
            </Col>

            <Form.Group className="mb-4">
              <Form.Label>Content blocks</Form.Label><br/>
              <EditBlocks blocks={blocks} updateBlocks={handleUpdateBlocks} images={props.images}/>
            </Form.Group>

            <Container className="form-buttons pt-3 pb-5">
              <Button variant="warning" className="mx-3" size="lg" onClick={() => handleReset()}>Reset</Button>
              <Button variant="secondary" className="mx-3" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
              <Button variant="primary" className="mx-3" size="lg" onClick={() => handleSave()} disabled={!dirty}>Save</Button>
            </Container>
            <Container className="form-buttons pb-5">
              <Button variant="danger" className="mx-3" size="lg" onClick={() => handleDelete()}>Delete page</Button>
            </Container>
          </Form>
        </>
      }
    </>
  );
}

export { EditPage };
