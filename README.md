# Movie and TV Show Database API

Project Video : https://youtu.be/KrzfjzklWDo

React Frontend : https://github.com/Harinder05/movie_api_frontend.git

This is a RESTful API for managing movies and TV shows, built with Node.js, Koa, MongoDB, and JavaScript.

## Prerequisites

To run this project, you need to have the following installed on your system:

- Node
- MongoDB
- npm

## Installation

1. Clone the repository: https://github.com/Harinder05/Movie_Database_API.git
2. Change to the project directory: cd Movie_Database_API
3. Install the dependencies: npm install

## Configuration

1. Rename `config.template.js` to `config.js`.
2. Update the `config.js` file with your configuration settings:

```javascript
exports.config = {
  port: 3000, // The port the server will run on
  jwt_secret: "", // JWT secret for authentication
  db: "", // MongoDB connection string.
  apikey: "", // API key for accessing external services  
};
```
3. To use Third Party Integration, apikey is needed. To obtain an API key, visit the following website and register for an account: https://imdb-api.com/

## Running the API

To start the API server, run: node index.js

