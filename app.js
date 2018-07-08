var express = require("express");//引入了 express 模块
//require() 用于在当前模块中加载和使用其他模块；此方法是模块的基础，使用中大概有路径的概念就行。PS：JS文件可以去掉".js"后缀
var app = express();//express() 表示创建express应用程序,app is an instance of express.
var passport = require("passport");
var methodOverride = require("method-override");//增加除浏览器自带的get,post以外的伪请求，增加接口语义话
var LocalStrategy = require("passport-local");
//可以通过body-parser 对象创建中间件，当接收到客户端请求时所有的中间件都会给req.body 添加属性，请求体为空，则解析为空{} （或者出现错误）。
var bodyParser =require('body-parser');
var mongoose = require("mongoose");
var flash = require("connect-flash");
var Campground = require("./models/campground");//因为在campground.js里有module.export才能这样用
var Comments = require("./models/comments");//同上
var User = require("./models/user");
var seedDB = require("./seed");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// for heroku

//设置静态文件目录,将静态文件目录设置为项目根目录+/public
//__dirname 表示当前文件所在的目录的绝对路径
app.use(express.static(__dirname + "/public"));
//tell express to use body-parser, urlencoded解析body中的urlencoded字符， 只支持utf-8的编码的字符,也支持自动的解析gzip和 zlib
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");//set up a template模版引擎设置为 ejs
//var ejs = require("ejs");
app.use(methodOverride("_method"));//我们需要为method-override提供一个key以便用得到改写的方法
//这里我们提供的键值是_method。当然也可以是其他字符串，但是这个字符串不能以 X- 开始。

//this before the passport configuration in app.js
app.use(flash());


// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://Final:PbnTo4wt3chJKk@ds129811.mlab.com:29811/eorzeacamp");

//Run the seed file everytime the server start
// seedDB(); //seed the database

//passport configuration
app.use(require("express-session") ({
    secret: "dfsfdsfsfsd",
    resave: true,
    saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
//User.authenticate() is not what we wrote, it is from UserSchema.plugin(passportLocalMongoose) in user.js
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// //compile above into a model
// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "bbb", image: "https://img2.finalfantasyxiv.com/accimg/7e/21/7e216c967f5dcb3583bc00aad4d9ec1d9c75c9c8.jpg",
//     description: "this is eorzea."
// }, function(err, campground) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("newly create a campgroud");
//         console.log(campground);
//     }
// });

//define campgrouds array
var campgrounds = [
    {name: "aaa", image: "https://img2.finalfantasyxiv.com/accimg/a0/a1/a0a1dee626b29a5a8f84bc74357e47ed0ff3df57.jpg"},
    {name: "bbb", image: "https://img2.finalfantasyxiv.com/accimg/7e/21/7e216c967f5dcb3583bc00aad4d9ec1d9c75c9c8.jpg"},
    {name: "ccc", image: "http://blog-imgs-64.fc2.com/e/r/i/eritto/ffxiv_20140215_185520.jpg"},
    {name: "sdjfkls", image: "https://farm5.staticflickr.com/4485/37968261016_78de115842.jpg"},
    {name: "aaaui", image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg"},
    {name: "mkl", image: "https://farm5.staticflickr.com/4176/34533122526_13d698e62a.jpg"},
    {name: "sdjfkls", image: "https://farm5.staticflickr.com/4485/37968261016_78de115842.jpg"},
    {name: "aaaui", image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg"},
    {name: "mkl", image: "https://farm5.staticflickr.com/4176/34533122526_13d698e62a.jpg"},
    {name: "sdjfkls", image: "https://farm5.staticflickr.com/4485/37968261016_78de115842.jpg"},
    {name: "aaaui", image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg"},
    {name: "mkl", image: "https://farm5.staticflickr.com/4176/34533122526_13d698e62a.jpg"}
];

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


//app.listen() 就是在给定的主机和端口上监听请求，这个和node中http模块的http.createServer(function(){...}).listen()效果一致；
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("yelpcamp has started");
});