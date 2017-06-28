
function onLogin() {
    $('alert').hide();
    var name = document.getElementById('inputUser').value;
    var passw = document.getElementById('inputPassword').value;
    
    login(name, passw, onLoginSuccess, onLoginError);
    
}

function onLoginSuccess(user) {
    window.location.href = 'Gamepool.html';
}

function onLoginError(user, error) {
    $('.alert').show();
    // For manually clicking the alert message away  
    $("[data-hide]").on("click", function () {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
}

function login(username, password, cbSuccess, cbError) {
  //logIn(username, password).then(cbSuccess, cbError);
}
