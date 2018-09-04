var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require("../models/User");

router.post('/register',FX.validateApi(vrules.signup),(req,res,next)=>{
	let {email}=req.body;
	User.count({email},(err,user)=>{
		if(err) return next(err);

		if(user)
		return res.status(203).json({
			data:{},
			message:"Email Already Registered"
		});

		User.create(req.body,(err,newUser)=>{
			if(err) return next(err);

			return res.status(200).json({
				data:newUser,
				message:"Activity Successfull"
			});
		});
	});
});

router.post('/login',FX.validateApi(vrules.login),(req, res, next)=>{
	let {email,password} = req.body;

	User.findOne({email})
	.then((user)=>{

		if(!user)
    	return res.status(203).json({
    		data:{},
    		message:"Email Not Found"
    	});

		user.comparePassword(password, function(err, isMatch) {
			if(err) return next(err);

			if(!isMatch) 
			return res.status(203).json({
				data:{},
				message:"Password Incorrect"
			});

			user.postAuth((err,user)=>{
				if(err)return next(err);

				return res.status(200).json({
					data:user,
					message:"Activity Successfull"
				});	
			});
		});
	})
	.catch((err)=> {
		return next(err);
	});
});

router.post('/forgot_password',FX.validateApi(vrules.forgotPassword),function(req,res,next){
	let {email} = req.body;
	let securityToken = FX.crypto((Date.now() +'_'+ FX.randomNumber(10,'')),'encrypt').toString();
	
	User.findOneAndUpdate({email},{$set:{securityToken}},function(err,result){
		if(err)return next(err);

		if(result)
		{
			FX.sendMail(email,'forgot_password',{securityToken},(err,responseStatus)=>{
				if(err)return next(err);

		  		if(responseStatus)console.log(responseStatus);
			});
			
			return res.status(200).json({
				data:{},
				message:"Reset password link sent to your email"
			});
		}
		else
    	return res.status(203).json({
			data:{},
			message:"Email Not Found"
		});	
	});
});

router.post('/reset_password/:securityToken',FX.validateApi(vrules.resetPassword),function(req,res,next){
	let {password} = req.body;
	let {securityToken} = req.params;

	bcrypt.hash(password,10,(err,hash)=>{
		if(err)return next(err);
		
		password=hash;

		User.findOneAndUpdate({securityToken},{$set:{password},$unset:{securityToken:''}},function(err,result){
			if(err) return next(err);

			FX.sendMail(result.email,'reset_password',{user:result.name},(err,responseStatus)=>{
				if(err)return next(err);

		  		if(responseStatus)console.log(responseStatus);
			});

			return res.status(200).json({
				data:{},
				message:"New password created successfully"
			});				
		});
	});
});


module.exports = router;
