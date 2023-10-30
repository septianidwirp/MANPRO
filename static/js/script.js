var url = window.location.href;

if (url.indexOf("register.html") > -1) {
    var user = {
        name: '',
        email: '',
        password: '',
    };

    var usernameCheck = false;
    var passwordCheck = false;
    var emailCheck = false;
    
    var username = document.getElementById("username");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var passwordValidation = document.getElementById("passwordValidation");
    
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var min5 = /^.{5,}$/;
    var max10 = /^.{1,10}$/;
    var min6 = /^.{6,}$/;
    var max12 = /^.{1,12}$/;
    var space = /\s/;
    var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    
    username.oninput = function() {
        var usernameError = document.getElementById("usernameError");
        if (!username.value == '') {
            if (username.value.match(min5) && username.value.match(max10)) {
                if (!username.value.match(space) && !username.value.match(specialCharacters)) {
                    usernameError.innerHTML = '';
                    usernameCheck = true;
                } else {
                    usernameError.innerHTML = "Username can not contain space and special characters";
                }
            } else {
                usernameError.innerHTML = 'Username must be between 5 and 10 characters';
            }
        } else {
            usernameError.innerHTML = "Username cannot be empty";
        }
    }
    
    email.oninput = function() {
        var emailError = document.getElementById("emailError");
        if (!email.value == '') {
            if (email.value.match(emailRegex)) {
                emailError.innerHTML = '';
                emailCheck = true;
            } else {
                emailError.innerHTML = "Email is not valid";
            }
        } else {
            emailError.innerHTML = "Email cannot be empty";
        }
    }
    
    password.oninput = function() {
        var passwordError = document.getElementById("passwordError");
        var passwordValidationError = document.getElementById("passwordValidationError");
        if (!password.value == null || !password.value == "") {
            if(password.value.match(lowerCaseLetters)){
                if(password.value.match(upperCaseLetters)){
                    if(password.value.match(numbers)){
                        if(password.value.match(min6) && password.value.match(max12)){
                            if(!password.value.match(space) && !password.value.match(specialCharacters)){
                                if(password.value == passwordValidation.value) {
                                    passwordError.innerHTML = '';
                                    passwordValidationError.innerHTML = '';
                                    passwordCheck = true;
                                } else {
                                    passwordError.innerHTML = "Password does not match";
                                    passwordValidationError.innerHTML = "Password does not match";
                                    passwordValidation.oninput = function() {
                                        if(password.value == passwordValidation.value){
                                            passwordError.innerHTML = '';
                                            passwordValidationError.innerHTML = '';
                                            passwordCheck = true;
                                        }
                                    }
                                }
                            }else{
                                passwordError.innerHTML = "Password can not contain space and special characters";
                            }
                        } else {
                            passwordError.innerHTML = "Password must be between 6 and 12 characters";
                        }
                    } else {
                        passwordError.innerHTML = "Password must contain at least one number";
                    }
                } else {
                    passwordError.innerHTML = "Password must contain at least one uppercase letter";
                }
            }
            else {
                passwordError.innerHTML = "Password must contain at least one lowercase letter";
            }
        } else {
            passwordError.innerHTML = "Password can not be empty";
        }
    };
    
    function store() {
        var errorText = document.getElementById("errorText");
        var errorToast = document.getElementById("errorToast");
        if (usernameCheck){
            if (emailCheck){
                if (passwordCheck){
                    user.name = username.value;
                    user.email = email.value;
                    user.password = password.value;
                    localStorage.setItem('user', JSON.stringify(user));
                    const registerToast = document.getElementById('registered');
                    const toast = new bootstrap.Toast(registerToast);
                    toast.show();
                    setTimeout(function() {
                        window.location.href = "login.html";
                    }, 2000);
                } else {
                    errorText.innerHTML = "Please check your password";
                    const toast = new bootstrap.Toast(errorToast);
                    toast.show();
                }
            } else {
                errorText.innerHTML = "Please check your email";
                const toast = new bootstrap.Toast(errorToast);
                toast.show();
            }
        } else {
            errorText.innerHTML = "Please check your username";
            const toast = new bootstrap.Toast(errorToast);
            toast.show();
        }
    }
}

if (url.indexOf("login.html") > -1) {
    var user = JSON.parse(localStorage.getItem('user'));
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var errorText = document.getElementById("errorText");
    var errorToast = document.getElementById("errorToast");
    
    function login() {
        if (localStorage.getItem('user') == null) {
            errorText.innerHTML = "It looks like you haven't registered yet, please register first";
            const toast = new bootstrap.Toast(errorToast);
            toast.show();
        } else if (!email.value == '' || !email.value == null || !password.value == '' || !password.value == null) {
            if (email.value == user.email){
                if(password.value == user.password){
                    loginStatus = 1;
                    sessionStorage.setItem('loginStatus', loginStatus);
                    localStorage.setItem('user', JSON.stringify(user));
                    const loginToast = document.getElementById('loggedIn');
                    const toast = new bootstrap.Toast(loginToast);
                    toast.show();
                    setTimeout(function() {
                        window.location.href = "index.html";
                    }, 2000);
                } else {
                    errorText.innerHTML = "Password is incorrect";
                    const toast = new bootstrap.Toast(errorToast);
                    toast.show();
                }
            } else {
                errorText.innerHTML = "Email not found, please sign up";
                const toast = new bootstrap.Toast(errorToast);
                toast.show();
            }
        } else {
            errorText.innerHTML = "Please fill in all fields";
            const toast = new bootstrap.Toast(errorToast);
            toast.show();
        }
    }
}

var origin = window.location.origin + "/";
if (url.indexOf("index.html") > -1 || url == origin) {
    var user = JSON.parse(localStorage.getItem('user'));
    var loginStatus = sessionStorage.getItem('loginStatus');
    var userNav = document.getElementById("userNav");
    
    var usernameCheck = true;
    var passwordCheck = false;
    var emailCheck = true;
    if (loginStatus == 1){
        var contactEmail = document.getElementById("contactEmail");
        contactEmail.value = user.email;
        var newNav = `
        <button type="button" class="btn btn-primary fw-semibold rounded px-4 me-2" id="userAccount" data-bs-toggle="modal" data-bs-target="#updateModal">${user.name}</button>
        <button type="button" class="btn btn-primary fw-semibold rounded-5 px-4" data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</button>`
        userNav.innerHTML = newNav;
        
        setTimeout(function() {
            loginStatus = 0;
            sessionStorage.setItem('loginStatus', loginStatus);
        }, 180000);
        
        var username = document.getElementById("username");
        var email = document.getElementById("email");
        var password = document.getElementById("password");
        var passwordValidation = document.getElementById("passwordValidation");
        
        username.value = user.name;
        email.value = user.email;
        password.value = user.password;
        
        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        var min5 = /^.{5,}$/;
        var max10 = /^.{1,10}$/;
        var min6 = /^.{6,}$/;
        var max12 = /^.{1,12}$/;
        var space = /\s/;
        var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        
        username.oninput = function() {
            usernameCheck = false;
            var usernameError = document.getElementById("usernameError");
            if (!username.value == '') {
                if (username.value.match(min5) && username.value.match(max10)) {
                    if (!username.value.match(space) && !username.value.match(specialCharacters)) {
                        usernameError.innerHTML = '';
                        usernameCheck = true;
                    } else {
                        usernameError.innerHTML = "Username can not contain space and special characters";
                    }
                } else {
                    usernameError.innerHTML = 'Username must be between 5 and 10 characters';
                }
            } else {
                usernameError.innerHTML = "Username cannot be empty";
            }
        }
        
        email.oninput = function() {
            emailCheck = false;
            var emailError = document.getElementById("emailError");
            if (!email.value == '') {
                if (email.value.match(emailRegex)) {
                    emailError.innerHTML = '';
                    emailCheck = true;
                } else {
                    emailError.innerHTML = "Email is not valid";
                }
            } else {
                emailError.innerHTML = "Email cannot be empty";
            }
        }
        
        password.oninput = function() {
            var passwordError = document.getElementById("passwordError");
            var passwordValidationError = document.getElementById("passwordValidationError");
            if (!password.value == null || !password.value == "") {
                if(password.value.match(lowerCaseLetters)){
                    if(password.value.match(upperCaseLetters)){
                        if(password.value.match(numbers)){
                            if(password.value.match(min6) && password.value.match(max12)){
                                if(!password.value.match(space) && !password.value.match(specialCharacters)){
                                    if(password.value == passwordValidation.value) {
                                        passwordError.innerHTML = '';
                                        passwordValidationError.innerHTML = '';
                                        passwordCheck = true;
                                    } else {
                                        passwordError.innerHTML = "Password does not match";
                                        passwordValidationError.innerHTML = "Password does not match";
                                        passwordValidation.oninput = function() {
                                            if(password.value == passwordValidation.value){
                                                passwordError.innerHTML = '';
                                                passwordValidationError.innerHTML = '';
                                                passwordCheck = true;
                                            }
                                        }
                                    }
                                }else{
                                    passwordError.innerHTML = "Password can not contain space and special characters";
                                }
                            } else {
                                passwordError.innerHTML = "Password must be between 6 and 12 characters";
                            }
                        } else {
                            passwordError.innerHTML = "Password must contain at least one number";
                        }
                    } else {
                        passwordError.innerHTML = "Password must contain at least one uppercase letter";
                    }
                }
                else {
                    passwordError.innerHTML = "Password must contain at least one lowercase letter";
                }
            } else {
                passwordError.innerHTML = "Password can not be empty";
            }
        };
        
        passwordValidation.oninput = function() {
            if(password.value == passwordValidation.value){
                passwordError.innerHTML = '';
                passwordValidationError.innerHTML = '';
                passwordCheck = true;
            } else {
                passwordError.innerHTML = "Password does not match";
                passwordValidationError.innerHTML = "Password does not match";
            }
        }
        
        function update(){
            var errorText = document.getElementById("errorText");
            var errorToast = document.getElementById("errorToast");
            if (usernameCheck){
                if (emailCheck){
                    if (passwordCheck){
                        user.name = username.value;
                        user.email = email.value;
                        user.password = password.value;
                        localStorage.setItem('user', JSON.stringify(user));
                        const updateToast = document.getElementById('updated');
                        const toast = new bootstrap.Toast(updateToast);
                        toast.show();
                        loginStatus = 0;
                        sessionStorage.setItem('loginStatus', loginStatus);
                        setTimeout(function() {
                            window.location.href = "login.html";
                        }, 2000);
                    } else {
                        errorText.innerHTML = "Please check your password";
                        const toast = new bootstrap.Toast(errorToast);
                        toast.show();
                    }
                } else {
                    errorText.innerHTML = "Please check your email";
                    const toast = new bootstrap.Toast(errorToast);
                    toast.show();
                }
            } else {
                errorText.innerHTML = "Please check your username";
                const toast = new bootstrap.Toast(errorToast);
                toast.show();
            }
        }
    } 
    
    var plan1 = document.getElementById("plan1");
    var btnPlan1 = document.getElementById("btnPlan1");
    var plan2 = document.getElementById("plan2");
    var btnPlan2 = document.getElementById("btnPlan2");
    var plan3 = document.getElementById("plan3");
    var btnPlan3 = document.getElementById("btnPlan3");
    
    plan1.onmouseenter = function() {
        plan1.classList.remove("plan-bg");
        plan1.classList.add("plan-bg-hovered");
        btnPlan1.innerHTML = 'Get Started';
        btnPlan1.classList.remove('plan-btn');
        btnPlan1.classList.add('btn-outline-primary');
    }
    plan1.onmouseleave = function() {
        plan1.classList.remove("plan-bg-hovered");
        plan1.classList.add("plan-bg");
        btnPlan1.innerHTML = 'Learn more';
        btnPlan1.classList.remove('btn-outline-primary');
        btnPlan1.classList.add('plan-btn');
    }
    
    plan2.onmouseenter = function() {
        plan2.classList.remove("plan-bg");
        plan2.classList.add("plan-bg-hovered");
        btnPlan2.innerHTML = 'Get Started';
        btnPlan2.classList.remove('plan-btn');
        btnPlan2.classList.add('btn-outline-primary');
    }
    plan2.onmouseleave = function() {
        plan2.classList.remove("plan-bg-hovered");
        plan2.classList.add("plan-bg");
        btnPlan2.innerHTML = 'Learn more';
        btnPlan2.classList.remove('btn-outline-primary');
        btnPlan2.classList.add('plan-btn');
    }
    
    plan3.onmouseenter = function() {
        plan3.classList.remove("plan-bg");
        plan3.classList.add("plan-bg-hovered");
        btnPlan3.innerHTML = 'Get Started';
        btnPlan3.classList.remove('plan-btn');
        btnPlan3.classList.add('btn-outline-primary');
    }
    plan3.onmouseleave = function() {
        plan3.classList.remove("plan-bg-hovered");
        plan3.classList.add("plan-bg");
        btnPlan3.innerHTML = 'Learn more';
        btnPlan3.classList.remove('btn-outline-primary');
        btnPlan3.classList.add('plan-btn');
    }
    
    var contactEmail = document.getElementById("contactEmail");
    var newsletterToast = document.getElementById("newsletterToast");
    var newsletterError = document.getElementById("newsletterError");
    var emailBtn = document.getElementById("emailBtn");
    if(emailBtn){
        emailBtn.onclick = function() {
            if (contactEmail.value == null || contactEmail.value == ""){
                const toast = new bootstrap.Toast(newsletterError);
                toast.show();
            } else {
                var userEmail = document.getElementById("userEmail");
                userEmail.innerHTML = contactEmail.value;
                const toast = new bootstrap.Toast(newsletterToast);
                toast.show();
            }
        }
    }
}

function logout() {
    var loginStatus = sessionStorage.getItem('loginStatus');
    loginStatus = 0;
    sessionStorage.setItem('loginStatus', loginStatus);
    window.location.href = "login.html";
}

var goToTop = document.querySelector('.go-to-top');

window.addEventListener('scroll', () => {
    if ( this.scrollY >= 400 ) {
        goToTop.classList.add('show');
        
        goToTop.addEventListener('click', () => {
            window.scrollTo({top: 0});
        })
    } else {
        goToTop.classList.remove('show');
    }
});