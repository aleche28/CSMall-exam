const APIURL = "http://localhost:3000/api";

/******  AUTH  ******/

async function login(username, password) {
  try {
    const response = await fetch(APIURL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const res = await response.json();
      const message = res.error.message;
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function register(username, email, password) {
  try {
    const response = await fetch(APIURL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //credentials: "include", // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify({ username, email, password }),
    });
    if (response.ok) {
      return true;
    } else {
      const res = await response.json();
      const message = res.error;
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function getLoggedUser() {
  try {
    const response = await fetch(APIURL + "/sessions/current", {
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function logout() {
  try {
    const response = await fetch(APIURL + "/logout", {
      method: "POST",
    });
    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (err) {
    throw new Error(err);
  }
}

/******  PAGES  ******/

async function getPublished() {
  try {
    const response = await fetch(APIURL + "/pages/published");

    if (response.ok) {
      const pages = await response.json();
      return pages;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function getAll() {
  try {
    const response = await fetch(APIURL + "/pages", { credentials: "include" });

    if (response.ok) {
      const pages = await response.json();
      return pages;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

export { login, register, logout, getPublished, getAll };
