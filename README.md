# Node.js - Account Keeping #
A little practice for me to build a Node.js project.

----------

## Feature
- Users are allowed to create user account and log in.
  
- Once logged in, users can record a new account and all of them will show in the same page.  

- Each account can be modify and delete.
  
- Every change connects to the database, which means the administrators are able to obtain all the imformation except password. 

- It can be set in localhost or through Heroku. However, there are some limit for Heroku free user, so this web page is not available now.

----------

## Installation
1. Node.js
2. Mongodb Compass
3. Related 3rd Party module as following

----------

## Start service
1. Run command `$ cd <target folder>`

2. Run command `nodemon app.js`  
	
3. Visit `localhost:3030` through all kinds of browsers

----------

## MongoDB setting
Convenient tool helps to connect to Mongodb. 

Check **app.js** for login setting.

`mongodb+srv://<username>:<password>@cluster0-qnhak.mongodb.net/test` 
	
`'mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qnhak.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}';`
	
Alternatively, Create a file **nodemon.json** with content `{"env":{"MONGO_USER":"<username>", "MONGO_PASSWORD":"<password>"}}`

----------

## MVC 
- **model**  
	Define the schema of **users** and **accounts**.
	
	Although NoSQL doesn't need any schema, it is still more convenient for develops to manage data.  
 
- **view**  
	Present the visual effects to users
	.  
	By using ejs, developers can render the web page by sending specific varible.
	
	For example, controllers return `res.render('admin/edit-account', { pageTitle: 'Add Account', ... });`.
	
	Views receive the variable `<title><%= pageTitle %></title>`.
	
	View-source would be `<title>Add Account</title>`.

- **controller**  
	Different functions to manage data and render to views.
	
	All requests go to controllers and will be handled there.

----------

## 3rd Party Packages
Some of them aren't in this project, just list for recording.

### 1. express
A powerful Node.js framework, helps middleware, request(req), response(res), routing and data management. 

As server gets a req, it handles with middleware and return a res. 

Such as, `(req, res, next) => { ... }`. 

There are still various extension for express, and some alternatives to express. 

### 2. mongoose
A Mongodb ORM, helps to simplify code to interact with Mongodb.

Such as `Account.save().then({ ... }).catch({ ... });`, and `Account.findById(accouId).then({ ... }).catch({ ... });`.

### 3. bcrypt js
To avoid developers from knowing every users' password directly.

`bcrypt.hash( password, 12 ).then( hashedPassword => { const user = new User({ name: name , password: hashedPassword }); return user.save(); })`

### 4. csurf
To avoid server from csrf attack. Every request creates a token. 

With correct token, the web page shows correctly.

`app.use((req, res, next) => { res.locals.isAuthenticated = req.session.isLoggedIn; res.locals.csrfToken = req.csrfToken(); next(); });`

`<input type="hidden" name="_csrf" value="<%= csrfToken %>">`	

### 5. express-session
Developers can save everything in sessions. 

In this project, sessions are stored by user data(authentication status). 

Server can always check if it's allowed to view this web page.

### 6. nodemailer
It provides server to send emails automatically. 

If users forget their password, server can send them a new password.

### 7. validator
Once user submits any information, server wants to check if they are valid or not. 

Validator provides some commands to restrict the data whic was sent by users.

For example, `body('title').isString().isAlphanumeric().trim()`  
	
### 8. multer
User can upload images which will save in the specific folder, and can also be deleted.

### 9. pdfkit
Provides users to download information as pdf. 

Developers can design the context and the format.

### 10. stripe
It provides users to pay in a secret way with credit card.

### 11. helmet
It's also a protection for express.

### 12. compression
It decearses the size of the files while tranfering througth internet and accelerates the rate of loading web page.

### 13. SSL
Run command `openssl req -nodes -new -x509 -keyout server.key -out server.cert` 

There will be two new files, `server.cert` and `server.key`.

At **app.js**, 

`const privateKey = fs.readFileSync('server.key');`

`const certificate = fs.readFileSync('server.cert');`

`https.createServer({key: privateKey, cert: certificate }, app).listen(process.env.PORT || 3030);`  

The URL starts with https, and the website is protected by SSL.

### 14. Heroku
A service to deploy website.

Push new commit to Heroku by running following commands:

`$ git add`

`$ git commit -am "update"`

`$ git push heroku master`

	

	 
	






 

