import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../API";

function RegisterForm(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrMsg('') ;
      await register(username, email, password);
      navigate("/login");
    } catch (err) {
      setErrMsg(err.message) ;
    }
  };

  return (
    <>
      <Container className="login-container col-8 col-md-6 col-lg-4 border border-primary rounded mb-0">
        <Row>
          <h1>Register</h1>
        </Row>
        {errMsg && <Alert key={"danger"} variant={"danger"}>{errMsg}</Alert>}
        <Form>
          <Form.Group className="mb-3 mt-3" controlId="formGroupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={username} onChange={(ev)=>{setUsername(ev.target.value)}}/>
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(ev)=>{setEmail(ev.target.value)}}/>
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(ev)=>{setPassword(ev.target.value)}}/>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button className="mb-3 mt-3" variant="primary" type="submit" onClick={handleSubmit}>
              Register
            </Button>
          </div>
          <div className="below-button">
            <small>
              Already registered? <Link to={"/login"}>Login</Link>
            </small>
          </div>
        </Form>
      </Container>
    </>
  );
}

export { RegisterForm };
