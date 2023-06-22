import { useNavigate } from "react-router-dom";
import { createPage, getImages } from "../API";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form } from "react-bootstrap";
import UserContext from "../UserContext";
import dayjs from "dayjs";
import { EditBlocks } from "./EditBlocks";

function AddPage(props) {
  const user = useContext(UserContext);

  const [images, setImages] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [blocks, setBlocks] = useState([]);

  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  // check if the user is authenticated
  useEffect(() => {
    if (!user)
      navigate("/login");
  }, [user]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const list = await getImages();
        setImages(list);
      } catch (err) {
        console.log(err);
        setImages([]);
      }
    }

    fetchImages();
  }, []);

  // reset all input forms to the original empty values
  function handleReset() {
    setTitle("");
    setPubDate("");
    setBlocks([]);
  }

  // save the new created page into the db
  async function handleSave(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const isValid = form.checkValidity();
    setValidated(true);

    if (
      !blocks.some((b) => b.type === "header") ||
      !blocks.some((b) => b.type !== "header")
    ) {
      setErrMsg("There must be at least one header block and an image/paragraph block.");
      return;
    }

    if (!isValid) return;
    
    const newPage = {
      title: title,
      author: author,
      /* creationDate added at API level */
      publicationDate: pubDate, // formatting done at API level
      blocks: blocks
    };
    
    try {
      const page = await createPage(newPage);
      setInfoMsg("Page saved successfully.");
      setTimeout(() => navigate(`/back-office/pages/${page.id}`), 500);
      //navigate(`/back-office/pages/${page.id}`);
    } catch (err) {
      setErrMsg(err.message);
    }
  }

  // update the list of blocks at the upper level from the EditBlocks at lower level
  function handleUpdateBlocks(newBlocks) {
    setBlocks(newBlocks);
  }

  return (
    // prettier-ignore
    <>
      {errMsg && <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}
      
      {infoMsg && <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}

      {user &&
        <>
          <Form noValidate validated={validated} onSubmit={handleSave}>
            <Col xs="5">
                <Form.Group className="mb-4" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" required value={title} 
                    onChange={(ev) => setTitle(ev.target.value)}/>
                  <Form.Control.Feedback type="invalid">Please provide a title.</Form.Control.Feedback>
                </Form.Group>
            </Col>
            
            <Col xs="2">
                <Form.Group className="mb-4" controlId="formCreationDate">
                  <Form.Label>Creation date</Form.Label>
                  <Form.Control disabled type="date" defaultValue={dayjs().format("YYYY-MM-DD")}/>
                </Form.Group>
            </Col>

            <Col xs="2">
                <Form.Group className="mb-4" controlId="formPublicationDate">
                  <Form.Label>Publication date</Form.Label>
                  <Form.Control type="date" value={pubDate || ""}
                    min={dayjs().format("YYYY-MM-DD")}
                    onChange={(ev) => setPubDate(ev.target.value)}/>
                </Form.Group>
            </Col>

            <Form.Group className="mb-4">
              <Form.Label>Content blocks</Form.Label><br/>
              <EditBlocks blocks={blocks} updateBlocks={handleUpdateBlocks} images={images}/>
            </Form.Group>

            <Container className="pt-3 pb-5">
              <Button variant="danger" className="mx-3" size="lg" onClick={() => handleReset()}>Reset</Button>
              <Button variant="secondary" className="mx-3" size="lg" onClick={() => navigate("/back-office")}>Cancel</Button>
              <Button type="submit" variant="primary" className="mx-3" size="lg">Save</Button>
            </Container>
          </Form>
        </>
      }
    </>
  );
}

export { AddPage };
