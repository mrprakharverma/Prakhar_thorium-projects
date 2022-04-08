//const { request } = require("express");
const urlModel = require("../model/urlModel");  //require model
const validUrl = require("valid-url")  // install package and require
const shortId = require("shortid")    //install package and require
const redis = require ('redis')      // install package and require
const {promisify} = require('util') // return promise(if error then error, if resolved then code will work properly)

const redisClient = redis.createClient(
    18906,
    "redis-18906.c299.asia-northeast1-1.gce.cloud.redislabs.com",
    { no_ready_check: true } //if we give false the redis connection will be lost
  );
  redisClient.auth("zRrIcmPzEndq6v9ZnzF3oWaWdRSkZWIs", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  })

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient); //will throw error if error else we get the value(callback fn)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false 
    if (typeof value == 'string' && value.length === 0)
     return false
    return true
}

function validateUrl(value) {
    if (!(/(ftp|http|https|FTP|HTTP|HTTPS):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(value.trim()))) {
        return false
    }
        return true
}

const baseUrl = "http://localhost:3000" 

const createUrl = async function (req, res) {
    try {
        const data = req.body
        const objectKey = Object.keys(data)  
        
            if(( objectKey != 'longUrl')){
                return res.status(400).send({ status: false, msg: "only longUrl key is allowed !" })  
            }
        
            let longUrl = data.longUrl;
        if (!isValid(data.longUrl)) {
            return res.status(400).send({ status: false, msg: "longUrl is required" })
        }
        if (!validateUrl(data.longUrl)) {
            return res.status(400).send({ status: false, msg: "longUrl is invalid" })
        }

        let urlCode = shortId.generate().toLowerCase();

        let shortUrl = baseUrl + '/' + urlCode
        
            data.urlCode = urlCode; 
            data.shortUrl = shortUrl;

            const cachedUrlData = await GET_ASYNC(`${longUrl}`)
        if (cachedUrlData) {
            let convert = await JSON.parse(cachedUrlData)
            return res.status(200).send({ status: 'true', data: convert })
        }

        const duplicateLongUrl = await urlModel.findOne({longUrl: longUrl}).select({longUrl:1, shortUrl:1, urlCode:1, _id: 0})
        if(duplicateLongUrl){
            await SET_ASYNC(`${longUrl}`,JSON.stringify(duplicateLongUrl))
            return res.status(400)
        }
 
        let data1 = await urlModel.create(data)
        let result = {
            longUrl: data1.longUrl,
            shortUrl: data1.shortUrl,
            urlCode: data1.urlCode
        }
            return res.status(201).send({ status: true,msg:"success", data: result })

        }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}
const getUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode

        let cacheData= await GET_ASYNC(`${urlCode}`)
        if(cacheData){
            // console.log("redisget")
            let convert= JSON.parse(cacheData)
            return res.status(302).redirect(convert.longUrl)
        }
        const url = await urlModel.findOne({urlCode }) 
        await SET_ASYNC(`${urlCode}`,JSON.stringify(url))      //second check in Db
        if (!url) {
            return res.status(404).send({ status: false, message: 'No URL Found' })
        }else{
            // console.log("mongo")
        return res.status(302).redirect(url.longUrl)
        }

    } catch (err) {
        console.error(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createUrl = createUrl,
module.exports.getUrl = getUrl