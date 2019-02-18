Vocabulary expansion, word learning helper
 - random word generation from json file
 - images for words
 - plain equal check
 - need to redesign
 - one to one connection between the english words and the hungarian words

Technology
 - Angular 4
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
 - refactor the equal. these should be equals: I'm-I am; You are-You're, They are-They're;It's-It is; What's-What is;Isn't-Is not; Aren't-Are not, Don't Do not; Doesn't-Does not
 - server side 
   - CORS?!
   - put the word in database
   - get the pronunciation from google translate and store in to the words in database
   - get the audio file from google translate and store in to the words in database
   - configure and run tests