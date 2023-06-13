import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrMsg('') ;
      await props.checkLogin(username, password);
      // when the user logs in, redirect them to the back-office
      navigate("/back-office");
    } catch (err) {
      setErrMsg(err.message) ;
    }
  };

  return (
    <>
      <Container className="login-container col-8 col-md-6 col-lg-4 border border-primary rounded mb-0">
        <Row>
          <h1>Login</h1>
        </Row>
        {errMsg && <Alert key={"danger"} variant={"danger"}>{errMsg}</Alert>}
        <Form>
          <Form.Group className="mb-3 mt-3" controlId="formGroupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(ev) => {
                setUsername(ev.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
              }}
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button className="mb-3 mt-3" variant="primary" type="submit" onClick={handleSubmit}>
              Login
            </Button>
          </div>
          <div className="below-button">
            <small>
              Not registered yet? <Link to={"/register"}>Register now</Link>
            </small>
          </div>
        </Form>
      </Container>
    </>
  );
}

export { LoginForm };
