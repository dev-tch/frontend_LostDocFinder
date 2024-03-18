## frontend_LostDocFinder
this is the user graphical interface developed with angular 17.2.0.
- backend api exists in this link :[backend_LostDocFinder](https://github.com/dev-tch/backend_LostDocFinder)

services provided by this application:
- user can signup , login and logout

### authenticated users can : 
- create a request of type doc_lost to claim the missing of document
- create a request of type doc_found to notify that the document is found
- track , delete , update description of request
- view contact of others users who find or lost document
- view description associated with created document
- create , delete , update description of document 


## folders 
- src/app/web-pages : contains all the components used in this application

- src/app/data-models: contains the models data to map the response of api back

- src/app/storage-services: contains classes to save and extract data of authenticated users (like token)

- src/app/htt-services : contains the sharable and injectable service to intercat with backend api 

## modified files
- src/app/app.routes.ts: contains all the routes of angular application

- src/environments/environment.ts: config the apiUrl

## entry component
- src/app.component.ts: the logic of the entry component

- src/app.component.html: template of entry component

- src/app.component.css: the design of entry component


