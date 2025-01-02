# ba_frontend
This is a part of my bachelor thesis on deploying a technical drawing processing web application. In scope of this project, the [original frontend](https://github.com/ailujezi) was configured to work with the project's [backend](https://github.com/ghjez/ba_backend). Among the new additions is a chain configuring tool as well as some cosmetic touch-ups.  

The original [frontend](https://github.com/ailujezi/technical-drawings-frontend) was created by [Julia Ritz](https://github.com/ailujezi).

**Backend:** https://github.com/ghjez/ba_backend  
**Additional content** (scripts for AI-modules, etc.)**:** https://github.com/ghjez/ba_supplementary  
**Original Readme:** https://github.com/ghjez/ba_frontend/blob/main/README_ORIGINAL.md:


Setup
---
> For a more detailed setup explanation, follow the instructions from the original README. 

1. Download and install [Node.js](https://nodejs.org/).

    > on Windows, select at least the following components:
    > - Node.js runtime
    > - Corepack manager
    > - NPM package manager
    > - Add to PATH 
2. Open a **new** command prompt or terminal and install Angular CLI globally by running:
    ```
    npm install -g @angular/cli
    ```

3. Navigate to the project directory and install the dependencies:
    ```
    npm install
    ```

Start the Frontend
---
> Before starting the frontend, ensure that the backend was properly set up and is running. See more in the repositories for [backend](https://github.com/ghjez/ba_backend) and [additional content](https://github.com/ghjez/ba_supplementary).

1. Set the URL of the backend by replacing the value of the `apiUrl` parameter inside the `environment.ts` and `environment.development.ts` files.
These files are located in the `src/environments/` folder.
The default content of both files looks like this:
    ```typescript
    export const environment = {
        apiUrl: 'http://127.0.0.1:8000'
    };
    ```

1. To run the application in **development mode**, run a following command from the project's folder:
    ```
    ng serve
    ```

    The application will be hosted locally and can be accessed at `http://localhost:4200`.   
    The application will use the environment variables from the `environment.development.ts` environment.

2. To create a production-ready build, use:
    ```
    ng build
    ```

    This will create a static version of the frontend application inside the `dist/technical-drawings-frontend/browser` directory.
    The contents of the directory can be deployed using any webserver available on the production environment.


Start processing
---
1. **Create** a new **project** or **select** an existing one.
2. **Choose the image(s)** from your computer by clicking the "Choose Files" ("Files Wählen") button and .
3. **Upload the images** to the application's database by clicking the "Upload Images" ("Bilder Hochladen") button.
4. **Drag and drop the modules** from the "Available modules" field down to the "Selected modules" field. Rearrange, remove and add the modules as you wish. You can also include the same module several times.
5. Once you are happy with your processing chain, click the "Visualize" ("Visualisieren") button. The processing will take a while. Keep in mind, that not all configurations will produce a proper result. Some might not produce a result at all.
6. Switch to the "Visualisation" ("Visualisierung") tab to inspect the results.