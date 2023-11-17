package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"crud_withGo_dlloWeb_20232/models"
	repositorio "crud_withGo_dlloWeb_20232/repository"
)

var (
	updateQuery    = "UPDATE books_table SET %s WHERE id=:id"
	deleteQuery    = "DELETE FROM books_table WHERE id=$1;"
	readByIdQuery  = "SELECT * FROM books_table WHERE id=$1;"
	readByCategory = "SELECT * FROM books_table WHERE categories=%s LIMIT $1 OFFSET $2;"
	readByNAme     = "SELECT * FROM books_table WHERE title=%s LIMIT $1 OFFSET $2;"
	readAllQuery   = "SELECT * FROM books_table limit $1 offset $2"
	createQuery    = "INSERT INTO books_table (genero,etag,title,subtitle,authors,publisher,published_date,description,page_count,print_type,categories,maturity_rating,language,pdf_download_link,thumbnail) VALUES (:genero, :etag, :title, :subtitle, :authors, :publisher, :published_date, :description, :page_count, :print_type, :categories, :maturity_rating, :language, :pdf_download_link, :thumbnail) RETURNING id"
)

type Controller struct {
	repo repositorio.Repository[models.Book]
}

func NewController(repo repositorio.Repository[models.Book]) (*Controller, error) {
	if repo == nil {
		return nil, fmt.Errorf("para instanciar un controlador se necesita un repositorio no nulo")
	}
	return &Controller{
		repo: repo,
	}, nil
}

func construirUpdateQuery(nuevosValoresLibro map[string]any) string {
	columns := []string{}
	for key := range nuevosValoresLibro {
		columns = append(columns, fmt.Sprintf("%s=:%s", key, key))
	}
	columnsString := strings.Join(columns, ",")
	return fmt.Sprintf(updateQuery, columnsString)
}

func construirSelecByCategorytQuery(category string) string {
	formattedCategory := fmt.Sprintf("'%s'", category)
	return fmt.Sprintf(readByCategory, formattedCategory)
}

func construirSelecByNametQuery(title string) string {
	formattedName := fmt.Sprintf("'%s'", title)
	return fmt.Sprintf(readByNAme, formattedName)
}

func (c *Controller) UpdateBookById(reqBody []byte, id string) error {
	nuevosValoresLibro := make(map[string]any)
	err := json.Unmarshal(reqBody, &nuevosValoresLibro)
	if err != nil {
		log.Printf("fallo al actualizar un libro, con error: %s", err.Error())
		return fmt.Errorf("fallo al actualizar un libro, con error: %s", err.Error())
	}

	if len(nuevosValoresLibro) == 0 {
		log.Printf("fallo al actualizar un libro, con error: %s", err.Error())
		return fmt.Errorf("fallo al actualizar un libro, con error: %s", err.Error())
	}

	query := construirUpdateQuery(nuevosValoresLibro)
	nuevosValoresLibro["id"] = id
	err = c.repo.Update(context.TODO(), query, nuevosValoresLibro)
	if err != nil {
		log.Printf("fallo al actualizar un libro, con error: %s", err.Error())
		return fmt.Errorf("fallo al actualizar un libro, con error: %s", err.Error())
	}
	return nil
}

func (c *Controller) DeleteBookById(id string) error {
	err := c.repo.Delete(context.TODO(), deleteQuery, id)
	if err != nil {
		log.Printf("fallo al eliminar un libro, con error: %s", err.Error())
		return fmt.Errorf("fallo al eliminar un libro, con error: %s", err.Error())
	}
	return nil
}

func (c *Controller) ReadBooks(limit, offset int) ([]byte, error) {

	books, _, err := c.repo.List(context.TODO(), readAllQuery, limit, offset)
	if err != nil {
		log.Printf("fallo al leer los libros, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer los libros, con error: %s", err.Error())
	}

	jsonBooks, err := json.Marshal(books)
	if err != nil {
		log.Printf("fallo al leer los libros, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer los libros, con error: %s", err.Error())
	}
	return jsonBooks, nil
}

func (c *Controller) CreateBook(reqBody []byte) (int64, error) {

	newBook := &models.Book{}
	err := json.Unmarshal(reqBody, newBook)
	if err != nil {
		log.Printf("fallo al crear un nuevo libro, con error: %s", err.Error())
		return 0, fmt.Errorf("fallo al crear un nuevo libro, con error: %s", err.Error())
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

	nuevoId, err := c.repo.Create(context.TODO(), createQuery, valoresColumnasNuevoLibro)
	if err != nil {
		log.Printf("fallo al crear un nuevo libro, con error: %s", err.Error())
		return 0, fmt.Errorf("fallo al crear un nuevo libro, con error: %s", err.Error())
	}
	return nuevoId, nil
}

func (c *Controller) ReadBookById(id string) ([]byte, error) {

	book, err := c.repo.Read(context.TODO(), readByIdQuery, id)
	if err != nil {
		log.Printf("fallo al leer un libro, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un libro, con error: %s", err.Error())
	}

	libroJson, err := json.Marshal(book)
	if err != nil {
		log.Printf("fallo al leer un libro, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un libro, con error: %s", err.Error())
	}
	return libroJson, nil
}

func (c *Controller) ReadBookByCategory(category string) ([]byte, error) {

	query := construirSelecByCategorytQuery(category)

	book, _, err := c.repo.List(context.TODO(), query, 100, 0)
	if err != nil {
		log.Printf("fallo al leer un libro, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un libro, con error: %s", err.Error())
	}

	libroJson, err := json.Marshal(book)
	if err != nil {
		log.Printf("fallo al leer un libro, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un libro, con error: %s", err.Error())
	}
	return libroJson, nil
}

func (c *Controller) ReadBookByName(title string) ([]byte, error) {

	query := construirSelecByNametQuery(title)

	book, _, err := c.repo.List(context.TODO(), query, 100, 0)
	if err != nil {
		log.Printf("fallo al leer un libro, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un libro, con error: %s", err.Error())
	}

	libroJson, err := json.Marshal(book)
	if err != nil {
		log.Printf("fallo al leer un libro, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un libro, con error: %s", err.Error())
	}
	return libroJson, nil
}
