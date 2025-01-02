
# Technical Drawings Frontend
This is the repository for the "Technical Drawings Frontend" Angular project.
The application is intended to be run along with a matching backend application that provides the necessary API.

You can use the "Technical Drawings Backend" Java Spring Boot application for this purpose.

## Prerequisites
Before you begin, ensure you have met the following requirements:

- Node.js
- Angular CLI

For detailed instructions on setting up Angular and its prerequisites incl. Node.js, refer to the Angular setup guide here: [Angular Setup Local](https://angular.io/guide/setup-local).

### Installing Node.js and Angular CLI

1. Download and install Node.js from [Node.js Official Website](https://nodejs.org/).
2. During the Node.js installation process on Windows, ensure to select at least the following components:
   - Node.js runtime
   - Corepack manager
   - NPM package manager
   - Add to PATH

### Installing Angular CLI
After installing Node.js, open a **new** command prompt or terminal and install Angular CLI globally by running:

```
npm install -g @angular/cli
```

## Project Setup
Once you have the prerequisites installed, you can set up the project on your local machine.

1. Clone the repository or download the project to your local machine.
2. Navigate to the project directory in the command prompt or terminal.
3. Run the following command to install necessary dependencies:
```
npm install
```

## Running the Application
To run the application in development mode, open a terminal (CMD/Bash) and navigate to the project directory.
Use the following command inside the project directory on a Linux/WSL system:
```
ng serve
```

The application will be hosted locally and can be accessed at `http://localhost:4200`.

## Production Build
To create a production-ready build of your application, use:
```
ng build
```

This will create a static version of the frontend application inside the `dist/technical-drawings-frontend/browser` directory.
The contents of the directory can be deployed using any webserver available on the production environment.



## Configuration
The only necessary setting is the URL of the backend application.
You can set it by replacing the value of the `apiUrl` parameter inside the `environment.ts` file.
This file is located at `src/environments/environment.ts`.
Its default content looks like this:

```
export const environment = {
    apiUrl: 'http://localhost:8081'
};
``
