# ba_frontend
This front-end is part of a bachelors thesis on creating UI concepts to edit results of text recognition AI services for the use in Human-In-The-Loop-Applications. As part of the work on this project, the front-end  was edited and a new function to edit AI results was introduced.

The [original front-end](https://github.com/ailujezi/technical-drawings-frontend) was built by [Julia Ritz](https://github.com/ailujezi).
The [first extension and connection](https://github.com/ghjez/ba_frontend) to the backend was then done by [Heorhii Danylyshyn](https://github.com/ghjez).

This front-end is built to be used with the matching [back-end](https://github.com/ghjez/ba_backend) oringinally created by [Shipan Liu](https://github.com/ShipanLiu) and edited and connected to the front-end by [Heorhii Danylyshyn](https://github.com/ghjez).

For further information on the prior versions, please read the according README-files.

## Links

**Back-End:** https://github.com/ghjez/ba_backend
**Additional-Resources:** https://github.com/ghjez/ba_supplementary

**READ-ME Julia Ritz:** https://github.com/Muelker/ba-frontend-with-extension/blob/main/README_ORIGINAL_V1.md
**READ-ME Heorhii Danylyshyn:** https://github.com/Muelker/ba-frontend-with-extension/blob/main/README_ORIGINAL_V2.md

## Setup:

### Requirements:

1. Download and Install the Node.js from the [official website](https://nodejs.org/en/).
2. If you are installing Node.js on Widowns: During the installation, make sure at least the following components are downloaded and installed:
    - Node.js runtime
    - Corepack managaer
    - NPM package manager
    - Add to PATH
3. After successfully installing Node.js, to install tne Angular CLI do:
    - open a **NEW** command prompt or terminal.
    - install the Angular CLI globally by running:

    ```
    npm install -g @angular/cli
    ```

### Setting up the front-end:

After installing the requirements listed above, you can set up this front-end on your local machine.

1. Clone or download this repository to your machine.
2. Navigate to the project directory in your command prompt or terminal.
3. Run the following command, to install the necessary dependencies:
    ```
    npm install -g @angular/cli
    ```

### Starting up the front-end: 

> Before starting the front-end, make sure the back-end is properly set up and running. For detailed information instructions, please follow the links listed in the [link-section](https://github.com/Muelker/ba-frontend-with-extension/blob/main/README.md##links).

When using the front-end, start by setting up the files accoring to your needs. 
1. Make sure the setting for the URL is set of the correct address of your back-end. The URL can be set in the `src/environments/environment.development.ts` file for development builds and in the `src/environments/environment.ts` file for production builds. To change the URL, edit the value of the `apiURL` parameter. By default, this is set to 
```TypeScript
export const environment = {
    apiUrl: 'http://127.0.0.1:8000'
};
```

2. To run the front-end in development mode (updating any file in the source code **WILL** trigger a rebuilt of the front-end): 
    - open a new command prompt or terminal
    - navigate to the projects directory in your command prompt or terminal
    - use the command: 
        ```
        ng serve
        ```

3. To create a stable production build (updating any file in the source code **WILL NOT** trigger a rebuilt of the front-end)
    - open a new command prompt or terminal
    - navigate to the projects directory in your command prompt or terminal
    - use the command: 
        ```
        ng built
        ```
    Using this, a static version of the front-end-application will be built in the `dist/technical-drawings-frontend/browser` directory of your project.

## Using the front-end

To start using the front-end, please first follow the steps below:


1. Register as a user and Log in to access the service.

### Processing images with the front-end:

1. **Create** a new project or select an existing one
2. **Upload one/multiple image(s)** by:
    - Clicking on the "File(s) wählen" (engl: "Choose files") button
    - select the images you want to upload
    - finish the process by clicking the "Bild(er) Hochladen" (engl: "upload images") button
3. Select the AI modules to use. Using drag-and-drop, you can move the modules from the "available modules" to the "selected modules", rearange the selected modules and remove modules that are not needed. The same module can be used multiple times.
4. Once the images are uploaded and the correct modules are selected, click the "Visualisieren" (engl: "visualize") button to start the processing.
5. Select the "Visualisierung" (engl: visualization) tab, to see the results.

### Edtitng results:

After uploading images, these images are availabnle to be selected in the "Visualisierung" (engl: visualization) tab. To edit AI results or create user results from scratch:

1. Select an image from the galery at the top.
2. select the "Ergebnis bearbeiten" (engl: "edit result") button
3. Use the features of the new UI to create, Edit or delete any recognitions on the image.