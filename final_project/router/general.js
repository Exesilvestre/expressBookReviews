const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Function that asynchronously gets the list of books available
const getBookList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if there are books
      if (books) {
        resolve(books);
      } else {
        reject(new Error('Error fetching the list of books'));
      }
    }, 100);
  });
};

// Get the book list available in the shop using Promises and Callbacks
public_users.get('/', function (req, res) {
  // Call the function to get the list of books
  getBookList()
    .then((books) => {
      res.send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
      console.error('Error fetching the list of books:', error.message);
      res.status(500).send('Error fetching the list of books');
    });
});
// Function that asynchronously gets the book details based on ISBN using a promise
const getBookDetailsByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if the ISBN exists in the books database
      if (books[isbn] !== undefined) {
        resolve(books[isbn]);
      } else {
        reject(new Error('ISBN not found'));
      }
    }, 100);
  });
};

// Get book details based on ISBN using Promises and Callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Call the function to get book details by ISBN
  getBookDetailsByISBN(isbn)
    .then((bookDetails) => {
      res.send(JSON.stringify(bookDetails, null, 4));
    })
    .catch((error) => {
      console.error('Error fetching book details by ISBN:', error.message);
      res.status(404).send('Book details not found');
    });
});
  
// Function that asynchronously gets the book details based on the author
const getBookDetailsByAuthor = (authorFind) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Books keys
      const bookKeys = Object.keys(books);
      // Iterate through the 'books' array & check if the author matches the one provided
      const matchingBookKey = bookKeys.find(key => {
        return books[key].author === authorFind;
      });
      if (matchingBookKey) {
        const matchingBookDetails = books[matchingBookKey];
        resolve(matchingBookDetails);
      } else {
        reject(new Error('Author not found'));
      }
    }, 100);
  });
};

// Get book details based on author using Promises and Callbacks
public_users.get('/author/:author', function (req, res) {
  const authorFind = req.params.author;
  // Call the function to get book details by author
  getBookDetailsByAuthor(authorFind)
    .then((bookDetails) => {
      res.json(bookDetails);
    })
    .catch((error) => {
      console.error('Error fetching book details by author:', error.message);
      res.status(404).json({ message: 'Author not found' });
    });
});

// Function that asynchronously gets all books based on the title
const getBooksByTitle = (titleFind) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Books keys
      const bookKeys = Object.keys(books);

      // Iterate through the 'books' array & check if the title matches the one provided
      const foundBooksKeys = bookKeys.find(key => {
        return books[key].title === titleFind;
      });

      if (foundBooksKeys) {
        const matchingBookDetails = books[foundBooksKeys];
        resolve(matchingBookDetails);
      } else {
        reject(new Error('Title not found'));
      }
    }, 100);
  });
};

// Get all books based on title using Promises and Callbacks
public_users.get('/title/:title', function (req, res) {
  const titleFind = req.params.title;
  // Call the function to get books by title
  getBooksByTitle(titleFind)
    .then((bookDetails) => {
      res.json(bookDetails);
    })
    .catch((error) => {
      console.error('Error fetching books by title:', error.message);
      res.status(404).json({ message: 'Title not found' });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnFind = req.params.isbn;

  // Check if the provided ISBN exists
  if (books[isbnFind] !== undefined) {
    res.json(books[isbnFind].reviews);
  } else {
    res.status(404).json({ message: "ISBN not found" });
  }
});

module.exports.general = public_users;
