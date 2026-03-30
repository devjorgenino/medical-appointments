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

conn = None
cursor = None

try:
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    # Insertar doctor para el usuario doctor@medical.com (id=8)
    print("Insertando doctor para user_id=8...")
    cursor.execute("""
        INSERT INTO doctors (user_id, especialidad) 
        VALUES (8, 'Cardiología')
        ON CONFLICT (user_id) DO NOTHING
    """)
    
    # Insertar patient para el usuario patient@medical.com (id=9)
    print("Insertando patient para user_id=9...")
    cursor.execute("""
        INSERT INTO patients (user_id, fecha_nacimiento) 
        VALUES (9, '1990-01-01')
        ON CONFLICT (user_id) DO NOTHING
    """)

    # Crear algunos horarios de ejemplo para el doctor
    print("Insertando horarios para el doctor...")
    
    # Primero obtener el ID del doctor
    cursor.execute("SELECT id FROM doctors WHERE user_id = 8")
    doctor_result = cursor.fetchone()
    
    if doctor_result:
        doctor_id = doctor_result[0]
        print(f"Doctor ID encontrado: {doctor_id}")
        
        # Insertar horarios para lunes a viernes
        days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
        for day in days:
            cursor.execute("""
                INSERT INTO schedules (day, time_slots, is_enabled, doctor_id) 
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (day, doctor_id) DO UPDATE SET
                time_slots = EXCLUDED.time_slots,
                is_enabled = EXCLUDED.is_enabled
            """, (
                day,
                [
                    {"start_time": "09:00", "end_time": "09:30"},
                    {"start_time": "09:30", "end_time": "10:00"},
                    {"start_time": "10:00", "end_time": "10:30"},
                    {"start_time": "10:30", "end_time": "11:00"},
                    {"start_time": "11:00", "end_time": "11:30"},
                    {"start_time": "11:30", "end_time": "12:00"},
                    {"start_time": "16:00", "end_time": "16:30"},
                    {"start_time": "16:30", "end_time": "17:00"},
                    {"start_time": "17:00", "end_time": "17:30"},
                    {"start_time": "17:30", "end_time": "18:00"},
                ],
                True,
                doctor_id
            ))
        
        print(f"Horarios insertados para doctor_id={doctor_id}")
    else:
        print("No se encontró doctor_id para user_id=8")

    # Obtener el ID del patient
    cursor.execute("SELECT id FROM patients WHERE user_id = 9")
    patient_result = cursor.fetchone()
    
    if patient_result:
        patient_id = patient_result[0]
        print(f"Patient ID encontrado: {patient_id}")
    else:
        print("No se encontró patient_id para user_id=9")

    conn.commit()
    print("Datos de prueba insertados exitosamente.")

except Exception as e:
    print(f"Error: {e}")
    conn.rollback()

finally:
    if conn:
        conn.close()
    if cursor:
        cursor.close()