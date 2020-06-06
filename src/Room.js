const validators = require('./validators');

/**
 * @typedef {import('./Client')} Client
 */

/**
 * @typedef {string} RoomID A unique ID for a Room.
 */

class Room {
  /**
   * @param {RoomID} id
   */
  constructor(id) {
    /**
     * Unique ID given to this room.
     * @type {RoomID}
     * @readonly
     */
    this.id = id;
    /**
     * The variables that are within this room.
     * @type {Map<string, string>}
     * @private
     * @readonly
     */
    this.variables = new Map();
    /**
     * Clients connected to this room.
     * @type {Client[]}
     * @private
     */
    this.clients = [];
    /**
     * The time of the last client disconnect.
     * @type {number}
     */
    this.lastDisconnectTime = -1;
    /**
     * Maximum number of variables that can be within this room.
     * @type {number}
     */
    this.maxVariables = 10;
  }

  /**
   * Add a new client.
   * @param {Client} client The client to add
   * @throws Will throw if client is already added.
   */
  addClient(client) {
    if (this.clients.includes(client)) {
      throw new Error('Client is already added to this Room.');
    }
    this.clients.push(client);
  }

  /**
   * Remove a client.
   * @param {Client} client The client to remove
   * @throws Will throw if the client does not belong to this room.
   */
  removeClient(client) {
    const index = this.clients.indexOf(client);
    if (index === -1) {
      throw new Error('Client does not belong to this Room');
    }
    this.clients.splice(index, 1);
    this.lastDisconnectTime = Date.now();
  }

  /**
   * Get all connected clients.
   * @returns {Client[]} All connected clients.
   */
  getClients() {
    return this.clients;
  }

  /**
   * Get a map of all variables.
   * @returns {Map<string, string>} All variables, and their value.
   */
  getAllVariables() {
    return this.variables;
  }

  /**
   * Create a new variable.
   * This method does not inform clients of the change.
   * @param {string} name The name of the variable
   * @param {string} value The value of the variable
   * @throws Will throw if name or value are invalid, the variable already exists, or there are too many variables.
   */
  create(name, value) {
    if (!validators.isValidVariableName(name)) {
      throw new Error('Invalid variable name');
    }
    if (!validators.isValidVariableValue(value)) {
      throw new Error('Invalid value');
    }
    if (this.has(name)) {
      throw new Error('Variable already exists');
    }
    if (this.variables.size >= this.maxVariables) {
      throw new Error('Too many variables');
    }
    this.variables.set(name, value);
  }

  /**
   * Set an existing variable to a new value.
   * This method does not inform clients of the change.
   * @param {string} name The name of the variable
   * @param {string} value The value of the variable
   * @throws Will throw if name or value are invalid, or the variable does not exist.
   */
  set(name, value) {
    if (!validators.isValidVariableName(name)) {
      throw new Error('Invalid variable name');
    }
    if (!validators.isValidVariableValue(value)) {
      throw new Error('Invalid value');
    }
    if (!this.has(name)) {
      throw new Error('Variable does not exist');
    }
    this.variables.set(name, value);
  }

  /**
   * Determine whether this room has a variable of a given name.
   * @param {string} name The name of the variable
   */
  has(name) {
    return this.variables.has(name);
  }

  /**
   * Determine whether a username is already in use by a client connected to this room.
   * @param {string} username The username to search for
   * @returns {boolean}
   */
  hasClientWithUsername(username) {
    // usernames are compared case insensitively
    username = username.toLowerCase();
    return this.getClients().some((i) => i.username.toLowerCase() === username);
  }

  /**
   * Determine whether a list of variable names matches the names of the variables in this room.
   * Case sensitive, order doesn't matter.
   * @param {string[]} variables The list of variable names. Must not contain duplicates.
   * @returns {boolean}
   */
  matchesVariableList(variables) {
    if (variables.length !== this.variables.size) {
      return false;
    }
    for (const variableName of this.getAllVariables().keys()) {
      if (variables.indexOf(variableName) === -1) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Room;
