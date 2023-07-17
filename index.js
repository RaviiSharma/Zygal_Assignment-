

const express = require("express");
const jwt = require("jsonwebtoken");

const bodyParser = require('body-parser')



const cookieParser = require('cookie-parser'); // Import cookie-parser

// Initialize the Express app
const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser());




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))




app.listen(5000, () => {console.log(" Server started at post 5000")});



const userModel = require("./models/userModel");
const textModel = require("./models/textModel");


  const mongoose = require('mongoose')

  mongoose.connect("mongodb+srv://RaviKumarSharma:i6tpVmiNCvIQSjH6@cluster0.pnzdn4a.mongodb.net/db-01",{
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))




const {validInputValue,validOnlyCharacters,validEmail} = require('./validations');






app.post('/Login_Page', async (req, res) => {
  try {
    const data = req.body;

    console.log("data ", data);

    if (!data.email_id || !validEmail(data.email_id)) {
      throw new Error('Invalid Email');
    }

    if (!data.password || !validNumber(data.password)) {
      throw new Error('Invalid Password: Only numbers are allowed');
    }

    let z = await userModel.create(data);

    let token = jwt.sign(
      {
        user_id: data.email_id,
        user_phone: data.password,
      },
      "project01" 
    );

    res.status(201).json({ status: true, message: "Logged in successfully", data: token });
  } catch (error) {
    return res.status(500).json({ code: "500", status: "error", message: "Something went wrong: " + error.message });
  }
});

const authentication = function (req, res, next) {
  try {
    let token = req.cookies['auth_token']; 

    if (!token) {
      return res.status(401).send({ status: false, message: "Necessary authentication token is missing" });
    }

    jwt.verify(token, "project01", (err, Decoded) => {
      if (err) {
        return res.status(403).send({ status: false, message: "Failed authentication" });
      }

      req.user = Decoded;
      next(); 
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

app.post('/Home_Page/submitText/:user_id', authentication, async (req, res) => {
  try {
    const data = req.body;

    console.log("data ", data);

    if (!data.text.trim() || !validInputValue(data.text.trim()) || !validOnlyCharacters(data.text.trim())) {
      throw new Error('Invalid text');
    }


    const userId = req.params.user_id;

    res.cookie('user_data', data, { signed: true });

    let z = await textModel.create(data);

    res.status(201).send({ status: true, message: "Submit text message", data: data });
  } catch (error) {
    return res.status(500).json({ code: "500", status: "error", message: "Something went wrong: " + error.message });
  }
});




app.get('/Home_Page/searchTextMessage', authentication, async (req, res) => {
  try {
    const searchText = req.query.searchText;
    console.log("searchText", searchText);

    if (!searchText || typeof searchText !== 'string') {
      return res.status(400).json({ status: false, message: "Invalid search query" });
    }

    const storedData = req.signedCookies.user_data;

    if (!storedData || typeof storedData !== 'object') {
      return res.status(404).json({ status: false, message: "No data found in the stored cookie" });
    }

    const searchRegex = new RegExp(searchText, 'i');
    const matchedTexts = storedData.filter(item => searchRegex.test(item.text));

    res.status(200).json({ status: true, message: "Matched texts retrieved successfully", data: matchedTexts });
  } catch (error) {
    return res.status(500).json({ code: "500", status: "error", message: "Something went wrong: " + error.message });
  }
});

app.get('/clearCookies', (req, res) => {
  try {
    Object.keys(req.signedCookies).forEach(cookieName => {
      res.clearCookie(cookieName);
    });

    res.status(200).json({ status: true, message: "Cookies cleared successfully" });
  } catch (error) {
    return res.status(500).json({ code: "500", status: "error", message: "Something went wrong: " + error.message });
  }
});
