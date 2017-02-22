# README #

### What is this repository for? ###

* Quick summary
* Version


## Let's get started with Development Enviroment
- Install Node.JS version 6.20>
Use your system package manager (brew,port,apt-get,yum etc)

- Install global Typings , Bower, and Typescript commands, once you install the following commands globally, you can run 'npm install' to run the components in the package.json file

```bash
	npm install -g typings bower typescript
	npm install //load all your additional package.json components, and typings
```

- Run 'bower install’ for the first time to load all the bower components
```bash
	bower install //new install
    bower update //update if already installed
```

- When ever you make changes to bower.json files, you will need to run the command above, to update your lib folder, it will also start the development server. Otherwise you can run 'num run build'

```bash
    npm start // run the development server
	npm run build // build the dist package
    npm run build:serve //build the package, and serve on express server localhost:9000/
```


## What you got!
So now you have a complete WebPack build with automation for minification, single html application, and jslint, it will also bootstrap your application with CommonJS.



### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
