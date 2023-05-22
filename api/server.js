// IMPORTS AT THE TOP
const express = require("express");
const Dog = require("./dog-model");
// INSTANCE OF EXPRESS APP
const server = express();
// GLOBAL MIDDLEWARE
server.use(express.json());
// ENDPOINTS

// [GET]    /             (Hello World endpoint)
server.get("/hello-world", (req, res) => {
  res.status(200).json({ message: "hello world" });
});
// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get("/api/dogs", async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.status(200).json(dogs);
  } catch (err) {
    res.status(500).json({ message: `something horrible ${err.message}` });
  }
});
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get("/api/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dog = await Dog.findById(id);
    if (!dog) {
      res.status(404).json({ message: `no dog by id:${id}` });
    } else {
      res.status(200).json(dog);
    }
  } catch (err) {
    res.status(500).json({
      message: `error fetching dogs with ${req.params.id}: ${err.message}`,
    });
  }
});
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post("/api/dogs", async (req, res) => {
  try {
    const { name, weight } = req.body;
    const createdDog = await Dog.create({ name, weight });
    if (!name || !weight) {
      res.status(422).json({ message: "no name or weight" });
    } else {
      res.status(201).json({ data: createdDog });
    }
  } catch (err) {
    res.status(500).json({ message: `${err.message}` });
  }
});
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put("/api/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight } = req.body;

    if (!name || !weight) {
      res.status(422).json({ message: "no name or weight" });
    } else {
      const updatedDog = await Dog.update(id, { name, weight });
      if (!updatedDog) {
        res.status(400).json({
          message: "no dog to update",
        });
      } else {
        res
          .status(200)
          .json({ message: "dog has been updated", dog: updatedDog });
      }
    }
  } catch (err) {
    res.status(500).json({ message: `error updating dog , ${err.message}` });
  }
});
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete("/api/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const stuff = await Dog.delete(id);
    if (!stuff) {
      res.status(401).json({
        message: `this is not an item : ${stuff}`,
      });
    } else {
      res.status(200).json({
        message: "i was deleted",
        data: stuff,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `message: ${err.message}`,
    });
  }
});

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;
