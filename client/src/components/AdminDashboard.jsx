import { useContext, useEffect, useState } from "react";
import { getWebsiteName, updateWebsiteName } from "../API";
import UserContext from "../UserContext";

import { Form, Alert, Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminDashboard(props) {
  const user = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [validated, setValidated] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWebsiteName() {
      try {
        const websiteName = await getWebsiteName();
        props.updateWebsiteName(websiteName);
        setName(websiteName);
        setErrMsg("");
      } catch (err) {
        setErrMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchWebsiteName();
    } else {
      navigate("/login");
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const isValid = form.checkValidity();
    setValidated(true);

    if (!isValid) return;

    setLoading(true);
    try {
      const updatedName = await updateWebsiteName(name);
      props.updateWebsiteName(updatedName);
      setName(updatedName);
      setErrMsg("");
      setInfoMsg("Name updated successfully.");
    } catch (err) {
      setInfoMsg("");
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && 
          <Container className="d-flex my-5 justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>}

      {!loading && infoMsg && 
        <Alert key={"success"} variant="success" onClose={() => setInfoMsg("")} dismissible> {infoMsg} </Alert>}
      {!loading && errMsg && 
        <Alert key={"danger"} variant="danger" onClose={() => setErrMsg("")} dismissible> {errMsg} </Alert>}

      {!loading && (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <h2>Website settings</h2>

          <Form.Group className="mb-4" controlId="formName">
            <Form.Label>Website name</Form.Label>
            <Form.Control
              type="text"
              required
              value={name}
              onChange={(ev) => {
                setName(ev.target.value);
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a name for the website.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit">Save</Button>
        </Form>
      )}
    </>
  );
}

export { AdminDashboard };
