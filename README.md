# Node.js - account keeping web page #

----------

It's a little practice for me to build a Node.js project.

Using express, Mongodb, Heroku and other 3rd party packages.

Instead of showing how to use it, it's mainly a record what I learned and the tools I can use.

# Installation #

----------

- **Node.js**
  	Use **cmd** and shift to the target folder.
	`>> nodemon app.js`  
	Type `localhost:3030` as URL, and the 3030 port can be change in **app.js**. The start up command can be check in package.json	

- **Mongodb Compass**  
	Mongodb compass helps connecting to Mongodb. The connect URL is avaible from Mongodb web page, and the format is as following. Fill in the correct user data which can be check in **app.js**.   
	`mongodb+srv://<username>:<password>@cluster0-qnhak.mongodb.net/test` 
	However, the user data can also be replace by enviornment variables. "$" works for that.  
  
	In **app.js**
	`const MONGODB_URI 
	= 'mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qnhak.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}';`
	New a file **nodemon.json**
	`{  "env": { "MONGO_USER": "<username>", "MONGO_PASSWORD": "<password>" } }`

# Description #

----------

- Users are allowed to create user account and log in. Some demo images are also aviable here.
  
- Once logged in, users can record a new account and all of them will show in the same page.  

- Each account can be modify and delete.
  
- Every change connects to the database, which means the administrators are able to obtain all the imformation except password. 

- It can be set in localhost or through Heroku. However, there are some limit for Heroku free user, so I would n't open this web page for a long time.

# MVC 

----------

- **model**  
	Define the schema of **users** and **accounts**.   
	Although NoSQL doesn't need any schema, making some rule make it more convenient for develops to manage the data by controllers.  
 
- **view**  
	Present the visual effects to users.  
	By using ejs, developers can render the web page by sending specific varible.
	Such as controllers return `res.render('admin/edit-account', { pageTitle: 'Add Account', ... });`,  
	views receive the variable `<title><%= pageTitle %></title>`  
	and the view-source would be `<title>Add Account</title>` 

- **controller**  
	Different functions manage data and render to views.
	All requests go to controllers and be handle. That might affect and render to the views.

# 3rd Party Packages

----------

It helps developers not focus on all details. Some of them aren't in my project just list for recording.

- **express**  
	It's a very useful Node.js framework, working for middleware, request(req), response(res), routing and data management. As server gets a req, it handles with middleware and return a res which looks like `(req, res, next) => { ... }`. There are still various extension for express, and some alternatives to express. 

- **mongoose**  
	It's a Mongodb ORM, simplifying the code to interact with Mongodb.
	Such as `Account.save().then({ ... }).catch({ ... });`,  
	and `Account.findById(accouId).then({ ... }).catch({ ... });`  
	, let developers works easier to the **account** database. 

- **bcrypt js**  
	To avoid developers from knowing every users' password througth database.
    `bcrypt.hash( password, 12 ).then( hashedPassword => { const user = new User({ name: name , password: hashedPassword }); return user.save(); })`

- **csurf**  
	To avoid server from csrf attack. Every request creates a token. And with correct token, the web page shows correctly.
	`app.use((req, res, next) => { res.locals.isAuthenticated = req.session.isLoggedIn; res.locals.csrfToken = req.csrfToken(); next(); });`
	`<input type="hidden" name="_csrf" value="<%= csrfToken %>">`	

- **express-session**  
	Developers can save everything in sessions on the server. In this case, sessions are stored by user data(authentication status). Server can always check if it's allowed to view this web page or manage the data.

- **nodemailer**  
	It provides server to send emails automatically. If users forget their password, server can send them a new password.

- **validator**  
	Once user submits any information, server wants to check if they are proper or not. Validator provides some commands to restrict the data whic was sent by users.
	For example, `body('title').isString().isAlphanumeric().trim()`  
	
- **multer**  
	User can upload images which will save in the specific folder, and can also be deleted.

- **pdfkit**  
	If user would like to save the accounts, pdfkit provides them to download the information as pdf. Developers can design the context and the format.

- **stripe**  
	Nowadays it's very common to shop online. It provides users to pay in a secret way with credit card.

- **helmet**  
	It's also a protection for express.

- **compression**  
	It decearses the size of the files when tranfering througth internet and accelerates the rate of loading web page.

# SSL

----------
Type the line in cmd and the common name is **localhost**.  
`>>openssl req -nodes -new -x509 -keyout server.key -out server.cert`  
There will be two new files, server.cert and server.key in the folder. 
In **app.js**, `const privateKey = fs.readFileSync('server.key');`
`const certificate = fs.readFileSync('server.cert');`
`https.createServer({key: privateKey, cert: certificate }, app).listen(process.env.PORT || 3030);`  
The URL starts with https, and the website is protected by SSL.

# Heroku  

----------
Log in Heroku first and type in some commands in git.  
`$ git add`    
`$ git commit -am "update"`  
`$ git push heroku master`

	

	 
	






 

