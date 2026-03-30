# CitasMedicas - Sistema de Gestión de Citas Médicas

Plataforma integral para la gestión de citas médicas, desarrollada con una arquitectura moderna basada en microservicios.

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker)

## Características

- **Gestión de Usuarios**: Control de acceso basado en roles (Administrador, Doctor, Paciente)
- **Autenticación Segura**: JWT con tokens de acceso y refresh, protección de contraseñas con bcrypt
- **Citas Médicas**: Programación, cancelación y seguimiento de citas
- **Gestión de Horarios**: Administración de disponibilidad de doctores
- **Panel de Dashboard**: Estadísticas en tiempo real con gráficos interactivos
- **Notificaciones por Email**: Confirmación y recordatorios de citas
- **API RESTful**: Documentación interactiva con Swagger UI
- **Seguridad**: Rate limiting, headers de seguridad, CORS configurado

## Tecnologías

### Backend
- **Framework**: FastAPI
- **Base de Datos**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migraciones**: Alembic
- **Autenticación**: JWT (python-jose)
- **Validación**: Pydantic

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Gestión de Estado**: TanStack Query
- **Enrutamiento**: React Router DOM
- **Gráficos**: Recharts
- **Fechas**: date-fns + react-day-picker

## Requisitos Previos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local sin Docker)
- Python 3.11+ (para desarrollo local sin Docker)
- PostgreSQL 15+ (para desarrollo local sin Docker)

## Instalación

### Usando Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/CitasMedicas.git
cd CitasMedicas

# Configurar variables de entorno
cp backend/example.env backend/.env
# Editar backend/.env con tus configuraciones

# Iniciar los servicios
docker-compose up --build
```

### Desarrollo Local

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Configuración

### Variables de Entorno del Backend

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Conexión a PostgreSQL | postgresql://user:password@localhost:5432/medical_appointments |
| `SECRET_KEY` | Clave secreta para JWT | - |
| `ALGORITHM` | Algoritmo de firma JWT | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token | 30 |
| `SMTP_HOST` | Servidor de correo | - |
| `SMTP_PORT` | Puerto SMTP | 587 |
| `SMTP_USER` | Usuario SMTP | - |
| `SMTP_PASSWORD` | Contraseña SMTP | - |
| `FRONTEND_URL` | URL del frontend | http://localhost:5173 |
| `ALLOWED_ORIGINS` | Origins permitidos para CORS | http://localhost:5173 |
| `ENVIRONMENT` | Entorno de ejecución | development |

## Estructura del Proyecto

```
CitasMedicas/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py              # Punto de entrada de la API
│   ├── auth/                    # Módulo de autenticación
│   ├── users/                   # Gestión de usuarios
│   ├── roles/                   # Gestión de roles
│   ├── doctors/                 # Gestión de doctores
│   ├── patients/                # Gestión de pacientes
│   ├── appointments/            # Citas médicas
│   ├── schedules/               # Horarios
│   ├── dashboard/              # Estadísticas
│   ├── profile/                # Perfil de usuario
│   ├── alembic/                # Migraciones de base de datos
│   ├── database.py             # Configuración de DB
│   ├── requirements.txt        # Dependencias Python
│   └── Dockerfile
├── frontend/
│   ├── app/                    # Páginas de la aplicación
│   ├── components/             # Componentes React
│   ├── lib/                    # Utilidades y configuración
│   ├── package.json            # Dependencias Node
│   ├── vite.config.ts          # Configuración de Vite
│   ├── tailwind.config.js      # Configuración de Tailwind
│   └── Dockerfile
├── docker-compose.yml          # Orquestación de servicios
└── README.md
```

## Endpoints Principales

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/refresh` - Actualizar token
- `POST /auth/forgot-password` - Recuperar contraseña

### Usuarios
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

### Doctores
- `GET /doctors` - Listar doctores
- `POST /doctors` - Crear doctor
- `PUT /doctors/{id}` - Actualizar doctor
- `DELETE /doctors/{id}` - Eliminar doctor

### Pacientes
- `GET /patients` - Listar pacientes
- `POST /patients` - Crear paciente
- `PUT /patients/{id}` - Actualizar paciente

### Citas
- `GET /appointments` - Listar citas
- `POST /appointments` - Crear cita
- `PUT /appointments/{id}` - Actualizar cita
- `DELETE /appointments/{id}` - Cancelar cita

### Horarios
- `GET /schedules` - Listar horarios
- `POST /schedules` - Crear horario
- `PUT /schedules/{id}` - Actualizar horario

### Dashboard
- `GET /dashboard/stats` - Estadísticas generales
- `GET /dashboard/appointments` - Citas por período

## Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **Administrador** | Gestión completa de usuarios, doctores, pacientes y citas |
| **Doctor** | Gestión de horarios, vista de citas propias |
| **Paciente** | Solicitar citas, ver historial personal |

## API Documentation

Una vez iniciado el backend, accede a:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Scripts Disponibles

### Frontend
```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run lint     # Ejecutar linter
npm run preview  # Vista previa de producción
```

### Backend
```bash
python -m uvicorn app.main:app --reload  # Servidor de desarrollo
alembic upgrade head                      # Ejecutar migraciones
alembic revision --autogenerate          # Crear migración
```

## Licencia

MIT License - consulta el archivo LICENSE para más detalles.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir cambios.
