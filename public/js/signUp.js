	var ucase = new RegExp("[A-Z]+");
	var lcase = new RegExp("[a-z]+");
	var num = new RegExp("[0-9]+");

$(document).ready(function(){

	$("input[type=password]").keyup(function(){
 		
	
		if($("#password").val().length >= 8){
			$("#8char").removeClass("glyphicon-remove");
			$("#8char").addClass("glyphicon-ok");
			$("#8char").css("color","#00A41E");
		}else{
			$("#8char").removeClass("glyphicon-ok");
			$("#8char").addClass("glyphicon-remove");
			$("#8char").css("color","#FF0004");
		}
	
		if(ucase.test($("#password").val())){
			$("#ucase").removeClass("glyphicon-remove");
			$("#ucase").addClass("glyphicon-ok");
			$("#ucase").css("color","#00A41E");
		}else{
			$("#ucase").removeClass("glyphicon-ok");
			$("#ucase").addClass("glyphicon-remove");
			$("#ucase").css("color","#FF0004");
		}	
	
		if(lcase.test($("#password").val())){
			$("#lcase").removeClass("glyphicon-remove");
			$("#lcase").addClass("glyphicon-ok");
			$("#lcase").css("color","#00A41E");
		}else{
			$("#lcase").removeClass("glyphicon-ok");
			$("#lcase").addClass("glyphicon-remove");
			$("#lcase").css("color","#FF0004");
		}
	
		if(num.test($("#password").val())){
			$("#num").removeClass("glyphicon-remove");
			$("#num").addClass("glyphicon-ok");
			$("#num").css("color","#00A41E");
		}else{
			$("#num").removeClass("glyphicon-ok");
			$("#num").addClass("glyphicon-remove");
			$("#num").css("color","#FF0004");
		}         
	});

	$('#SigninBtn').click(function(){
		console.log("signin");
		if(check()) {
			console.log("signin check = true");
			var name = $("#inputName").val();
			var mail = $("#inputEmail").val();
			var password = $("#password").val();
			signUp(name, mail, password);
		}
	});

});
		  
	


function check(){
	console.log("check");
	if(($("#password").val().length >= 8 && ucase.test($("#password").val()) &&
		lcase.test($("#password").val()) && num.test($("#password").val()))){
			return true;
		}  
		else
		{
			alert("Ungültiges Passwort");
			return false;
		}
};

function onSignUpSuccess() {
	window.location.href = 'login.html';
}

function onSignUpError(user, error) {
	$('.alert').show();
	// For manually clicking the alert message away  
	$("[data-hide]").on("click", function () {
		$(this).closest("." + $(this).attr("data-hide")).hide();
	});
}

function signUp(name, mail, password) {
	console.log("Name: " + name + ", Mail: " + mail + ", password: " + password);
	$.ajax({
		url: "https://gamingservice.azurewebsites.net/newUser",
		type: 'POST',
		dataType: 'json',
		data: {'username':name, 'mail':mail, 'password':password}, 
		success: function(result) {
			console.log("User-Result: ", result);
			if (result.status == '200') {
				onSignUpSuccess();
			}			
		},	
		error: function(response) {
			console.log("Error: ", response);
			onSignUpError("FakeUser", response.error);
		}
	});
}	  
