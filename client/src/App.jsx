import { useState, useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { login, logout } from "./API";
import { FrontOffice } from "./components/FrontOffice";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import UserContext from "./UserContext";

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { RegisterForm } from "./components/RegisterForm";
import { ViewPage } from "./components/ViewPage";
import { BackOffice } from "./components/BackOffice";
import { EditPage } from "./components/EditPage";
import { AddPage } from "./components/AddPage";

function App() {
  const [user, setUser] = useState(undefined);

  const checkLogin = async (username, password) => {
    const res = await login(username, password);
    setUser(res.user);
  };

  const handleLogout = async () => {
    await logout();
    setUser(undefined);
  };

  // prettier-ignore
  return (
    <>
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout handleLogout={handleLogout} />}>
              <Route index element={<FrontOffice />} />
              <Route path="pages/:pageId" element={<ViewPage />} />
              <Route path="back-office" element={<BackOffice />} />
              <Route path="back-office/pages/:pageId" element={<ViewPage />} />
              <Route path="back-office/edit/:pageId" element={<EditPage />} />
              <Route path="back-office/add" element={<AddPage />} />
              <Route path="login" element={<LoginForm checkLogin={checkLogin} />} />
              <Route path="register" element={<RegisterForm/>} />
              <Route path="*" element={/*<PageNotFound />*/ <h1>Page not found</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

function MainLayout(props) {
  const user = useContext(UserContext);

  return (
    <>
      <header>
        <Navbar sticky="top" variant="dark" bg="primary" expand="lg" className="mb-3">
          <Container>
            <Navbar.Brand>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                CMSmall
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar" />
              <Navbar.Collapse id="navbar">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
                  <Nav.Link as={Link} to={"/back-office"}>Back-Office</Nav.Link>
                </Nav>
                <Navbar.Text className="m-0 p-0">
                {user ? (
                  <>
                    <i className="bi bi-person-circle"></i>{" "}
                    <span>{user.username}</span>{" "}
                    <Link className="text-decoration-none ms-3" onClick={props.handleLogout}>Logout</Link>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                )}
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}

export default App;
