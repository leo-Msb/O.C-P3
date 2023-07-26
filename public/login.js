/* Gestion formulaire login */

/* Gestion de formulaire */
window.addEventListener("DOMContentLoaded", (event) => {
  const loginForm = document.getElementById("submit");
  loginForm.addEventListener("click", (e) => {
    e.preventDefault();

    const emailInput = document.querySelector('#form input[name="email"]');
    if (emailInput.value == "") {
      errorMsg();

      emailInput.focus();
      return false;
    }
    if (emailInput.value.indexOf("@", 0) < 0) {
      errorMsg();

      emailInput.focus();
      return false;
    }
    if (emailInput.value.indexOf(".", 0) < 0) {
      errorMsg();

      emailInput.focus();
      return false;
    }

    const passwordInput = document.querySelector(
      '#form input[name="password"]'
    );
    if (passwordInput.value == "") {
      errorMsg();

      passwordInput.focus();
      return false;
    }

    /* Appelle API pour récupération token */

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    })
      /* Gestion reponse de fetch OK renvoie à l'index / undefined renvoie msg */
      .then((response) => response.json())
      .then((data) => {
        window.localStorage.setItem("token", data.token);
        if (data.userId !== undefined) {
          window.location.replace("index.html");
        } else {
          alert("Veuillez vous enregistrer !");
        }
      })

      .catch((err) => console.log(err));
  });
});

function errorMsg() {
  const errMsg = document.querySelector(".errorMsg");

  errMsg.innerText = "E-mail ou Mot de pass invalide !";
}
