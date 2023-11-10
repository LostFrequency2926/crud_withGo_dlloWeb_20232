package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	repositorio "crud_withGo_dlloWeb_20232/repository"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type Book struct {
	ID              uint   `db:"id" json:"id"`
	Genero          string `db:"genero" json:"genero"`
	Etag            string `db:"etag" json:"etag"`
	Title           string `db:"title" json:"title"`
	Subtitle        string `db:"subtitle" json:"subtitle"`
	Authors         string `db:"authors" json:"authors"`
	Publisher       string `db:"publisher" json:"publisher"`
	PublishedDate   string `db:"published_date" json:"published_date"`
	Description     string `db:"description" json:"description"`
	PageCount       string `db:"page_count" json:"page_count"`
	PrintType       string `db:"print_type" json:"print_type"`
	Categories      string `db:"categories" json:"categories"`
	MaturityRating  string `db:"maturity_rating" json:"maturity_rating"`
	Language        string `db:"language" json:"language"`
	PDFDownloadLink string `db:"pdf_download_link" json:"pdf_download_link"`
	Thumbnail       string `db:"thumbnail" json:"thumbnail"`
}

type Database struct {
	nextID uint64
	repo   repositorio.Repository[Book]
}

func (db *Database) createBook(writer http.ResponseWriter, req *http.Request) {
	newBook := &Book{}
	body, err := io.ReadAll(req.Body)
	if err != nil {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusBadRequest)
		log.Fatalf(err.Error())
		return
	}
	err = json.Unmarshal(body, newBook)
	if err != nil {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
		log.Fatalf(err.Error())
		return
	}

	valoresColumnasNuevoLibro := map[string]any{
		"genero":            newBook.Genero,
		"etag":              newBook.Etag,
		"title":             newBook.Title,
		"subtitle":          newBook.Subtitle,
		"authors":           newBook.Authors,
		"publisher":         newBook.Publisher,
		"published_date":    newBook.PublishedDate,
		"description":       newBook.Description,
		"page_count":        newBook.PageCount,
		"print_type":        newBook.PrintType,
		"categories":        newBook.Categories,
		"maturity_rating":   newBook.MaturityRating,
		"language":          newBook.Language,
		"pdf_download_link": newBook.PDFDownloadLink,
		"thumbnail":         newBook.Thumbnail,
	}
	query := "INSERT INTO books_table (genero,etag,title,subtitle,authors,publisher,published_date,description,page_count,print_type,categories,maturity_rating,language,pdf_download_link,thumbnail) VALUES (:genero, :etag, :title, :subtitle, :authors, :publisher, :published_date, :description, :page_count, :print_type, :categories, :maturity_rating, :language, :pdf_download_link, :thumbnail) RETURNING id"

	nuevoId, err := db.repo.Create(context.TODO(), query, valoresColumnasNuevoLibro)
	if err != nil {
		log.Println(writer, "Fallo al agregar un nuevo libro", err.Error())
		http.Error(writer, "Fallo al crear libro", http.StatusInternalServerError)
	}
	writer.WriteHeader(http.StatusCreated)
	writer.Write([]byte(fmt.Sprintf("id nuevo libro %d", nuevoId)))
}

func (db *Database) readBooks(writer http.ResponseWriter, req *http.Request) {
	query := "SELECT * FROM books_table limit $1 offset $2"
	books, _, err := db.repo.List(context.TODO(), query, 100, 0)
	if err != nil {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
		return
	}
	jsonBooks, err := json.Marshal(books)
	if err != nil {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(jsonBooks)
}

func (db *Database) updateBookById(writer http.ResponseWriter, req *http.Request) {

	vars := mux.Vars(req)
	id := vars["id"]
	body, err := io.ReadAll(req.Body)
	if err != nil {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
	}
	defer req.Body.Close()
	nuevosVAloresLibro := make(map[string]any)
	err = json.Unmarshal(body, &nuevosVAloresLibro)
	if err != nil {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
		return
	}

	if len(nuevosVAloresLibro) == 0 {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
		return
	}

	query := "UPDATE books_table SET %s WHERE id=:id"
	columns := []string{}
	for key := range nuevosVAloresLibro {
		columns = append(columns, fmt.Sprintf("%s=:%s", key, key))
	}
	columnsStrings := strings.Join(columns, ",")
	realQuery := fmt.Sprintf(query, columnsStrings)
	nuevosVAloresLibro["id"] = id
	err = db.repo.Update(context.TODO(), realQuery, nuevosVAloresLibro)
	if err != nil {
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
}

func (db *Database) readBookById(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id := vars["id"]
	query := "SELECT * FROM books_table WHERE id=$1;"
	book, err := db.repo.Read(context.TODO(), query, id)
	if err != nil {
		writer.WriteHeader(http.StatusNotFound)
		writer.Write([]byte(fmt.Sprintf("Fallo al leer el libro con id %s", id)))
		log.Fatalln(err.Error())
		return
	}
	bookJson, err := json.Marshal(book)
	if err != nil {
		http.Error(writer, "Falla al codificar los datos", http.StatusInternalServerError)
		log.Fatalln(err.Error())
		return
	}
	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(bookJson)
}

func (db *Database) readBookByCategory(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	category := vars["category"]

	// Formatear el valor de category para asegurarse de que esté correctamente escapado
	formattedCategory := fmt.Sprintf("'%s'", category)

	query := fmt.Sprintf("SELECT * FROM books_table WHERE categories=%s LIMIT $1 OFFSET $2;", formattedCategory)

	books, _, err := db.repo.List(context.TODO(), query, 100, 0)
	if err != nil {
		writer.WriteHeader(http.StatusNotFound)
		writer.Write([]byte(fmt.Sprintf("Fallo al leer el libro con id %s", category)))
		log.Fatalln(err.Error())
		return
	}
	bookJson, err := json.Marshal(books)
	if err != nil {
		http.Error(writer, "Falla al codificar los datos", http.StatusInternalServerError)
		log.Fatalln(err.Error())
		return
	}
	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(bookJson)
}

func (db *Database) deleteBookById(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id := vars["id"]

	query := "DELETE FROM books_table WHERE id=$1;"
	err := db.repo.Delete(context.TODO(), query, id)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte(fmt.Sprintf("Fallo al convertir el id %s", id)))
		return
	}
	writer.WriteHeader(http.StatusOK)
}

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

	dbSQL, err := DB_connect("postgres://xgaxamzj:NdEgmh9DstMtdCDi0X-ffX41u3YhiSTx@bubble.db.elephantsql.com/xgaxamzj", "postgres")

	if err != nil {
		log.Fatalln("Error al intentar la conexion a la DB", err.Error())
		return
	}

	repo, err := repositorio.NewRepository[Book](dbSQL)
	if err != nil {
		log.Fatalln("Falla al crear la instancia")
		return
	}

	db := Database{
		nextID: 0,
		repo:   repo,
	}

	router := mux.NewRouter()

	// Rutas relacionadas con libros
	router.Handle("/books", http.HandlerFunc(db.readBooks)).Methods(http.MethodGet)
	router.Handle("/books", http.HandlerFunc(db.createBook)).Methods(http.MethodPost)
	router.Handle("/books/{id}", http.HandlerFunc(db.readBookById)).Methods(http.MethodGet)
	router.Handle("/books/{id}", http.HandlerFunc(db.updateBookById)).Methods(http.MethodPatch)
	router.Handle("/books/{id}", http.HandlerFunc(db.deleteBookById)).Methods(http.MethodDelete)
	router.Handle("/books/categories/{category}", http.HandlerFunc(db.readBookByCategory)).Methods(http.MethodGet)

	http.ListenAndServe(":8080", router)
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
