Vocabulary expansion, word learning helper
 - random word generation from json file
 - images for words
 - plain equal check

Technology
 - Angular 8
 - webpack
 - Typescript
 
RUN the sample.
 -  npm install
 -  npm run start:webpack
 -  Open a browser window and navigate to http:\\\\localhost:8080 to access the app.

BUILD:
 - npm install
 - npm run build:webpack 
 
IN PROGRESS
 - admin page to configure words in DB
TODO tasks
 - show progress when adding unit content
 - load images and audios
 - refactor the equal. these should be equals: I'm-I am; You are-You're, They are-They're;It's-It is; What's-What is;Isn't-Is not; Aren't-Are not, Don't Do not; Doesn't-Does not
 - authenticatio-authorization
 - need to redesign
 - server side 
   - CORS?!
   - get the pronunciation from google translate and store in to the words in database
   - get the audio file from google translate and store in to the words in database
   - configure and run tests
TODO missing features
 - focus on created element when adding new phrase to unit content
 - required when no phrases filled and add button pressed
   
# Angular-cli

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
