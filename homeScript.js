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

  const newBookIcon = document.getElementById("new-book-icon");
  const newBookForm = document.getElementById("addBookForm");

  newBookIcon.addEventListener("click", async function () {
    if (newBookForm.style.display == "grid") {
      newBookForm.style.display = "none";
    } else {
      newBookForm.style.display = "grid";
    }
  });

  async function getAllBooks() {

    document.getElementById("booksContainer").innerHTML = "";
    try {
      const response = await axios.get(`http://localhost:8080/books`);
      const books = response.data;
      const booksJson = JSON.stringify(books);
      //console.log(booksJson)

      // Itera sobre cada libro y crea una card
      books.forEach((book) => {
        const cardHtml = `
          <div class="card" data-book-id="${book.id}">
            <div class="container">
              <div class="container-img">
                <img src="${book.thumbnail}" alt="Book Cover">
              </div>
              <div class="card-info">
                <h2>${book.title}</h2>
                <p><strong>Publisher:</strong> ${book.publisher}</p>
                <p><strong>Release Year:</strong> ${book.published_date}</p>
                <p><strong>Author:</strong> ${book.authors}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Category:</strong> ${book.categories}</p>
              </div>
              <button class="delete-button">Delete</button>
              <button class="edit-button">Edit</button>
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
                <img src="${book.thumbnail}" alt="Book Cover">
              </div>
              <div class="card-info">
                <h2>${book.title}</h2>
                <p><strong>Publisher:</strong> ${book.publisher}</p>
                <p><strong>Release Year:</strong> ${book.published_date}</p>
                <p><strong>Author:</strong> ${book.authors}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Category:</strong> ${book.categories}</p>
              </div>
              <button class="delete-button">Delete</button>
              <button class="edit-button">Edit</button>
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
                <img src="${book.thumbnail}" alt="Book Cover">
              </div>
              <div class="card-info">
                <h2>${book.title}</h2>
                <p><strong>Publisher:</strong> ${book.publisher}</p>
                <p><strong>Release Year:</strong> ${book.published_date}</p>
                <p><strong>Author:</strong> ${book.authors}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Category:</strong> ${book.categories}</p>
              </div>
              <button class="delete-button">Delete</button>
              <button class="edit-button">Edit</button>
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
        genero: `${genreValue}`,
        etag: `${etagValue}`,
        title: `${titleValue}`,
        subtitle: `${subtitleValue}`,
        authors: `${authorsValue}`,
        publisher: `${publisherValue}`,
        published_date: `${publishedDateValue}`,
        description: `${descriptionValue}`,
        page_count: `${pageCountValue}`,
        print_type: `${printTypeValue}`,
        categories: `${categoriesValue}`,
        maturity_rating: `${maturityRatingValue}`,
        language: `${languageValue}`,
        pdf_download_link: `${pdfDownloadLinkValue}`,
        thumbnail: `${thumbnailValue}`,
      };

      console.log(postData);

      // Realizar la solicitud POST utilizando Axios
      const response = await axios.post(
        "http://localhost:8080/books",
        postData
      );
      // Manejar la respuesta si es necesario
      console.log("Solicitud POST exitosa:", response.data);

      // Recargar la página después de que la solicitud sea exitosa
      location.reload();

      // Mostrar el mensaje en una ventana emergente
      window.alert(`El libro ${titleValue} ha sido agregado`);
    } catch (error) {
      // Manejar errores en la solicitud
      console.error("Error en la solicitud POST:", error);
    }
  }
  addNewBookButton.addEventListener("click", async function () {
    const addBookForm = document.querySelector("#addBookForm form");

    addBookForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Evitar la recarga de la página

      // Tu lógica de manejo del formulario aquí, por ejemplo, llamar a la función para agregar un nuevo libro
      addNewBook();
    });
  });

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

  //Editar libro con formulario
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-button")) {
      mostrarFormularioEdicion(event);
    }
  });

  async function mostrarFormularioEdicion(event) {
    // Obtiene el ID del libro desde el atributo de datos de la tarjeta
    const cardElement =
      event.target.closest(".card") || event.target.parentNode.closest(".card");
    const bookId = cardElement.dataset.bookId;

    try {
      // Usa await para esperar a que la Promesa se resuelva
      const response = await axios.get(`http://localhost:8080/books/${bookId}`);

      // Obtén bookData de la respuesta
      const bookData = response.data;

      console.log(response);

      console.log(bookData);

      // Obtener el formulario del DOM
      const editForm = document.createElement("div");
      editForm.classList.add("edit-popup");

      // Agregar una clase de fondo oscuro al cuerpo del documento
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      document.body.appendChild(overlay);

      // Crear el formulario de edición con los datos del libro
      editForm.innerHTML = `
  <h2>Edit Book</h2>
  <form>
    <label for="edit_genre">Genre:</label>
    <input type="text" id="edit_genre" name="edit_genre" value="${bookData.genre}" required />

    <label for="edit_etag">ETag:</label>
    <input type="text" id="edit_etag" name="edit_etag" value="${bookData.etag}" required />

    <label for="edit_title">Title:</label>
    <input type="text" id="edit_title" name="edit_title" value="${bookData.title}" required />

    <label for="edit_subtitle">Subtitle:</label>
    <input type="text" id="edit_subtitle" name="edit_subtitle" value="${bookData.subtitle}" required />

    <label for="edit_authors">Authors:</label>
    <input type="text" id="edit_authors" name="edit_authors" value="${bookData.authors}" required />

    <label for="edit_publisher">Publisher:</label>
    <input type="text" id="edit_publisher" name="edit_publisher" value="${bookData.publisher}" required />

    <label for="edit_published_date">Published Date:</label>
    <input type="text" id="edit_published_date" name="edit_published_date" value="${bookData.published_date}" required />

    <label for="edit_description">Description:</label>
    <textarea id="edit_description" name="edit_description" required>${bookData.description}</textarea>

    <label for="edit_page_count">Page Count:</label>
    <input type="text" id="edit_page_count" name="edit_page_count" value="${bookData.page_count}" required />

    <label for="edit_print_type">Print Type:</label>
    <input type="text" id="edit_print_type" name="edit_print_type" value="${bookData.print_type}" required />

    <label for="edit_categories">Categories:</label>
    <input type="text" id="edit_categories" name="edit_categories" value="${bookData.categories}" required />

    <label for="edit_maturity_rating">Maturity Rating:</label>
    <input type="text" id="edit_maturity_rating" name="edit_maturity_rating" value="${bookData.maturity_rating}" required/>

    <label for="edit_language">Language:</label>
    <input type="text" id="edit_language" name="edit_language" value="${bookData.language}" required />

    <label for="edit_pdf_download_link">PDF Download Link:</label>
    <input type="text" id="edit_pdf_download_link" name="edit_pdf_download_link" value="${bookData.pdf_download_link}" required />

    <label for="edit_thumbnail">Thumbnail:</label>
    <input type="text" id="edit_thumbnail" name="edit_thumbnail" value="${bookData.thumbnail}" required />

    <div class="buttons-form">
      <button class="cancelButtonForm" id="cancelForm">Cancel</button>
      <button class="editButtonForm" id="updateBook">Update</button>
    </div>
  </form>
`;

      // Agregar el formulario al cuerpo del documento
      document.body.appendChild(editForm);

      // Puedes agregar un listener para el botón de actualización dentro del formulario de edición
      const updateButton = document.getElementById("updateBook");
      const cancelButton = document.getElementById("cancelForm");

      cancelButton.addEventListener("click", async function (event) {
        event.preventDefault();
        editForm.style.display = "none";
        overlay.style.display = "none";
      });
      updateButton.addEventListener("click", async function (event) {
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        const updatedBookData = {
          "genero": `${document.getElementById("edit_genre").value}`,
          "etag": `${document.getElementById("edit_etag").value}`,
          "title": `${document.getElementById("edit_title").value}`,
          "subtitle": `${document.getElementById("edit_subtitle").value}`,
          "authors": `${document.getElementById("edit_authors").value}`,
          "publisher": `${document.getElementById("edit_publisher").value}`,
          "published_date": `${document.getElementById("edit_published_date").value}`,
          "description": `${document.getElementById("edit_description").value}`,
          "page_count": `${document.getElementById("edit_page_count").value}`,
          "print_type": `${document.getElementById("edit_print_type").value}`,
          "categories": `${document.getElementById("edit_categories").value}`,
          "maturity_rating": `${document.getElementById("edit_maturity_rating").value}`,
          "language": `${document.getElementById("edit_language").value}`,
          "pdf_download_link": `${document.getElementById("edit_pdf_download_link").value}`,
          "thumbnail": `${document.getElementById("edit_thumbnail").value}`
        };

        await actualizarLibro(bookId, updatedBookData);

        editForm.style.display = "none";
        overlay.style.display = "none";

        getAllBooks()
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

  async function actualizarLibro(bookId, updatedBookData) {
    try {
      // Realizar la solicitud PATCH utilizando Axios
      const response = await axios.patch(
        `http://localhost:8080/books/${bookId}`,
        updatedBookData
      );
  
      // Manejar la respuesta según sea necesario
      console.log("Solicitud PATCH exitosa:", response.data);

      window.alert("Successfully edited book")
  
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        console.log("Error de respuesta del servidor:", error.response.data);
  
        // Mostrar el mensaje de error al usuario
        window.alert(error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.log("No se recibió respuesta del servidor");
  
        // Mostrar un mensaje de error genérico al usuario
        window.alert("Error al actualizar el libro. Inténtelo de nuevo más tarde.");
      } else {
        // Algo sucedió en la configuración de la solicitud que provocó un error
        console.error("Error al configurar la solicitud:", error.message);
  
        // Mostrar un mensaje de error genérico al usuario
        window.alert("Error al actualizar el libro. Inténtelo de nuevo más tarde.");
      }
    }
  }


  
});
