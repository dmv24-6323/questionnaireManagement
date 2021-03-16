$(document).ready(function(){

  /* Login form validation */
  $("#loginform").validate({
      rules: {
            username: {
                required: true,
            },
            password: {
                required: true,
            },
      },
      messages: {
            username: {
              required: "Please specify your username",
            },
            password: {
              required: "Please enter the password",
            },
      },
  });

});