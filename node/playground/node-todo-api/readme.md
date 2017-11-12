## Getting Started

Clone Repo

````
git clone https://github.com/BuiltByBROS/docs
````

npm install dependencies

````
cd node/playground/node-todo-api/

npm install
````

### To run on docker

````
docker-compose build
````

````
docker-compose up
````


### Start development server with hot reloading

Remember change db host to localhost in config file

````
npm run dev-watch
````

### Production

Remember change db host to localhost in config file

````
npm run start
````

I'm using pm2 for production server, you should install it on server via 'npm install pm2 -g'.
if you don't want to use pm2, just change pm2 with node in package.json file in scripts section.