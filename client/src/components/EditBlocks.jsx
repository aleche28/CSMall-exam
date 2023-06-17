import { useEffect, useState } from "react";
import { Button, Carousel, Col, Container, Form, Row } from "react-bootstrap";
import { APIURL } from "../API";

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
            moveUp={moveUp}
            moveDown={moveDown}
            deleteBlock={deleteBlock}/>)}
      {showForm && <NewBlockForm images={props.images} addBlock={addBlock} closeForm={() => setShowForm(false)}></NewBlockForm>}
      {!showForm && <Button variant="primary" onClick={() => setShowForm(true)}>Add content block</Button>}
    </>
  )
}

function BlockRow(props) {
  return (
    <>
      <Row className="page-row my-3 py-3 ps-5 pe-3 border rounded">
        <Col className="block-position" xs={1}>{props.block.position}</Col>
        <Col>
          <Row className="ms-2 text-capitalize block-type">{props.block.type}</Row>
          <hr/>
          {props.block.type !== "image" ?
            <Row className="ms-2 pt-3">{props.block.content}</Row> :
            <img className="view-image" alt={props.block.content}
              src={APIURL + "/static/images/" + props.block.content}/>}
        </Col>

        <Col xs={1}>
            <Button variant="primary" className="mb-1"
              disabled={props.block.position === 1}
              onClick={() => props.moveUp(props.block.position)}>
              <i className="bi bi-arrow-up"></i>
            </Button>
            <Button variant="primary" className="mb-1"
              disabled={props.block.position === props.numBlocks}
              onClick={() => props.moveDown(props.block.position)}>
              <i className="bi bi-arrow-down"></i>
            </Button>
        </Col>

        <Col xs={1}>
          <Button variant="danger"
            onClick={() => props.deleteBlock(props.block.position)}>
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
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
    setContent(props.images[selectedIndex]);
  };



  return (
    <>
      <Row className="page-row my-3 py-3 ps-5 pe-3 border rounded">
        <Col>
          <Form.Group className="mb-2" controlId="formType">
            <Form.Label>Type</Form.Label>
            <Form.Select value={type} onChange={(ev) => setType(ev.target.value)}>
              <option key={"header"} value={"header"}>Header</option>
              <option key={"paragraph"} value={"paragraph"}>Paragraph</option>
              <option key={"image"} value={"image"}>Image</option>
            </Form.Select>
          </Form.Group>
          
          {type !== "image" && 
            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={type === "header" ? 1 : 3} 
                value={content} onChange={(ev) => setContent(ev.target.value)} />
            </Form.Group>}

          {type === "image" && props.images &&
            <Container className="d-flex flex-row justify-content-center">
              <Carousel slide={false} interval={null} variant="dark"
                activeIndex={index} onSelect={handleSelect}>
                {props.images.map((img, idx) => 
                  <Carousel.Item key={idx}>
                    <div className="carousel-img m-5 pb-5">
                      <img className="d-block h-100" alt={img}
                        src={APIURL + "/static/images/" + img} />
                    </div>
                    <Carousel.Caption>
                      <h5>{img}</h5>
                    </Carousel.Caption>
                </Carousel.Item>)}
              </Carousel>
            </Container>
          }

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

export { EditBlocks };