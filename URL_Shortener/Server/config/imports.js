require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const shortid = require('shortid');
const validUrl = require('valid-url');

module.exports = {
    express,
    cors,
    bodyParser,
    mongoose,
    shortid,
    validUrl,
}