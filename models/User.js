var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:String,
    ssid:String,
    securityToken:String
},{
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    id: false,
    toJSON: {
        getters: true,
        virtuals: true
    },
    toObject: {
        getters: true,
        virtuals: true
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    //console.log("pre save hook called", user);
    user.ssid=FX.crypto(user._id+FX.randomNumber(5,''), 'encrypt');
        // only hash the password if it has been modified (or is new)
    if(!user.isNew) return next()
    // generate a salt
    if(!user.password)
    return next();

    bcrypt.hash(user.password, 10, (err, hash)=>{
        if(err) return next(err);
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

//  add a instance to model
userSchema.methods.encryptPassword = function(cb) {
    var _this = this
    bcrypt.hash(_this.password, 10, (err, hash)=>{
         cb(err, hash);
    });
}

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        return  cb(err, isMatch);
    });
}

userSchema.methods.postAuth = function(cb) {
    console.log("postAuth called");
    let _this = this;
    let User= this.model('User');
    let ssid= FX.crypto(_this._id+FX.randomNumber(5,''), 'encrypt');

    User.findByIdAndUpdate(_this._id,{$set:{ssid}},{new:true},(err, user)=>{
        cb(err, user)
    }); 
}

module.exports = mongoose.model('User', userSchema)
