const { MongoClient, ObjectID } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }
    const db = client.db(databaseName);

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "María",
    //       age: 22
    //     },
    //     {
    //       name: "José",
    //       age: 26
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Error: " + error);
    //     }
    //     console.log(result);
    //   }
    // );

    db.collection("users").deleteOne(
      { _id: new ObjectID("5ee95a5867d87e1d7e8f4866") },
      (err, res) => {
        if (error) {
          return console.log("Error: " + error);
        }
        console.log(res);
      }
    );
  }
);
