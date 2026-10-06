# Portfolio frontend

This folder contains the public portfolio site and the individual post page.
It is built with HTML, CSS, and browser JavaScript; no frontend build step is
required.

## Requirements

- The Flask API in `../Backend/` must be running at
  `http://127.0.0.1:5000`.
- A PostgreSQL database must be configured for the API.
- The browser must be able to reach the API. The frontend currently uses the
  local API URL directly in its JavaScript.

## Run locally

Start the backend first; see [Backend README](../Backend/README.md). Then, from
this folder, start a static file server:

```powershell
python -m http.server 8000
```

Open [http://127.0.0.1:8000/portfolio.html](http://127.0.0.1:8000/portfolio.html).

## Pages and files

- `portfolio.html` contains the home, About, Posts, Projects, and Contact
  sections.
- `portfolio.js` loads About data, approved posts, and projects from the API,
  and submits contact messages.
- `post.html` and `post.js` display a single approved post using its `id` query
  parameter.
- `style.css` contains the shared page styles and responsive layouts.

Posts are displayed publicly only after they have been approved in the admin
panel. Project links must use `http` or `https`.

