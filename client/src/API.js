const APIURL = "http://localhost:3000/api";

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

async function getPublishedPage(pageId) {
  try {
    const response = await fetch(APIURL + `/pages/published/${pageId}`, {
      credentials: "include",
    });

    if (response.ok) {
      const page = await response.json();
      return page;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function getPage(pageId) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}`, {
      credentials: "include",
    });

    if (response.ok) {
      const page = await response.json();
      return page;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function getUsers() {
  try {
    const response = await fetch(APIURL + `/users`, { credentials: "include" });

    if (response.ok) {
      const users = await response.json();
      return users;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function updatePageAdmin(pageId, newPage) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newPage),
    });

    if (response.ok) {
      const updatedPage = await response.json();
      return updatedPage;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function updatePage(authorId, pageId, newPage) {
  try {
    const response = await fetch(
      APIURL + `/author/${authorId}/pages/${pageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newPage),
      }
    );

    if (response.ok) {
      const updatedPage = await response.json();
      return updatedPage;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function createPage(page) {
  try {
    const response = await fetch(APIURL + `/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(page),
    });

    if (response.ok) {
      const newPage = await response.json();
      return newPage;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function deletePageAdmin(pageId) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function deletePageAuthor(pageId, authorId) {
  try {
    const response = await fetch(
      APIURL + `/authors/${authorId}/pages/${pageId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function getImages() {
  try {
    const response = await fetch(APIURL + "/images");

    if (response.ok) {
      const list = await response.json();
      return list;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function getWebsiteName() {
  try {
    const response = await fetch(APIURL + "/configs/websitename", {
      credentials: "include",
    });

    if (response.ok) {
      const res = await response.json();
      return res.websiteName;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function updateWebsiteName(newWebsiteName) {
  try {
    const response = await fetch(APIURL + "/configs/websitename", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ websiteName: newWebsiteName }),
    });

    if (response.ok) {
      const { websiteName } = await response.json();
      return websiteName;
    } else {
      const res = await response.json();
      throw new Error(res.error);
    }
  } catch (err) {
    throw new Error(err);
  }
}

export {
  login,
  logout,
  getPublished,
  getAll,
  getPublishedPage,
  getPage,
  getUsers,
  updatePageAdmin,
  updatePage,
  createPage,
  deletePageAdmin,
  deletePageAuthor,
  getImages,
  getWebsiteName,
  updateWebsiteName,
  APIURL,
};
