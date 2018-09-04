let {EmailTemplate} = require('email-templates');
const crypto = require('crypto');
const path = require('path');
const User = require("./models/User");

const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    from: process.env.SMTP_FROM,
    host: process.env.SMTP_HOST, // hostname
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
    }
});



module.exports = {
    crypto: function(text, type) {
        var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
        var key = 'password';

        if (type.toString() === 'encrypt') {
            var cipher = crypto.createCipher(algorithm, key);
            var encrypted = cipher.update(text.toString(), 'utf8', 'hex') + cipher.final('hex');
            return encrypted.toString();
        } else {
            var decipher = crypto.createDecipher(algorithm, key);
            var decrypted = decipher.update(text.toString(), 'hex', 'utf8') + decipher.final('utf8');
            return decrypted.toString();
        }
    },
    randomNumber:function(len,charSet){
        charSet=charSet||"0123456789";
        var d= new  Date();
        var timestamp=d.getTime(), i=0,rnum,string="";

        while(i<len)
        {
         rnum=Math.floor(Math.random()*charSet.length);
         string+=charSet.substring(rnum,rnum+1);
         i++;
        }

        var verifLink=string+timestamp;
        var base64=new Buffer(verifLink).toString('base64');

        return base64;
    },
    sendMail:function(to,template,arg,cb){
        let emailTemplate = new EmailTemplate(path.join(__dirname, 'templates',template));

        if(!emailTemplate) return cb("template not found");

        emailTemplate.render(arg,(err,results)=>{
            if(err)return cb(err, null);

            transport.sendMail({
                from:process.env.FROM_MAIL,
                to,
                subject:results.subject,
                html:results.html
            }, 
                function(err, responseStatus) {
                return cb(err, responseStatus);
            });
        }); 
    },
    validateApi: function(rulesObj) {
        return function(req, res, next) {
            // Validating Input 
            var validation = new Validator(req.body, rulesObj);

            if (validation.fails()) {
                var errObj = validation.errors.all();
                res.status(203).json({
                    data:{},
                    message: errObj[Object.keys(errObj)[0]][0]
                });
            } else return next();
        }
    }
};