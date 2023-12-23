import axios from 'axios';

// const SERVER = `http://${process.env.SERVER_HOST ?? 'localhost'}:${process.env.SERVER_PORT ?? '5000'}`;
const SERVER = 'http://localhost:5000/'

/**
 * API interactions with the server (db.js)
 */
export const ACTIONS = {
  /**
   * Updates the local var todoList with the current TodoList state on the database
   * @async
   * @returns {Promise<Array>} an Array of the Todo Items from the fetched from the Todo List on the Database
   */
  async getTodos() {
    let todoList;
    await axios.get(`${SERVER}/todos`)
    .then((res) => {
      todoList = res.data;
    })
    .catch((e) => {
      console.error('Something went wrong with fetching your Todo List');
      console.error(e);
      return [];
    })
    return todoList;
  },

  /**
   * Adds an Item to the Todo List on the Database
   * @param {String} content Content of the Todo Item
   */
  async addTodo(content) {
    let order = (await this.getTodos()).reduce((highest, { order: current }) => highest = highest > current ? highest : current, 0); // get the highest order value
    await axios.post(`${SERVER}/todos`, {
      content: content,
      order: order + 1
    })
    .then((res) => {
      console.log("Added a Todo Successfully");
    })
    .catch((e) => {
      console.error(`Couldn't Add Todo Item: `);
      console.error(e);
    })
  },

  /**
   * Updates the Content and/or the toggle status of a selected todo item
   * @param {Object} item index of the selected Todo item in a Todo List Array
   * @param {String} content content to reassign the Todo item with
   * @param {Boolean} isChecked toggle status of the todo item
   */
  async updateTodo(item, content, isChecked) {
    await axios.put(`${SERVER}/todos`, {
      id: item.id,
      content: content,
      isChecked: isChecked
    })
    .then((res) => {
      console.log("Updated the Todo Successfully");
    })
    .catch((e) => {
      console.error(`Couldn't Update Todo Item: `);
      console.error(e);
    })
  },

  /**
   * Deletes an item from the todo list on the database
   * @param {Object} item object of the Todo Item Object to delete from the database
   */
  async deleteTodo(item) {
    await axios.delete(`${SERVER}/todos`, {
      params: {
        id: item.id
      }
    })
    .then((res) => {
      console.log("Deleted the Todo Successfully");
    })
    .catch((e) => {
      console.error(`Couldn't Delete Todo Item: `);
      console.error(e);
    })
  }
}
