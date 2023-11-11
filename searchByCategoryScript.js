//Esta funcion se usa para asegurarse que el JS se usara luego de que todo el codigo HTML se haya cargado
document.addEventListener("DOMContentLoaded", function () {
    // Definimos el boton de busqueda
    const searchButton = document.getElementById("search-button");
    const bookCategory = document.getElementById("bookToSearch");
   
    async function getABookByCategory(bookCategory) {
      try {
        console.log(bookCategory)
        const response = await axios.get(`http://localhost:8080/books/categories/${bookCategory}`);
        const books = response.data;
        const booksJson = JSON.stringify(books)
        //console.log(booksJson)
    
        // Itera sobre cada libro y crea una card
        books.forEach(book => {
          const cardHtml = `
            <div class="card">
              <h2>${book.title}</h2>
              <img src="${book.thumbnail}" alt="Portada del libro">
              <p><strong>Editorial:</strong> ${book.publisher}</p>
              <p><strong>Año de lanzamiento:</strong> ${book.published_date}</p>
              <p><strong>Autor:</strong> ${book.authors}</p>
              <p><strong>Descripción:</strong> ${book.description}</p>
              <p><strong>Categoría:</strong> ${book.categories}</p>
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
    
    searchButton.addEventListener("click", async function() {

        const Category = bookCategory.value;
        // Llama a la función para obtener y mostrar los libros
        getABookByCategory(Category);
        console.log(Category)
    });
    
    
  });
  