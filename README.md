# Proyecto VibeCoding

Aplicacion de pre-onboarding para Neo Consulting. Este repositorio contiene una SPA construida con React + Vite para registrar nuevos ingresos, separar el flujo entre colaboradores en planilla y trainees, y dar seguimiento administrativo desde un panel interno conectado a Supabase.

## Para usar la vista de admin, logearte con este usuario
Usuario: admin@neo.com.pe
Contraseña: TU_CONTRASEÑA_AQUI

## Contenido del repositorio

```text
ProyectoVibeCoding/
|-- neo-onboarding/   # Aplicacion principal (React + TypeScript + Vite)
`-- Vistas/           # Mockups, HTML de referencia, imagenes y plantillas originales
```

## Que hace el proyecto

- Permite que un usuario inicie sesion y complete su proceso de onboarding.
- Divide la experiencia en 2 flujos:
  - `planilla`: datos personales, EPS, Oncosalud, examen medico y revision.
  - `trainee`: datos personales, FOLA, Oncosalud y revision.
- Guarda avances parciales en Supabase para que el usuario pueda continuar luego.
- Sube la foto del colaborador a Supabase Storage.
- Bloquea el reingreso al flujo cuando el onboarding ya fue completado.
- Incluye un panel administrador para:
  - revisar registros,
  - filtrar por tipo y estado,
  - editar informacion,
  - crear usuarios nuevos,
  - generar archivos Excel desde plantillas,
  - abrir correos de Gmail prellenados para procesos operativos.

## Stack principal

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- `xlsx` para generar archivos Excel

## Estructura principal

### `neo-onboarding/`

Aplicacion web principal.

- `src/App.tsx`: define rutas publicas, protegidas y de administrador.
- `src/hooks/useAuth.ts`: escucha la sesion de Supabase y obtiene el rol del usuario.
- `src/context/OnboardingContext.tsx`: estado global del formulario de onboarding.
- `src/lib/supabase.ts`: cliente Supabase usando variables de entorno.
- `src/lib/services.ts`: autenticacion, roles, persistencia del onboarding, carga de fotos y datos de admin.
- `src/pages/planilla/*`: pasos del flujo para colaboradores en planilla.
- `src/pages/trainee/*`: pasos del flujo para trainees.
- `src/pages/admin/Dashboard.tsx`: panel administrador.
- `public/fola_template.xlsx`: plantilla base para afiliacion FOLA.
- `public/examen_template.xlsx`: plantilla base para cita de examen medico.
- `scripts/create-admin.mjs`: script manual para crear un usuario administrador.

### `Vistas/`

Carpeta de referencia visual y funcional previa a la SPA.

- HTMLs del flujo original o prototipos (`VistaInicio.html`, `TipoUsuario.html`, `Planilla_*.html`, `Trainee_*.html`, `ProcesoCompleto.html`).
- Imagenes base usadas en la experiencia.
- Plantillas Excel originales para FOLA y examen medico.

## Rutas de la aplicacion

### Publicas

- `/`: pantalla de inicio.
- `/auth/login`: inicio de sesion.

### Protegidas

- `/tipo-usuario`
- `/planilla/datos-personales`
- `/planilla/eps`
- `/planilla/oncosalud`
- `/planilla/examen-medico`
- `/planilla/revision`
- `/trainee/datos-personales`
- `/trainee/fola`
- `/trainee/oncosalud`
- `/trainee/revision`
- `/completado`

### Administracion

- `/admin`: solo para usuarios con rol `admin`.

## Modelo funcional

La app trabaja sobre una tabla `users` en Supabase. Ademas del rol y el correo, alli se persisten campos JSON para el avance del onboarding.

Campos usados por la app:

- `id`
- `email`
- `role`
- `tipo_usuario`
- `datos_personales`
- `beneficio_eps`
- `oncosalud`
- `examen_medico`
- `fola`
- `admin_data`
- `completado`
- `created_at`
- `updated_at`
- `completado_at`

Tambien se usa un bucket de Storage llamado `fotos` para guardar el fotocheck del usuario.

## Requisitos

- Node.js 20+ recomendado
- npm
- Un proyecto de Supabase con:
  - Auth habilitado
  - tabla `users`
  - bucket `fotos`
  - funcion RPC `create_new_user` si se quiere usar la opcion "Agregar Usuario" desde el panel admin

## Variables de entorno

Crear `neo-onboarding/.env` con:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## Instalacion y uso local

Desde `neo-onboarding/`:

```bash
npm install
npm run dev
```

Scripts disponibles:

- `npm run dev`: servidor local con Vite.
- `npm run build`: compilacion TypeScript + build de produccion.
- `npm run lint`: revision con ESLint.
- `npm run preview`: vista previa del build.

## Flujo de autenticacion y roles

- Los usuarios normales inician sesion y completan su onboarding.
- El hook `useAuth` consulta el rol desde la tabla `users`.
- Las rutas protegidas redirigen a login si no hay sesion.
- La ruta `/admin` redirige a `/tipo-usuario` si el usuario autenticado no es admin.

## Panel administrador

El dashboard de administracion permite:

- listar todos los registros de usuarios con rol `user`,
- filtrar por tipo (`planilla` o `trainee`),
- filtrar por estado (`completed` o `pending`),
- buscar por nombre, correo o DNI,
- editar datos personales y administrativos,
- subir o reemplazar la foto del usuario,
- abrir correos prellenados para EPS, Oncosalud, FOLA y examen medico,
- generar archivos Excel a partir de las plantillas publicas,
- registrar nuevos usuarios mediante la RPC `create_new_user`.

## Despliegue

El proyecto ya incluye configuracion para SPA en:

- `neo-onboarding/vercel.json`
- `neo-onboarding/firebase.json`

Ambas configuraciones redirigen cualquier ruta a `index.html`, lo que permite que React Router funcione correctamente en produccion.

## Notas importantes

- El `README.md` original dentro de `neo-onboarding/` todavia es el de plantilla de Vite.
- En `src/pages/admin/Dashboard.tsx` hay correos de ejemplo o placeholders que deben reemplazarse por direcciones reales antes de usar el flujo operativo.
- `scripts/create-admin.mjs` contiene valores fijos de Supabase y esta pensado como utilidad manual. Conviene migrarlo a variables de entorno si va a mantenerse en el proyecto.

## Siguientes mejoras recomendadas

- Agregar un script o archivo SQL versionado para crear la tabla `users`, el bucket `fotos` y la RPC `create_new_user`.
- Mover correos operativos y URLs a variables de entorno.
- Reemplazar el README interno de `neo-onboarding/` para que no quede documentacion duplicada u obsoleta.
- Agregar pruebas para servicios, guards de rutas y dashboard admin.
