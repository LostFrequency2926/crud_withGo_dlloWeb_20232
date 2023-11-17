package models

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
