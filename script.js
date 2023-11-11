//Esta funcion se usa para asegurarse que el JS se usara luego de que todo el codigo HTML se haya cargado
document.addEventListener("DOMContentLoaded", function () {
  // Definimos el boton de busqueda
  const searchButton = document.getElementById("searchButton");
  // DEfinimos el boton del popup de error
  const popupAcceptButton = document.getElementById("popup-accept-button");
  // Definimos el input que recibe el nombre del pokemon
  const searchInput = document.getElementById("searchInput");
  // texto e icono para ir al home
  const homeLink = document.getElementById("home-link");
  const homeText = document.getElementById("home-text");
  const homeContainer = document.getElementById("container-home");

  // Declaramos el container que se encargara de mostrar el contenido dinamico, se declara desde aca para que sea accesible desde cualquier funcion
  const containerDinamico = document.getElementById("container-dinamico");

  async function getAllBooks() {
    try {
      const response = await axios.get(`http://localhost:8080/books`);
      const books = response.data;
      const booksJson = JSON.stringify(books)
      //console.log(booksJson)
  
      // Itera sobre cada libro y crea una card
      books.forEach(book => {
        const cardHtml = `
          <div class="card">
            <h2>${book.title}</h2>
            <p><strong>Editorial:</strong> ${book.publisher}</p>
            <p><strong>Año de lanzamiento:</strong> ${book.published_date}</p>
            <p><strong>Autor:</strong> ${book.authors}</p>
            <p><strong>Descripción:</strong> ${book.description}</p>
            <p><strong>Categoría:</strong> ${book.categories}</p>
            <img src="${book.thumbnail}" alt="Portada del libro">
            <p><strong>Enlace de descarga:</strong> ${book.pdf_download_link}</p>
          </div>
        `;
  
        // Inserta la card en el contenedor deseado (puedes cambiar esto según tu estructura HTML)
        document.getElementById('booksContainer').innerHTML += cardHtml;
      });
  
    } catch (error) {
      console.log(error);
    }
  }
  
  // Llama a la función para obtener y mostrar los libros
  getAllBooks();
  
  
});
