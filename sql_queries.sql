-- Crear Tabla en la DB
CREATE TABLE mombre_tabla(
    column1 tipo_dato
    column2 tipo_dato
    column3 tipo_dato
    column4 tipo_dato
    column5 tipo_dato
    );

-- Eliminar Tabla
DROP TABLE nombre_tabla;

-- Insertar Filas en la Tabla
INSERT INTO nombre_tabla (col1,col2, ... , coln) VALUES (valor_col1,valor_col1, ... , valor_coln) returning id

-- Leer Registro en la Tabla
SELECT * FROM nombre_tabla 
SELECT col1,col2, ... , coln FROM nombre_tabla 
SELECT col1,col2, ... , coln FROM nombre_tabla WHERE condicion
SELECT col1,col2, ... , coln FROM nombre_tabla 

-- Ordenar Registros
ORDER BY ASC DESC

-- Agrupar Registros
GROUP BY 

--Lectura por lotes
SELECT col1,col2, ... , coln FROM nombre_tabla  LIMIT 100

--DEcidir a partir de que fila leer
SELECT col1,col2, ... , coln FROM nombre_tabla  LIMIT 100 OFFSET 2500

--Actualizar el Valor de Una o Varias celdas
UPDATE nombre_tabla SET col1=newVal1, col2=newVal2 WHERE condicion

--ELiminar una Fila de la Tabla
DELETE FROM nombre_tabla WHERE condicion