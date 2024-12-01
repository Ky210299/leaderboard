# ⚠️ Advice: This project is not finished yet.

## 🏆 Leaderboard Service

This is a simple leaderboard application built with **Express**, **MongoDB**, and **Redis**.  
You can use this application to create a leaderboard for your game or any other application.

---

## 🚀 Getting Started

### 1️⃣ Create `.env`

- Create a `.env` file in the root directory using the provided `.env.template` file as a reference.
- Fill in the required values.

---

### 2️⃣ Run the Application

#### 🛠️ Run in Terminal

**For production:**

```bash
node --run start
# or
npm run start
```

**For development:**

```bash
node --run dev
# or
npm run dev
```

**🐳 Run with Docker:**

- Standard build

```bash
docker compose up --build -d
```

- With hot reload:

```bash
docker compose up --build --watch
```
