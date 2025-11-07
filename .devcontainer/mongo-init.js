// create new databases
fileDb = db.getSiblingDB("file_service");
postDb = db.getSiblingDB("post_service");

// create collections
fileDb.createCollection("files");
postDb.createCollection("post");
