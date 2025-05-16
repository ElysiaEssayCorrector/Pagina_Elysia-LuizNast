# ✨ FastAPI + Render Demo

Tiny proof-of-concept that shows how effortless it is to

* spin up a **FastAPI** backend (`backend/main.py`);
* serve two minimal front-ends as static files;
* deploy the whole thing (for free!) on **Render**.

> **Live demo → [https://fastapi-prod.onrender.com/](https://fastapi-prod.onrender.com/)**
> *(cold-start on the free plan may take a few seconds)*

---

## 📁 Project layout

```
backend/               # FastAPI app
└─ main.py

frontend-home/         # landing page  (served at "/")
frontend-upload/       # upload result (served at "/upload-static/")
```

---

## 🚀 One-click deploy on Render

1. Log in to **[https://dashboard.render.com](https://dashboard.render.com)**.
2. Click **New → Blueprint Deploy** – *skip the other wizards!*
3. Select **this repo**; Render auto-detects the `render.yaml`.
4. Hit **Apply** and wait \~30 s for the build to finish.

`render.yaml` already

* installs dependencies (`pip install -r requirements.txt`);
* starts Uvicorn on `0.0.0.0:$PORT`;
* pins the **Free** plan – *no credit card needed*.

---

## 🛠️ Requirements (pinned for reliability)

```
fastapi==0.111.0
uvicorn\[standard]==0.30.1
python-multipart==0.0.9
pydantic==2.7.1
annotated-types==0.6.0   # pin until 0.7.x sdist issue is fixed
```

