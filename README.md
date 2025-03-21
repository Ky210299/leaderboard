# ⚠️ Advice: This project is not finished yet.

## API Documentation

http://localhost:3000/doc

- _3000 is the default PORT. Can be modified in the environment_

## **Important**

For now, you have to create an user in the mongoDB container

### Steps:

0. Go inside the container:

```bash
docker exec -it <container_id> bash
# and then
mongosh
```

1. Create The user:

```js
use admin;
db.createUser({
    user: "Your User",
    pwd: "Your Password or the 'passwordPrompt()' function",
    roles: [{ role: "dbAdmin", db: "Your Database Name" }]
});
// Expected output: { "ok" : 1 }
```

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
npx tsc && docker compose up --build -d
```

- With hot reload:

```bash
npx tsc && docker compose up --build --watch
```
