const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false}
})
// to hash the password
userSchema.pre('save', function (next) {
    const user = this
    if(!user.isModified('password')) return next()
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if(err) return next()
        user.password = hash
        next()
    })
})
// to compare password
userSchema.methods.comparePassword = function (password) {
    const user = this
    bcrypt.compare(password, user.password, function (err, res) {
        if(err){
            console.log("Error with hash compare passowrd")
            return
        }
        return res
    })
}
module.exports = mongoose.model('User', userSchema)
