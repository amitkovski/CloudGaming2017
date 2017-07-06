
function onLogin() {
    $('alert').hide();
    var name = document.getElementById('inputUser').value;
    var passw = document.getElementById('inputPassword').value;
    
    login(name, passw, onLoginSuccess, onLoginError);
    
}

function onLoginSuccess(user) {
    window.location.href = 'gamepool.html';
}

function onLoginError(user, error) {
    $('.alert').show();
    // For manually clicking the alert message away  
    $("[data-hide]").on("click", function () {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
}

function login(username, password, cbSuccess, cbError) {
 $.ajax({
    url: "http://localhost:3000/login",
    type: 'POST',
    dataType: 'json',
    data: {'username':username, 'password':password}, 
    crossDomain: true,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent(username + ':' + password))))
    },
    success: function(result) {
        console.log("User-Result: ", result);
        onLoginSuccess(result.user);
    },
    error: function(response) {
        console.log(response);
        onLoginError("FakeUser", response);
    }
  });
}
