//const { request } = require("express");
const urlModel = require("../model/urlModel");
const validUrl = require("valid-url")
const shortId = require("shortid")
const redis = require ('redis')
const {promisify} = require('util');

const redisClient = redis.createClient(
    18906,
    "redis-18906.c299.asia-northeast1-1.gce.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("zRrIcmPzEndq6v9ZnzF3oWaWdRSkZWIs", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  })

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.length === 0)
     return false
    return true
}
const baseUrl = "http://localhost:3000"

const createUrl = async function (req, res) {
    try {
        const data = req.body
        const objectKey = Object.keys(data)
        
            if(( objectKey != 'longUrl')){
                return res.status(400).send({ status: false, msg: "only longUrl link is allowed !" })  
            }
        
            let longUrl = data.longUrl;
        if (!isValid(data.longUrl)) {
            return res.status(400).send({ status: false, msg: "longUrl is required" })
        }
        // if (!validUrl.isUri(baseUrl)) {
        //     return res.status(401).send({ status: false, msg: "baseUrl is invalid" })
        // }
        if (!validUrl.isUri(data.longUrl)) {
            return res.status(401).send({ status: false, msg: "longUrl is invalid" })
        }
        let urlCode = shortId.generate().toLowerCase();

        // if (validUrl.isUri(data.longUrl)) {
        //     if(!isValid(urlCode)){
        //         return res.status(400).send({status:false,msg:"urlCode is required"})
        //     }
        let shortUrl = baseUrl + '/' + urlCode
        
            data.urlCode = urlCode;
            data.shortUrl = shortUrl;


        let isUrlExist = await urlModel.findOne({longUrl}).select({longUrl:1, shortUrl:1, urlCode:1, _id: 0})
            if(isUrlExist){
                return res.status(200).send({status: true, data: isUrlExist, msg: 'success'})
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
        
        
        if (!isValid(urlCode)) {
            res.status(400).send({ status: false, message: 'Please provide urlCode' })
        }
        let catchData= await GET_ASYNC(`${urlCode}`)
        if(catchData){
            // console.log("redisget")
            let convert= JSON.parse(catchData)
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





// const getUrl = async function (req, res) {
//     try {
//         const urlCode = req.params.urlCode
//         //if (urlCode.length != 9)
//         // if (!isValid(urlCode)) {
//         //     res.status(400).send({ status: false, message: 'Please provide valid urlCode' })
//         // }
//         console.log(urlCode)
//         const url = await urlModel.findOne({ urlCode:urlCode})
//         console.log(url)     //second check in Db
//         if (!url) {
//             return res.status(404).send({ status: false, message: 'No URL Found' })
//         }
//         return res.status(200).redirect(url.longUrl)

//     } catch (err) {
//         console.error(err)
//         res.status(500).send({ status: false, message: err.message })
//     }
// }