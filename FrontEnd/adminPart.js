/* Gestion en page admin / faire disparraitre les filtres*/

function importWorks() {
  const promise1 = fetch("http://localhost:5678/api/works/");

  promise1
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const gallery = document.querySelector(".gallery");
      const imagesData = data.map((images) => {
        return ` <figure>
                      <img data-category=${images.category.name} src=${images.imageUrl} alt="Abajour Tahina"
crossorigin="" />
                      <figcaption>${images.title}</figcaption>
                   </figure>`;
      });

      gallery.innerHTML = imagesData.join("");
    })
    .catch((err) => console.log(err));
}

function importWorkModal() {
  const promise1 = fetch("http://localhost:5678/api/works/");

  promise1
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const imgModal = document.querySelector(".img-gal-modal");
      const imagesData = data.map((images) => {
        return `<div class="imgModal">
              <button class="btnDelete" id="${images.id}">
              <i class="fa-solid fa-trash-can"></i>
              </button>
              <img data-id=${images.id} src=${images.imageUrl} crossorigin="" />
              <figcaption><a href="#" class="modifImg">éditer</a></figcaption>
              </div>`;
      });
      imgModal.innerHTML = imagesData.join("");
    });
}

/* efface les filtres / fait apparaitre partir admin */

if (localStorage.token === undefined) {
} else {
  let filtres = document.querySelector(".filtres");
  filtres.style.display = "none";

  let ancreModal = document.querySelector(".ancreModal");
  ancreModal.style.display = "flex";

  let icone = document.querySelector(".btnModifIntro");
  icone.style.display = "flex";

  let navBar = document.querySelector(".navAdmin");
  navBar.style.display = "flex";

  let nav2 = document.querySelector(".ghostNav");
  nav2.style.display = "flex";

  /* Fait apparraitre boutons modifier */

  let divModifElement = document.querySelector(".gestBal");

  let modifyElement = document.createElement("div");
  modifyElement.classList.add("#btn-modal");

  divModifElement.appendChild(modifyElement);

  /* Gestion de la modal */

  let modal = null;

  const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = "flex";
    target.removeAttribute("aria-hiden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-close")
      .addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .addEventListener("click", stopPropagation);
  };

  const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hiden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-close")
      .removeEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .removeEventListener("click", stopPropagation);
    modal = null;
  };

  const stopPropagation = function (e) {
    e.stopPropagation();
  };

  document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
  });

  /* gestion suppression des images */

  function deletePart() {
    const promise1 = fetch("http://localhost:5678/api/works/");

    promise1
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const imgModal = document.querySelector(".img-gal-modal");
        const imagesData = data.map((images) => {
          return `<div class="imgModal">
              <button class="btnDelete" id="${images.id}">
              <i class="fa-solid fa-trash-can"></i>
              </button>
              <img data-id=${images.id} src=${images.imageUrl} crossorigin="" />
              <figcaption><a href="#" class="modifImg">éditer</a></figcaption>
              </div>`;
        });
        imgModal.innerHTML = imagesData.join("");

        const allImgDelete = document.querySelectorAll(
          ".img-gal-modal .imgModal"
        );

        if (allImgDelete) {
          allImgDelete.forEach((image) => {
            let bouton = image.querySelector("button");

            bouton.addEventListener("click", function (e) {
              e.preventDefault();

              let element;
              if (e.target.tagName === "I") {
                element = e.target.parentNode;
              } else {
                element = e.target;
              }

              let idDelete = element.getAttribute("id");

              const token = localStorage.getItem("token");

              const confirmation = confirm(
                "Voulez-vous supprimer cette image ?"
              );

              if (confirmation) {
                fetch(`http://localhost:5678/api/works/${idDelete}`, {
                  method: "DELETE",
                  headers: {
                    "content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((res) => res)
                  .then((response) => {
                    document.querySelector(".gallery").innerHTML = "";
                    importWorks();
                    if (response.status === 204) {
                      document.querySelector(".img-gal-modal").innerHTML = "";

                      deletePart();
                    }
                  });
              }
            });
          });
        }
      });
  }

  deletePart();

  /* Function reset preview dans Upload Img Form */

  function reloadForm() {
    let ajoutCache1 = document.querySelector(".inputImg i");
    let ajoutCache2 = document.querySelector(".inputImg label");
    let ajoutCache3 = document.querySelector(".inputImg p");
    let reveleImg = document.querySelector(" .inputImg img");
    ajoutCache1.style.display = "flex";
    ajoutCache2.style.display = "flex";
    ajoutCache3.style.display = "flex";
    reveleImg.style.display = "none";

    const inputTitle = document.querySelector(".inputText input");
    inputTitle.innerHTML = "";
  }

  /* Function Preview Image dans Upload Img Form */

  function previewImage() {
    const file = document.querySelector(".file").files;
    if (file.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        document
          .getElementById("preview")
          .setAttribute("src", event.target.result);

        let ajoutCache1 = document.querySelector(".inputImg i");
        let ajoutCache2 = document.querySelector(".inputImg label");
        let ajoutCache3 = document.querySelector(".inputImg p");
        let reveleImg = document.querySelector(" .inputImg img");
        ajoutCache1.style.display = "none";
        ajoutCache2.style.display = "none";
        ajoutCache3.style.display = "none";
        reveleImg.style.display = "flex";
      };

      fileReader.readAsDataURL(file[0]);
    }
  }

  /* Gestion Formulaire Upload Img */

  function uploadImg() {
    document.querySelector("#form").addEventListener("submit", function (e) {
      e.preventDefault();

      const inputFile = document.querySelector('#form input[name="inputFile"]');
      if (inputFile.value === "") {
        document.querySelector(".error").style.display = "flex";

        inputFile.focus();
        return false;
      }
      if (inputFile.value !== "") {
        document.querySelector(".error").style.display = "none";
      }

      const inputTitle = document.querySelector(
        '#form input[name="inputTitle"]'
      );
      if (inputTitle.value === "") {
        const errMsg = (document.querySelector(".error").style.display =
          "flex");

        inputTitle.focus();
        return false;
      }
      if (inputTitle.value !== "") {
        document.querySelector(".error").style.display = "none";
      }

      const image = document.getElementById("image");
      const title = document.getElementById("title");
      const category = document.getElementById("category");

      const token = localStorage.getItem("token");

      let formData = new FormData();
      formData.append("image", image.files[0]);
      formData.append("title", title.value);
      formData.append("category", category.value);

      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((response) => {
          document.querySelector(".gallery").innerHTML = "";
          importWorks();

          const backGal = document.querySelector(".modal");
          modal.style.display = "none";
          modal.setAttribute("aria-hiden", "true");

          document.querySelector(".img-gal-modal").innerHTML = "";
          importWorkModal();
          redirection();

          document.querySelector("#form").reset();

          function redirection() {
            setTimeout(goBack, 500);
          }

          function goBack() {
            reloadForm();
          }
        });
    });
  }

  uploadImg();

  /* Affiche le formulaire dans la modal*/

  const imgForm = function (e) {
    let addDivForm = document.querySelector(".img-gal-modal");
    addDivForm.style.display = "none";

    let closeForm2 = document.querySelector(".modalGallery");
    closeForm2.style.display = "none";

    let divForm = document.querySelector(".modalFormulaire");
    divForm.style.display = "flex";
  };

  /* Affiche la gallery de suppréssion d'images */

  const galDeleteImg = function (e) {
    let closeForm = document.querySelector(".modalFormulaire");
    closeForm.style.display = "none";

    let closeForm2 = document.querySelector(".modalGallery");
    closeForm2.style.display = "flex";

    let openSupGal = document.querySelector(".img-gal-modal");
    openSupGal.style.display = "grid";

    deletePart();
  };

  /* Gestion redirection => formulaire Ajout => Modif Img Gallery */

  window.addEventListener("DOMContentLoaded", (event) => {
    const addImg = document
      .querySelector(".ajouter")
      .addEventListener("click", imgForm);
  });

  window.addEventListener("DOMContentLoaded", (event) => {
    const supImg = document
      .querySelector(".modalGoBack")
      .addEventListener("click", galDeleteImg);
  });
}
