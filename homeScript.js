//Esta funcion se usa para asegurarse que el JS se usara luego de que todo el codigo HTML se haya cargado
document.addEventListener("DOMContentLoaded", function () {
  const searchButtonName = document.getElementById("search-button-name");
  const bookName = document.getElementById("nameBookToSearch");

  const searchButtonCategory = document.getElementById(
    "search-button-category"
  );
  const bookCategory = document.getElementById("categoryBookToSearch");

  // Capturando referencias a cada elemento por su ID
  const genreInput = document.getElementById("genre");
  const etagInput = document.getElementById("etag");
  const titleInput = document.getElementById("title");
  const subtitleInput = document.getElementById("subtitle");
  const authorsInput = document.getElementById("authors");
  const publisherInput = document.getElementById("publisher");
  const publishedDateInput = document.getElementById("published_date");
  const descriptionTextarea = document.getElementById("description");
  const pageCountInput = document.getElementById("page_count");
  const printTypeInput = document.getElementById("print_type");
  const categoriesInput = document.getElementById("categories");
  const maturityRatingInput = document.getElementById("maturity_rating");
  const languageInput = document.getElementById("language");
  const pdfDownloadLinkInput = document.getElementById("pdf_download_link");
  const thumbnailInput = document.getElementById("thumbnail");
  const addNewBookButton = document.getElementById("addNewBook");

  async function getAllBooks() {
    try {
      const response = await axios.get(`http://localhost:8080/books`);
      const books = response.data;
      const booksJson = JSON.stringify(books);
      //console.log(booksJson)

      document.getElementById("booksContainer").innerHTM = "";

      // Itera sobre cada libro y crea una card
      books.forEach((book) => {
        const cardHtml = `
          <div class="card" data-book-id="${book.id}">
            <div class="container">
              <div class="container-img">
                <img src="${book.thumbnail}" alt="Portada del libro">
              </div>
              <div class="card-info">
                <h2>${book.title}</h2>
                <p><strong>Editorial:</strong> ${book.publisher}</p>
                <p><strong>Año de lanzamiento:</strong> ${book.published_date}</p>
                <p><strong>Autor:</strong> ${book.authors}</p>
                <p><strong>Descripción:</strong> ${book.description}</p>
                <p><strong>Categoría:</strong> ${book.categories}</p>
              </div>
              <button class="delete-button" onclick="eliminarLibro('${book.id}')">Eliminar</button>
            </div>
          </div>
        `;

        // Inserta la card en el contenedor deseado (puedes cambiar esto según tu estructura HTML)
        document.getElementById("booksContainer").innerHTML += cardHtml;
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Llama a la función para obtener y mostrar los libros
  getAllBooks();

  async function getABookByName(bookName) {
    try {
      console.log(bookName);
      const response = await axios.get(
        `http://localhost:8080/books/names/${bookName}`
      );
      const books = response.data;
      const booksJson = JSON.stringify(books);
      //console.log(booksJson)

      document.getElementById("booksContainer").innerHTML = "";

      // Itera sobre cada libro y crea una card
      books.forEach((book) => {
        const cardHtml = `
          <div class="card" data-book-id="${book.id}">
            <div class="container">
              <div class="container-img">
                <img src="${book.thumbnail}" alt="Portada del libro">
              </div>
              <div class="card-info">
                <h2>${book.title}</h2>
                <p><strong>Editorial:</strong> ${book.publisher}</p>
                <p><strong>Año de lanzamiento:</strong> ${book.published_date}</p>
                <p><strong>Autor:</strong> ${book.authors}</p>
                <p><strong>Descripción:</strong> ${book.description}</p>
                <p><strong>Categoría:</strong> ${book.categories}</p>
              </div>
              <button class="delete-button">Eliminar</button>
            </div>
          </div>
        `;

        // Inserta la card en el contenedor deseado (puedes cambiar esto según tu estructura HTML)
        document.getElementById("booksContainer").innerHTML += cardHtml;
      });
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        console.log("Error de respuesta del servidor:", error.response.data);
    
        // Mostrar el mensaje en una ventana emergente
        window.alert(error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.log("No se recibió respuesta del servidor");
      } else {
        // Algo sucedió en la configuración de la solicitud que provocó un error
        console.error("Error al configurar la solicitud:", error.message);
      }
    }
    
  }
  
  searchButtonName.addEventListener("click", async function () {
    const book = bookName.value;
    // Llama a la función para obtener y mostrar los libros
    getABookByName(book);
    console.log(book);
    bookName.value = "";
  });

  async function getABookByCategory(bookCategory) {
    try {
      console.log(bookCategory);
      const response = await axios.get(
        `http://localhost:8080/books/categories/${bookCategory}`
      );
      const books = response.data;
      const booksJson = JSON.stringify(books);
      //console.log(booksJson)

      document.getElementById("booksContainer").innerHTML = "";

      // Itera sobre cada libro y crea una card
      books.forEach((book) => {
        const cardHtml = `
          <div class="card" data-book-id="${book.id}">
            <div class="container">
              <div class="container-img">
                <img src="${book.thumbnail}" alt="Portada del libro">
              </div>
              <div class="card-info">
                <h2>${book.title}</h2>
                <p><strong>Editorial:</strong> ${book.publisher}</p>
                <p><strong>Año de lanzamiento:</strong> ${book.published_date}</p>
                <p><strong>Autor:</strong> ${book.authors}</p>
                <p><strong>Descripción:</strong> ${book.description}</p>
                <p><strong>Categoría:</strong> ${book.categories}</p>
              </div>
              <button class="delete-button">Eliminar</button>
            </div>
          </div>
        `;

        // Inserta la card en el contenedor deseado (puedes cambiar esto según tu estructura HTML)
        document.getElementById("booksContainer").innerHTML += cardHtml;
      });
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        console.log("Error de respuesta del servidor:", error.response.data);
    
        // Mostrar el mensaje en una ventana emergente
        window.alert(error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.log("No se recibió respuesta del servidor");
      } else {
        // Algo sucedió en la configuración de la solicitud que provocó un error
        console.error("Error al configurar la solicitud:", error.message);
      }
    }
  }
  searchButtonCategory.addEventListener("click", async function () {
    const Category = bookCategory.value;
    // Llama a la función para obtener y mostrar los libros
    getABookByCategory(Category);
    console.log(Category);
    bookCategory.value = "";
  });

  async function addNewBook() {
    try {
      // Obtener los valores de los campos
      const genreValue = genreInput.value;
      const etagValue = etagInput.value;
      const titleValue = titleInput.value;
      const subtitleValue = subtitleInput.value;
      const authorsValue = authorsInput.value;
      const publisherValue = publisherInput.value;
      const publishedDateValue = publishedDateInput.value;
      const descriptionValue = descriptionTextarea.value;
      const pageCountValue = pageCountInput.value;
      const printTypeValue = printTypeInput.value;
      const categoriesValue = categoriesInput.value;
      const maturityRatingValue = maturityRatingInput.value;
      const languageValue = languageInput.value;
      const pdfDownloadLinkValue = pdfDownloadLinkInput.value;
      const thumbnailValue = thumbnailInput.value;
  
      // Crear un objeto con los valores de los campos que se enviarán en el cuerpo de la solicitud
      const postData = {
        "genero": `${genreValue}`,
        "etag": `${etagValue}`,
        "title": `${titleValue}`,
        "subtitle": `${subtitleValue}`,
        "authors": `${authorsValue}`,
        "publisher": `${publisherValue}`,
        "published_date": `${publishedDateValue}`,
        "description": `${descriptionValue}`,
        "page_count": `${pageCountValue}`,
        "print_type": `${printTypeValue}`,
        "categories": `${categoriesValue}`,
        "maturity_rating": `${maturityRatingValue}`,
        "language": `${languageValue}`,
        "pdf_download_link": `${pdfDownloadLinkValue}`,
        "thumbnail": `${thumbnailValue}`,
      };

      console.log(postData)
  
      // Realizar la solicitud POST utilizando Axios
      const response = await axios.post("http://localhost:8080/books", postData);
      // Manejar la respuesta si es necesario
      console.log("Solicitud POST exitosa:", response.data);
    } catch (error) {
      // Manejar errores en la solicitud
      console.error("Error en la solicitud POST:", error);
    }
  }
  addNewBookButton.addEventListener("click", async function () {
    const addBookForm = document.querySelector('#addBookForm form');

    addBookForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Evitar la recarga de la página
  
      // Tu lógica de manejo del formulario aquí, por ejemplo, llamar a la función para agregar un nuevo libro
      addNewBook();
  });
  })

  

  async function eliminarLibro(event) {
    // Obtiene el ID del libro desde el atributo de datos de la tarjeta
    const cardElement =
      event.target.closest(".card") || event.target.parentNode.closest(".card");
    const bookId = cardElement.dataset.bookId;

    // Realiza la solicitud de eliminación utilizando Axios
    axios
      .delete(`http://localhost:8080/books/${bookId}`)
      .then((response) => {
        // Maneja la respuesta según sea necesario
        console.log(`Libro con ID ${bookId} eliminado`);
        document.getElementById("booksContainer").innerHTML = "";

        // Mostrar el mensaje en una ventana emergente
        window.alert("Libro Eliminado");

        // Aquí puedes actualizar la interfaz de usuario si es necesario
        getAllBooks();
      })
      .catch((error) => {
        console.error(`Error al eliminar el libro con ID ${bookId}`, error);
      });
  }
  // Agrega un listener al documento para manejar el evento click en cualquier botón de eliminar
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      eliminarLibro(event);
    }
  });
});
