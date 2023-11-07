package main

import (
	"encoding/json"
	"io"
	"net/http"
)

type empleado struct {
	Nombre    string `json:"nombre"`
	Edad      string `json:"Edad"`
	CC        uint   `json:"CC"`
	Cargo     string `json:"cargo"`
	Activo    bool   `json:"activo"`
	Direccion string `json:"direccion"`
}

type BaseDatosEmpleados struct {
	Empleados map[uint64]empleado
	proximoId uint64
}

func (bd *BaseDatosEmpleados) consultarEmpleado(writer http.ResponseWriter, req *http.Request) {
	writer.Write([]byte("Se leyo el empleado correctamente"))
}

func (bd *BaseDatosEmpleados) crearEmpleado(writer http.ResponseWriter, req *http.Request) {
	bd.proximoId++
	nuevoEmpleado := &empleado{}
	body, err := io.ReadAll(req.Body)
	if err != nil {
		bd.proximoId--
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusBadRequest)
	}
	err = json.Unmarshal(body, nuevoEmpleado)
	if err != nil {
		bd.proximoId--
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
	}
	bd.Empleados[bd.proximoId] = *nuevoEmpleado
	writer.WriteHeader(http.StatusCreated)
}

func (bd *BaseDatosEmpleados) leerEmpleado(writer http.ResponseWriter, req *http.Request) {
	empleados := []empleado{}
	for _, empleado := range bd.Empleados {
		empleados = append(empleados, empleado)
	}
	jsonEmpleados, err := json.Marshal(empleados)
	if err != nil {
		bd.proximoId--
		http.Error(writer, "Fallo al procesar la solicitud", http.StatusInternalServerError)
	}

	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(jsonEmpleados)
}

func main() {
	bd := BaseDatosEmpleados{
		proximoId: uint64(1),
		Empleados: make(map[uint64]empleado),
	}

	http.HandleFunc("/empleados", func(writer http.ResponseWriter, req *http.Request) {
		switch req.Method {
		case http.MethodGet:
			bd.leerEmpleado(writer, req)
		case http.MethodPost:
			bd.crearEmpleado(writer, req)
		default:
			http.Error(writer, "Metodo no permitido", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/goserver", func(writer http.ResponseWriter, req *http.Request) {
		switch req.Method {
		case http.MethodGet:
			writer.WriteHeader(http.StatusOK)
			writer.Write([]byte("Hicieste petición GET"))
		case http.MethodPost:
			writer.WriteHeader(http.StatusCreated)
			writer.Write([]byte("Hicieste petición POST"))
		default:
			http.Error(writer, "Metodo no permitido", http.StatusMethodNotAllowed)
		}
	})

	http.ListenAndServe(":8080", nil)

}
