package main

import (
	"log"
	"net/http"

	"crud_withGo_dlloWeb_20232/controllers"
	hand "crud_withGo_dlloWeb_20232/handlers"
	"crud_withGo_dlloWeb_20232/models"
	repositorio "crud_withGo_dlloWeb_20232/repository"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

// Funcion de conexion a la DB
func DB_connect(url, driver string) (*sqlx.DB, error) {
	pgUrl, _ := pq.ParseURL(url)
	db, err := sqlx.Connect(driver, pgUrl) //Driver Postgres
	if err != nil {
		log.Printf("Fallo la conezxion a la DB, error: %s", err.Error())
		return nil, err
	}
	log.Printf("Conexion exitosa %#v", db)
	return db, nil
}

func main() {

	/* creando un objeto de conexión a PostgreSQL */
	db, err := DB_connect("postgres://xgaxamzj:NdEgmh9DstMtdCDi0X-ffX41u3YhiSTx@bubble.db.elephantsql.com/xgaxamzj", "postgres")
	if err != nil {
		log.Fatalln("error conectando a la base de datos", err.Error())
		return
	}

	/* creando una instancia del tipo Repository del paquete repository
	se debe especificar el tipo de struct que va a manejar la base de datos
	para este ejemplo es Amigo y se le pasa como parámetro el objeto de
	conexión a PostgreSQL */
	repo, err := repositorio.NewRepository[models.Book](db)
	if err != nil {
		log.Fatalln("fallo al crear una instancia de repositorio", err.Error())
		return
	}

	controller, err := controllers.NewController(repo)
	if err != nil {
		log.Fatalln("fallo al crear una instancia de controller", err.Error())
		return
	}

	handler, err := hand.NewHandler(controller)
	if err != nil {
		log.Fatalln("fallo al crear una instancia de handler", err.Error())
		return
	}

	/* router (multiplexador) a los endpoints de la API (implementado con el paquete gorilla/mux) */
	router := mux.NewRouter()

	// Rutas relacionadas con libros
	router.Handle("/books", http.HandlerFunc(handler.ReadBooks)).Methods(http.MethodGet)
	router.Handle("/books", http.HandlerFunc(handler.CreateBook)).Methods(http.MethodPost)
	router.Handle("/books/{id}", http.HandlerFunc(handler.ReadBookById)).Methods(http.MethodGet)
	router.Handle("/books/{id}", http.HandlerFunc(handler.UpdateBookById)).Methods(http.MethodPatch)
	router.Handle("/books/{id}", http.HandlerFunc(handler.DeleteBookById)).Methods(http.MethodDelete)
	router.Handle("/books/categories/{category}", http.HandlerFunc(handler.ReadBookByCategory)).Methods(http.MethodGet)
	router.Handle("/books/names/{title}", http.HandlerFunc(handler.ReadBookByName)).Methods(http.MethodGet)

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS", "PATCH", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})
	http.ListenAndServe(":8080", handlers.CORS(headers, methods, origins)(router))
}

// {
// 	"genero"  : "Historical Fiction",
// 	"etag": "test 2",
// 	"title" :"test",
// 	"subtitle"    :"test",
// 	"authors"   :"test",
// 	"publisher"     :"test",
// 	"published_date"   :"test",
// 	"description"     :"test",
// 	"page_count"      :"test",
// 	"print_type"      :"test",
// 	"categories"      :"test",
// 	"maturity_rating"  :"test",
// 	"language"    :"test",
// 	"pdf_download_link" :"test",
// 	"thumbnail"     :"test"
// }
