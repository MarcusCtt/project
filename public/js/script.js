/* animação do login */

lnr-eye.addEventListener('click',function(){
input.type = input.type == 'text' ? 'password' : 'text';

document.getElementById('lnr-eye').addEventListener('mousemove', function() {
  document.getElementById('pass').type = 'password';
});


$(".lnr-eye").click(function() {
var pass = document.getElementById("password");
  if (password.type === "pass") {
    password.type = "text";
    $('.lnr-eye').toggleClass("lnr lnr-eye");
  } else {
    password.type = "pass";
    $('.lnr-eye').toggleClass("lnr lnr-eye");
  }
});