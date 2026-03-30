# Usar una imagen base de Python
FROM python:3.13-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de requisitos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código al contenedor (incluyendo el directorio app/)
COPY . .

# Exponer el puerto
EXPOSE 8000

# Comando para ejecutar la aplicación con el módulo correcto
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]