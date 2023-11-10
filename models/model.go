package models

type Book struct {
	Genero          string   `json:"genero"`
	ID              uint     `json:"id"`
	Etag            string   `json:"etag"`
	Title           string   `json:"title"`
	Subtitle        string   `json:"subtitle"`
	Authors         []string `json:"authors"`
	Publisher       string   `json:"publisher"`
	PublishedDate   string   `json:"published_date"`
	Description     string   `json:"description"`
	PageCount       uint     `json:"pageCount"`
	PrintType       string   `json:"printType"`
	Categories      []string `json:"categories"`
	MaturityRating  string   `json:"maturityRating"`
	Language        string   `json:"language"`
	PDFDownloadLink string   `json:"pdf_download_link"`
	Thumbnail       string   `json:"thumbnail"`
}
