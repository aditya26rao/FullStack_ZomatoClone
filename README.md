# 🍽️ Zomato Clone — Fullstack Food Delivery Web App

A fullstack Zomato-inspired food delivery application built with **React.js**, **Django REST Framework**, and **MySQL**. This project simulates a real-world food ordering platform where users can browse menus, add items to cart, place orders, and manage their account.

---

## 🚀 Live Demo

🌐 Frontend: \[Deployed React App Link]
🌐 Backend API: \[Deployed Django API Link]


---

## 🛠 Tech Stack

### Frontend:

* React.js (with Hooks and Context API)
* React Router DOM
* Axios

### Backend:

* Django
* Django REST Framework (DRF)
* MySQL Database
* Django CORS Headers

### Deployment:

* Frontend: Netlify / Vercel
* Backend: Heroku / Railway / Render
* Database: AWS RDS / PlanetScale / MySQL Server

---

## ✨ Key Features

✅ Browse food categories (Pizza, Burger, Drinks, etc.)
✅ Add and remove items from cart
✅ Dynamic cart total calculation
✅ Place orders with delivery details
✅ View previous orders
✅ User authentication (Login & Signup)
✅ Admin can manage categories, food items, and orders (optional)

---

## 📂 Project Structure

```
├── backend/             # Django Project (API)
│   ├── api/             # Django app (models, serializers, views)
│   └── backend/         # Django settings, wsgi, urls
│
└── frontend/            # React.js Project
    ├── public/
    └── src/
        ├── assets/
        ├── components/
        ├── pages/
        ├── Context/     # StoreContext (Global State)
```

---

## ⚙️ Installation & Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zomato-clone.git
cd zomato-clone
```

### 2. Backend Setup (Django + DRF)

```bash
cd backend
python -m venv env
source env/bin/activate      # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

➡️ Update `ALLOWED_HOSTS` and database settings (`settings.py`) for production.

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev        # or npm run build & serve for production
```

➡️ Update API Base URL in `StoreContext.js` to point to your Django backend URL.

---

## 📅 Environment Variables

#### Django (`backend/.env`)

```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_NAME=your-db-name
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
```

#### React (`frontend/.env`)

```
REACT_APP_API_URL=https://your-backend-url/api/
```

---

## 🛒 Features to Add (Future Scope)

* Payment gateway integration (Stripe, Razorpay)
* Real-time order tracking
* Admin dashboard for managing products and orders
* Reviews & ratings

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
