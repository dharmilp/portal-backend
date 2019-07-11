# spc-portal-backend

A portal for conducting aptitude test and IT tests.

open terminal where you want project to be placed:

(make sure git is installed)

git clone https://github.com/rutvikmavani/spc-portal-backend.git

change directory

cd spc-portal-backend

npm install (this will install all dependencies)

make .env file in current directory which will look like this

DB_LINK=type_your_mongodb_database_URI 
(e.g. mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/admin or mongodb://sysop:moon@localhost/records)
SESSION_SECRET=type_something_secret
EMAIL_SERVICE=type_name_of_email_service (e.g. Gmail, Sendgrid)
EMAIL_USERNAME=user_name_of_specified_email_service
EMAIL_PASS=password_of_specified_username
BASE_URL=http://localhost:5000


node app.js

this will start app. Go to browser type http://localhost:5000/ it will show login/register page.