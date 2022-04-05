const express = require('express');
const router = express.Router();
//const removeUploadedFiles = require('multer/lib/remove-uploaded-files');
const userController=require("../controller/userController")
const bookController = require("../controller/bookcontroller");
const reviewController = require('../controller/reviewController');
//const userModel = require("../model/userModel");
const middleware = require("../middleware/authentication");
// const cover = require('../cloudLink/s3link');

const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: "AKIAY3L35MCRVFM24Q7U",  // id
  secretAccessKey: "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",  // secret password
  region: "ap-south-1" 
});



let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) { 
    
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    var uploadParams = {
      ACL: "public-read", 
      Bucket: "classroom-training-bucket", 
      Key: "suraj/" + file.originalname,    
      Body: file.buffer, 
    };

    s3.upload(uploadParams , function (err, data) {
      if (err) {
        return reject( { "error": err });
      }
    //   console.log(data)
    //   console.log("File uploaded successfully.");
      return resolve(data.Location);  
    });
  });
};

router.post("/write-file-aws", async function (req, res) {
  try {
    let files = req.files;
    if (files && files.length > 0) {
      let uploadedFileURL = await uploadFile( files[0] );  
      res.status(201).send({ status: true,msg: "file uploaded succesfully", data: uploadedFileURL });

    } 
    else {
      res.status(400).send({ status: false, msg: "No file to write" });
    }

  } 
  catch (err) {
    console.log("error is: ", err);
    res.status(500).send({ status: false, msg: "Error in uploading file" });
  }

});




router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
//router.post('/cover',cover.createAws)

router.post("/books",middleware.authentication,bookController.createBook)
router.get("/books",middleware.authentication,bookController.getBooks)
router.get('/books/:bookId',middleware.authentication,bookController.getBookReview)
router.put('/books/:bookId',middleware.authentication,middleware.authorize,bookController.updateBook)
router.delete('/books/:bookId',middleware.authentication,middleware.authorize,bookController.deleteBook)
router.post('/books/:bookId/review',reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)


module.exports = router;