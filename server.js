var koa = require('koa');
var app = module.exports = koa();

//They take the data from your http POST and parse it into a more usable state
app.use(require('koa-cors')({
   methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS', //'POST,PUT,GET'                               //'GET,HEAD,PUT,POST,DELETE,OPTIONS',
   credentials: true                                            //credentials: true
 }));


app.use(function *(next){
  try
    {
    yield next; 
    //pass on the execution to downstream middlewares
    } catch (err) 
    { 
    //executed only when an error occurs & no other middleware responds to the request
    this.type = 'json'; //optiona here
    this.status = err.status || 500;
    this.body = { 'error' : 'The application is not responding because of some error;) '};
    //delegate the error back to application
    this.app.emit('error', err, this);
    }
});

app.use(function *(){
  yield send(this, this.path, { root: __dirname + '/public' });
})

app.listen(8000);
console.log("server is listening at port 8000");