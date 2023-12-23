// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chalk = require('chalk');
const qs = require('qs');
var jwt = require('jsonwebtoken');
const { Sequelize, QueryTypes, DataTypes, Model } = new require("sequelize");
require("dotenv").config();

/**
 * Express.js app
 */
const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());
app.set('query parser', function (str) {
  return qs.parse(str)
})

/**
 * Sequelize database connection
 */
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ?? '5000',
  dialect: "postgres",
});

/**
 * Lists the contents of the Todo List
 */
app.get('/todos', async (req, res) => {
  try {
    const results = await sequelize.query(`SELECT * FROM "TodoList" ORDER BY "order" ASC`, { type: QueryTypes.SELECT });
    res.json(results);
  } catch (e) {
    console.log('Error retrieving todos: ', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
 * Adds a new item in the Todo List
 */
app.post('/todos', async (req, res) => {
  const { content, order } = req.body;
  try {
    const results = await sequelize.query(
      `INSERT INTO "TodoList" ("content", "order") ` +
      `VALUES ($content, $order);`
    , {
      bind: { content: content, order: order },
      type: QueryTypes.INSERT
    });
    res.json(results);
  } catch (e) {
    console.log('Error Adding to todos: ', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
 * Updates the content of a new item in the Todo List
 */
app.put('/todos', async (req, res) => {
  const { id, content, isChecked } = req.body;
  try {
    const results = await sequelize.query(
      `UPDATE "TodoList" ` +
      `SET "content" = $content, "is_checked" = $isChecked ` +
      `WHERE "id" = $id`
    , {
      bind: { id: id, content: content, isChecked: isChecked },
      type: QueryTypes.UPDATE
    });
    res.json(results);
  } catch (e) {
    console.log('Error Updating todos: ', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.delete('/todos', async (req, res) => {
  const { id } = req.query;
  try {
    const results = await sequelize.query(
      `DELETE FROM "TodoList" ` +
      `WHERE "id" = $id `
    , {
      bind: { id: id },
      type: QueryTypes.DELETE
    });
    res.json(results);
  } catch (e) {
    console.log('Error Deleting todos: ', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
 * Set up server to listen on port 5000
 */
const PORT = process.env.SERVER_PORT || 5000;
const HOST = process.env.SERVER_HOST || 'localhost';
app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}/`);
});