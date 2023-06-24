[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #1: "CMSmall"

## Student: s314858 Chessa Alessio

# Server side

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/pages/published`
  - request parameters
  - response body content
- GET `/api/pages/published/:pageId`
  - request parameters and request body content
  - response body content
- GET `/api/pages`
  - request parameters and request body content
  - response body content
- GET `/api/pages/:pageId`
  - request parameters and request body content
  - response body content
- POST `/api/pages`
  - request parameters and request body content
  - response body content
- PUT `/authors/:authorId/pages/:pageId`
  - request parameters and request body content
  - response body content
- DELETE `/authors/:authorId/pages/:pageId`
  - request parameters and request body content
  - response body content
- PUT `/pages/:pageId`
  - request parameters and request body content
  - response body content
- DELETE `/pages/:pageId`
  - request parameters and request body content
  - response body content

## Database Tables

- Table `users` - contains id, username, email, salt, hash, role
- Table `pages` - contains id, title, author, creation_date, publication_date
- Table `blocks` - contains id, type, content, position, page

# Client side


## React Client Application Routes

- Route `/`: page content and purpose
- Route `/back-office`: page content and purpose
- Route `/pages/:pageId`: page content and purpose, param specification
- Route `/back-office/pages/:pageId`: page content and purpose, param specification
- Route `/back-office/edit/:pageId`: page content and purpose, param specification
- Route `/back-office/add`: page content and purpose, param specification
- Route `/login`: page content and purpose


## Main React Components

- `FrontOffice` (in `FrontOffice.js`): shows the list of published pages
- `BackOffice` (in `BackOffice.js`): shows the list of every created page, requires authentication; from here the user can: preview, edit, add and remove a page if they have authorizations
- `ViewPage` (in `ViewPage.js`): shows the full content of a page and its information
- `AddPage` (in `AddPage.js`): form to add a new page, contains EditBlocks component
- `EditPage` (in `EditPage.js`): form to edit an existing page, contains EditBlocks component
- `EditBlocks` (in `EditBlocks.js`): form to edit the list of content blocks in a page; blocks can be re-ordered, added or remove, and their content can be edited
- `LoginForm` (in `LoginForm.js`): form to perform login

# Usage info

## Example Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials
| username | password |
|:--:|:--:|
| admin | admin |
| user | password |
| user1 | password |
| user2 | password |
