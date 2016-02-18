/* Outside Javascripts belong in scriptSrc */
var scriptSrc = [
  'http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js',  // signup.ejs, SuccessSignup.ejs, login.ejs
  'https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js',  // SuccessSignup.ejs
  'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js', // SuccessSignup.ejs
  'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js'  // SuccessSignup.ejs
];

/* Outside CSS belong in scriptSrc */
var styleSrc = [
  'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',  // SuccessSignup.ejs
  'http://fonts.googleapis.com/css?family=Montserrat:400,700',  // standardnavbar.ejs
  'http://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic'  // standardnavbar.ejs
];


module.exports.scriptSrc = scriptSrc;
module.exports.styleSrc = styleSrc;
