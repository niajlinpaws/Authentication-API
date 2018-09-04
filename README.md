# Authentication-API

This project enables the application to utilize register, login, forgot and reset password APIs.

Project Setup

1. npm install
2. create a .env file and add the following parameters:

	environment = development

	PORT=7777

	# Database

	MONGO_URI = <MONGODB CONNECTION STRING> For example:mongodb://localhost:27017/demoAuth

	# SMTP
	FROM_MAIL = no-reply@demo.com
	SMTP_HOST = smtp.gmail.com
	SMTP_SERVICE = gmail
	SMTP_AUTH_USER = <AUTH_USERNAME>
	SMTP_AUTH_PASS = <AUTH_PASSWORD>

3. start mongod instance.

4. npm start
