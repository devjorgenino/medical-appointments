import psycopg2
from passlib.context import CryptContext

# Configuración de la conexión a la base de datos
db_params = {
    "dbname": "medical_appointments",
    "user": "user",
    "password": "password",
    "host": "db",
    "port": "5432"
}

# Configuración de passlib
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Datos del usuario admin
email = "admin@admin.com"
password = "admin"
hashed_password = pwd_context.hash(password)

# Aquí asumimos que el rol 'admin' tiene id = 1
# (debes asegurarte de que existe en la tabla 'roles')
role_id = 1

# Otros campos opcionales
nombre = "Administrador"
apellido = "Principal"
numero_telefono = "000000000"
direccion = "N/A"
sexo = "Otro"

conn = None
cursor = None

try:
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    insert_query = """
    INSERT INTO users (
        email, hashed_password, nombre, apellido, numero_telefono,
        direccion, sexo, role_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(insert_query, (
        email, hashed_password, nombre, apellido, numero_telefono,
        direccion, sexo, role_id
    ))

    conn.commit()
    print(f"Usuario '{email}' con rol_id '{role_id}' creado exitosamente.")

except Exception as e:
    print(f"Error al conectar o insertar en la base de datos: {e}")

finally:
    if conn:
        conn.close()
    if cursor:
        cursor.close()

