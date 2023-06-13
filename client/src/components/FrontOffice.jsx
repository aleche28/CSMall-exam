import { Col, Row, Container } from "react-bootstrap";

function FrontOffice(props) {
  return (
    <>
      <Container fluid>
        {props.pages && props.pages.map((p) => <PageRow key={p.id} page={p}/>)}
        </Container>
    </>
  );
}

function PageRow(props) {
  const page = props.page;

  return <>
    <Row>
      <Col>{page.title}</Col>
      <Col>{page.author}</Col>
      <Col>{page.creationDate}</Col>
      <Col>{page.publicationDate}</Col>
    </Row>
  </>
}

export { FrontOffice };
