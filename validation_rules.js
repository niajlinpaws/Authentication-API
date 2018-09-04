var vrules={
	forgotPassword:
	{
		email:'required|email'
	},
	login:
	{
		email:'required|email',
		password:'required'
	},
	resetPassword:
	{
		password:'required'
	},
	signup:
	{
		
		name:'required',
		email:'required|email',
		password:'required'	
	}
};
module.exports = vrules;