function userLoggedIn() {

    if (sessionStorage.loggedIn == 'true' ) {
      return true;
    }
    else {
      return false;
    }
  }


function showLoginLink() {
    const link = document.getElementById('navbarDropdown');
    const adminMenu = document.getElementById("adminMenu");
  
    // Read session storage value (set during login) and set link
    if (userLoggedIn() === true) {
      link.innerHTML = 'Logout';
      link.removeAttribute('data-toggle');
      link.addEventListener("click", function() {logout()})
      adminMenu.style.visibility="visible";
    }
    else {
      link.innerHTML = 'Login';
      link.setAttribute('data-toggle', 'dropdown');
      link.removeEventListener("click", function() {logout()});
      adminMenu.style.visibility="hidden";
    }
  }

async function logIn() {
    const loginUrl = `${BASE_URL}login`;
    const userLogin = document.getElementById("login").value;
    const pwd = document.getElementById("password").value;
    const reqBody = JSON.stringify({
        username: userLogin,
        password: pwd
    })
    try {
        const json = await postOrPutDataAsync(loginUrl, reqBody, 'POST');
        if (json.user) {
            sessionStorage.loggedIn = true;
            location.reload(true);
        } else {
            alert(json.message);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}


async function logout() {
    const logoutUrl = `${BASE_URL}login/logout`
    try {
        const json = await getDataAsync(logoutUrl);
        console.log("response: " + JSON.stringify(json));
        sessionStorage.loggedIn = false;
        location.reload(true);
    } catch (err) {
        console.log(err);
        return err;
    }
}