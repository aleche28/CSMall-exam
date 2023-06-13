import { useState, useEffect, useContext } from "react";
import { Button, Col, Container, Navbar, Row } from "react-bootstrap";
import { getPublished, login, logout } from "./API";
import { FrontOffice } from "./components/FrontOffice";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import UserContext from './UserContext';

import "bootstrap/dist/css/bootstrap.min.css";
import { RegisterForm } from "./components/RegisterForm";

function App() {
  const [pages, setPages] = useState([]);
  const [user, setUser] = useState({});

  const checkLogin = async (username, password) => {
    const res = await login(username, password);
    setUser(res.user);
  };

  const handleLogout = async () => {
    await logout();
    setUser({});
  };

  useEffect(() => {
    getPublished().then((list) => {
      setPages(list);
    });
  }, []);

  return (
    <>
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout handleLogout={handleLogout} />}>
              <Route index element={<FrontOffice pages={pages} />} />
              <Route
                path="/login"
                element={<LoginForm checkLogin={checkLogin} />}
              />
              <Route
                path="/register"
                element={<RegisterForm/>}
              />
              <Route
                path="*"
                element={/*<PageNotFound />*/ <h1>Page not found</h1>}
              />
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
        <Navbar
          sticky="top"
          variant="dark"
          bg="primary"
          expand="lg"
          className="mb-3"
        >
          <Container>
            <Navbar.Brand>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                CMSmall
              </Link>
            </Navbar.Brand>
            <Navbar.Text>
              {user.id ? (
                <span>
                  {user.username} <Link onClick={props.handleLogout}>Logout</Link>
                </span>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </Navbar.Text>
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
