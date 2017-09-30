const User = require('../model/user')
const Story = require('../model/story')
const config = require('../../config')
const secretKey = config.secretKey
const jsonwebtoken = require('jsonwebtoken')

function createToken(user) {
    return jsonwebtoken.sign({
        id : user._id,
        username : user.username,
        name : user.name
    }, secretKey, {
        expiresIn : 1440
    })
}
module.exports = function (app, express) {
    const api = express.Router()
    api.post('/signup', function (req, res) {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        })
        user.save(function (err) {
            if(err){
                res.send(err)
                return
            }
            res.json({message : "User has been create"})
        })
    })

    api.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            if(err){
                return res.json(err)
            }
            return res.json(users)
        })
    })

    api.post('/login', function (req, res) {
        const query = User.findOne({username: req.body.username}).select(['username', 'password', 'name'])
        const promise = query.exec()
        promise.then(function (user) {
            console.log(user)
            if(!user){
                res.send({message:"The user is not exist"})
            }else{
                const validPass = user.comparePassword(req.body.password)
                console.log(validPass)
                if(validPass){
                    res.send({message:"The Password is not correct"})
                }else{
                    const token = createToken(user)
                    res.json({
                        success : true,
                        message : "Login Successfully",
                        token : token
                    })
                }
            }
            res.json(user)
        })
        promise.catch(function (err) {
            console.log(err)
            res.send(err)
        })
    })
    // Authentication Middleware Starts here
    // api.use : middleware for api
    // app.use : middleware for app (global)
    api.use(function (req, res, next) {
        console.log("Someone has come to the app")
        const token = req.body.token || req.param('token') || req.headers['x-access-token']
        if(token){
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
              if(err){
                  res.status(403).send({
                      success : false,
                      message : "Failed to Authenticate the user"
                  })
              } else{
                  req.decoded = decoded
                  next()
              }
            })
        }else{
            res.status(403).send({
                success : false,
                message : "No Token Provided"
            })
        }
    })

    api.get('/', function (req, res) {
        res.json("Welcome Home")
    })
    api.route('/story')
        .post(function (req, res) {
            const story = new Story({
                creator : req.decoded.id,
                content : req.body.content
            })
            story.save(function (err) {
                if(err){
                    res.send(err)
                    return
                }
                res.json({message : "New Story Has Been Created"})
            })
        })
        .get(function (req, res) {
            Story.find({creator: req.decoded.id}).exec()
                .then(stories=>{
                    res.json(stories)
                })
                .catch(err=>{
                    res.send(err)
                })
        })
    // api for front end, to use the decoded data
    api.get('/me', function (req, res) {
        res.json(req.decoded)
    })
    return api
}