require('dotenv').config()

var express = require('express');
var router = express();
var mysql2 = require('mysql2');
var cors = require('cors');

router.use(cors());
router.use(express.json());

const db = mysql2.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
});

/* Content */
router.post('/content/create', function(req, res, next){

  const author = req.body.content.Author;
  const title = req.body.content.Title;
  const description = req.body.content.Description;
  const url = req.body.content.Url;
  const vertical = req.body.content.Vertical;
  const tags = JSON.stringify(req.body.content.Tags);
  const specialTag = JSON.stringify(req.body.content.SpecialTag);
  const content_type = req.body.content.ContentType;
  
  console.log("req ", req.body);
  db.query(
    "INSERT INTO content (Author, Title, Description, Url, Tags, SpecialTag, Vertical, ContentTypeId) VALUES (?, ?, ?, ?, ?, ?, ?, (Select id from content_type where name = ?))",
    [author, title, description, url, tags, specialTag, vertical, content_type],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );

});

router.get('/content/types', function(req, res, next){
    db.query(
      "SELECT name from content_type",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          var type = [];
          for (t of result) {
            type.push(t["name"])
          }
          res.json(type);
        }
      }
    );
});

router.get('/content/Solana/:type', function(req, res, next){
  db.query(
    "SELECT * from content where ContentTypeId in ((select id from content_type where name in (?)))",
    req.params.type,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {       
        res.json(result);
      }
    }
  );
});

router.get('/content/Solana/:type/:videoID', function(req, res, next){
  db.query(
    "SELECT * from content where Vertical='tutorials' AND ID=?",
    req.params.videoID,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {       
        res.json(result);
      }
    }
  );
});

/* Playlist */
router.get('/playlists/Solana', function(req, res, next){
  db.query(
    "SELECT * from content where ContentTypeId = (select id from content_type where name='playlist')",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("result ", result);
        var id = [];
        for (t of result) {
          id.push(t["ID"])
        }
        console.log("type id", id);
        res.json(result);
      }
    }
  );
});


router.get('/content/:Vertical/:ID', function(req, res, next){
  console.log("req.params.vertical ", JSON.stringify(req.params.Vertical));
  console.log("req.params", req.query);
  db.query(
    "SELECT * from content where Vertical='tutorials' AND ID=?",
    [req.params.ID],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("content solana ", result);
        res.json(result);
      }
    }
  );
});

/* Vdieo */
router.get('/playlists/Solana', function(req, res, next){
  db.query(
    "SELECT * from content where ContentTypeId = (select id from content_type where name='playlist')",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("result ", result);
        var id = [];
        for (t of result) {
          id.push(t["ID"])
        }
        console.log("type id", id);
        res.json(result);
      }
    }
  );
});
router.get('/content/check', function(req, res, next){});
router.get('/content/specialtag/New', function(req, res, next){});
router.get('/content/specialtag/Hot', function(req, res, next){});
router.get('/content/tweets/pinned', function(req, res, next){});
router.get('/content/Solana/newsletters', function(req, res, next){});

router.listen(9000, () => {
  console.log("Running on port 9000");
});
