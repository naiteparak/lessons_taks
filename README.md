# Lessons generation task

This is a web server built using ExpressJS to handle data related to lessons. The server interacts with a PostgreSQL database.

The API provides two main tasks: data retrieval and data manipulation. The implementation includes logging, error handling, and documentation for better understanding and maintenance.

## Technologies Used
- Language: JavaScript
- Web Server: ExpressJS
- NodeJS Version: 20.3.0
- Database Access: Knex.js and PostgreSQL
- Version Control: Git
- Deployment: Docker
- Documentation: Swagger
- Logging: Winston

## Installation and Setup

To install and set up the app, follow these steps:

1. Clone or download source code from the provided repository.

2. Install all dependencies with command

```bash
 $ npm install
```
### Setting up environment variables

3. Before running the app, you need to create a .env file in the project root directory. Rename env.example file or use the following example as a template:

```dotenv
 PORT=80

 POSTGRES_HOST=localhost
 POSTGRES_PORT=5432
 POSTGRES_USER=postgres
 POSTGRES_PASSWORD=postgres
 POSTGRES_DB=db
```

### Build docker container for db connection

```bash
 $ npm run docker-build
```

## Running the app

You can run the app using the following command:

```bash
 $ npm run start
```

## Documentation

The API server provides detailed documentation to assist developers in understanding and utilizing the available endpoints.

<p style="color:#b93535;">The API documentation is accessible at /api-docs endpoint.</p>
