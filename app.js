
const mongoose=require('mongoose');
const express=require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app=express();
const hostname='0.0.0.0';
app.use(cookieParser())
let port='8080';
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
app.use(express.json());
const db_link='mongodb+srv://Rounak:Rounak@cluster0.obxdh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const JWT_key="qwertyuiop";
mongoose.connect(db_link).then(function(){
    console.log('db_connect');
})
.catch(function(err){
    console.log(err);
});
const authrouter=express.Router();
app.get('/',(req,res)=>{
    res.sendFile('index.html', { root: '.' })
})
app.get('/login',(req,res)=>{
    console.log(req.cookies);
    if(req.cookies.login){
        let isVerify=jwt.verify(req.cookies.login,JWT_key);
        if(isVerify){
            res.send('allredy signed in');
        }
    }

    res.sendFile('login.html',{root:'.'})
})
app.get('/forget',(req,res)=>{
    res.sendFile('forget_password.html',{root:'.'})
})

app.get('/posting',(req,res)=>{
    res.sendFile('post.html',{root:'.'})
})
app.get('/read',(req,res)=>{
    res.sendFile('read_post.html',{root:'.'})
})
app.use('/auth',authrouter);
authrouter
.route('/signup')
.post(signupuser);
authrouter.
route('/login')
.post(loginuser);
authrouter.
route('/forget')
.post(changepassword);

authrouter.
route('/posting')
.post(startposting);
authrouter.
route('/read_post')
.post(readpost);
authrouter.
route('/readcomments')
.post(get_comment);
authrouter.
route('/upload_comment')
.post(updatecomment);
authrouter.
route('/upload_like')
.post(upload_like);
authrouter.
route('/deltepost')
.post(deletingpost);

function loggingout(req, res){
    res.clearCookie('foo');
    res.send('cookie foo cleared');
 }
 
const postSchema=new mongoose.Schema({
    post:{
        type:String,
        required:false
    },
    name:{
        type:String,
        required:false
    },
    Comment:{
        type:Array,
        require:false,
    },
    likes:{
        type:Array,
        require:false,
    }
});
const userPost=mongoose.model('userPost',postSchema);
let filter;
const deleteDocument=async(_id)=>{
    console.log(_id);
    const result=await userPost.deleteOne({_id});
}
function deletingpost(req,res){
    console.log("deleting started");
    deleteDocument(req.body.id)
}
const updatelike = async (_id)=>{
    console.log(_id,"lik");
    console.log(filter,"lik");
    const result = await userPost.updateOne({_id},{
        $push: { likes: filter }
    });
    console.log(result,"qwerty");
}
function upload_like(req,res){
    console.log("liking");
    filter=req.cookies.user_sjhj;
    updatelike(req.body.id);
}
function startposting(req,res){
    console.log("posting");
    (async function createUser(){
        console.log("edrgft");
        let user={
            post:`${req.body.email}`,
            name:`${req.cookies.user_sjhj}`,
            Comment:[],
            likes:[]
        };
        let userObj=await userPost.create(user);
        console.log(userObj);
        res.send('signed in');
    })();
}
const updateDocument = async (_id)=>{
    console.log(_id);
    const result = await userPost.updateOne({_id},{
        $push: { Comment: filter }
    });
    console.log(result,"drtftytf");
}
function updatecomment(req,res){
    filter=req.body.email;
    console.log(filter);
    console.log(req.body.id);
    updateDocument(req.body.id);
}
async function readpost(req,res){
    console.log("drgfthygjh");
    const result=await userPost.find();
    console.log(result);
    res.send(result);
}
async function get_comment(req,res){
    const { email} = req.body;
    console.log(email);
    try{
        let user=await userPost.findOne({ email });
        console.log(user);
        res.send(user.Comment);
    }
    catch(err){
        console.log('catch');
    }
}
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:8
    }
});
const userModel=mongoose.model('userModal',userSchema);
function signupuser(req,res){
    console.log("function");
    (async function createUser(){
        console.log("edrgft");
        let user={
            name:`${req.body.name}`,
            email:`${req.body.email}`,
            password:`${req.body.password}`
        };
        let userObj=await userModel.create(user);
        console.log(userObj);
        res.send('signed in');
    })();
}
async function loginuser(req,res){
    const { email, password } = req.body;
    console.log(email);
    console.log('signup user hvjbnklm;,lkiuytrtdcgfhcalled')
    try{
        console.log('try called');
        let user=await userModel.findOne({ email });
        console.log(user)
        if(user.password==password){
            let token=jwt.sign({id:user._id},JWT_key);
            res.cookie('login',token,{httpOnly:true});
            res.cookie('user_sjhj',user._id,{httpOnly:true});
            res.send('logged in')
        }
    }
    catch(err){
        console.log('catch');
    }
}
async function changepassword(req,res){
    const { email, password } = req.body;
    console.log(email);
    console.log('signup user called')
    try{
        console.log('try called');
        let user=await userModel.findOne({ email });
        console.log(user);
        if(user){
            console.log("user found")
            const result = await userModel.updateOne({_id:`${user._id}`},{
                $set:{
                    password:`${req.body.password}`
                }
            });
            console.log(result);
        }
        else{
            res.send('wrong email id')
        }
    }
    catch(err){
        console.log('catch');
    }
}