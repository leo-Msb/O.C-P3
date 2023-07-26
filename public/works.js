/* Appelle Fetch recupération Images works */

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
crossorigin="Access-Control-Allow-Origin" />
                      <figcaption>${images.title}</figcaption>
                   </figure>`;
      });

      gallery.innerHTML = imagesData.join("");
    })
    .catch((err) => console.log(err));
}

importWorks();

/*Appelle Fetch pour création de filtres*/

const promise2 = fetch("http://localhost:5678/api/categories");

promise2
  .then((responce2) => {
    return responce2.json();
  })
  .then((categoriesId) => {
    const filtres = document.querySelector(".filtres");
    categoriesId.forEach(function (value) {});
    const filtresData = categoriesId.map((categories) => {
      return `
      <button class="objets">${categories.name}</button>
      `;
    });

    const allButtons = document.querySelectorAll(".blockFiltres button");
    for (let i = 0; i < allButtons.length; i++) {
      allButtons[i].addEventListener("click", function (e) {
        document.querySelector(".gallery").innerHTML = "";

        let nomCategorie = e.target.getAttribute("class");

        /* Appelle Fetch pour gestion images */
        const promise1 = fetch("http://localhost:5678/api/works");
        promise1
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            let imagesFiltrees = [];

            if (nomCategorie !== "Tous") {
              for (let i = 0; i < data.length; i++) {
                let categorie = data[i].category.name;

                if (categorie === nomCategorie) {
                  imagesFiltrees.push(data[i]);
                }
              }
            } else {
              imagesFiltrees = data;
            }

            const gallery = document.querySelector(".gallery");

            const imagesData = imagesFiltrees.map((images) => {
              return ` <figure>
                              <img src=${images.imageUrl} alt="Abajour Tahina" crossorigin="Access-Control-Allow-Origin" />
                              <figcaption>${images.title}</figcaption>
                          </figure>`;
            });

            gallery.innerHTML = imagesData.join("");
          })
          .catch((err) => console.log(err));
      });
    }
  });
