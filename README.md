DevOps Test Task

Setup and configure infrastructure to run Azure Functions App from the git repo.
The app requires Redis and MongoDB-compatible database (for Azure, CosmosDB will work).

The app expects the following environmental variables:

* REDIS_URL - connection string for Redis
* MONGODB_URL - connection string for MongoDB
* MONGODB_NAME - MongoDB database name

Continues deployment should be configured for the app, so each push to git should be deployed to corresponding Azure Functions App.
