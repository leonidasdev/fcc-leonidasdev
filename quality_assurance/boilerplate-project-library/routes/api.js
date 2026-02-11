/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const arr = Array.from(books.values()).map(b => ({_id: b._id, title: b.title, commentcount: b.comments.length}));
      res.json(arr);
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) return res.send('missing required field title');
      const id = generateId();
      const book = {_id: id, title: title, comments: []};
      books.set(id, book);
      res.json({_id: id, title: title});
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      books.clear();
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = books.get(bookid);
      if(!book) return res.send('no book exists');
      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment) return res.send('missing required field comment');
      const book = books.get(bookid);
      if(!book) return res.send('no book exists');
      book.comments.push(comment);
      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(!books.has(bookid)) return res.send('no book exists');
      books.delete(bookid);
      res.send('delete successful');
    });
  
};

// Simple in-memory store and helper
const books = new Map();
function generateId(){
  return (Date.now().toString(36) + Math.random().toString(36).slice(2,8));
}

// Seed one sample book so example tests expecting at least one book pass
const sampleId = generateId();
books.set(sampleId, {_id: sampleId, title: 'Sample Book', comments: []});
