const express = require("express");

const app = express();
app.use(express.json());

// In-memory state (acts like a fake database)
let users = [
    {
        id: 1,
        name: "Buon Pheaktra",
        email: "buonpheaktra.developer@gmail.com"
    }
];

let randomId = users.length + 1

/**
 * Insert User
 * POST /users
 */
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newUser = {
    id: randomId,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User inserted successfully",
    data: newUser,
  });
});

/**
 * Create User (same as insert but separated if you want different logic)
 * POST /users/create
 */
app.post("/users/create", (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: randomId,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    data: newUser,
  });
});

/**
 * Update User
 * PUT /users/:id
 */
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  res.json({
    message: "User updated successfully",
    data: user,
  });
});

/**
 * Delete User
 * DELETE /users/:id
 */
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = users.splice(index, 1);

  res.json({
    message: "User deleted successfully",
    data: deletedUser[0],
  });
});

/**
 * Get All Users (optional but useful)
 * GET /users
 */
app.get("/users", (req, res) => {
  res.json(users);
});

const PORT = 3500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
