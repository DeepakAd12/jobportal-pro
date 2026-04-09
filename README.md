🚀 Job Portal (Django + React)

A full-stack Job Portal web application where users can browse jobs, apply with resumes, and save/bookmark jobs.

---

🌐 Live Demo

Frontend- https://jobportal-pro.vercel.app/

Backend-  https://jobportal-backend-i26p.onrender.com/swagger/

✨ Features

- 🔐 User Authentication (Login/Register)
- 📄 Apply to jobs with resume upload
- ❤️ Save / Bookmark jobs
- 📊 Dashboard for applied & saved jobs
- 🔍 Browse and filter jobs
- ⚡ Fast and responsive UI

---

🛠 Tech Stack

Frontend

- React.js
- Axios
- CSS

Backend

- Django
- Django REST Framework (DRF)

Database

- PostgreSQL (Development)

---

📂 Project Structure

job_portal/

│

├── backend/

│   ├── applications/

│   ├── jobs/

│   ├── accounts/
│

├── frontend/

│   ├── components/

│   ├── pages/

│

└── media/ (ignored)

---

⚙️ Setup Instructions

1️⃣ Clone the repo

git clone https://github.com/DeepakAd12/jobportal-pro.git
cd your-repo

---

2️⃣ Backend Setup

cd backend

python -m venv venv

venv\Scripts\activate   (Windows)

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver

---

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

---

🔒 Environment Variables

Create a ".env" file in backend:

SECRET_KEY=your_secret_key
DEBUG=True

---
---

📌 Notes

- Uploaded resumes are stored locally ("media/") and are ignored in Git.
- For production, cloud storage (AWS S3, Cloudinary) is recommended.

---

🙌 Author

Deepak Adhikari
GitHub: https://github.com/DeepakAd12

---

⭐ If you like this project

Give it a star ⭐ on GitHub
