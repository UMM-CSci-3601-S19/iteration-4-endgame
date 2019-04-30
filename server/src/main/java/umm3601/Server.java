package umm3601;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.json.JSONObject;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.utils.IOUtils;
import umm3601.ride.RideController;
import umm3601.ride.RideRequestHandler;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;

import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

import java.io.InputStream;
import java.util.Collections;


public class Server {

  private static final int serverPort = 4567;

  private static final String databaseName = "dev";

  private static final String CLIENT_ID = "375549452265-kpv6ds6lpfc0ibasgeqcgq1r6t6t6sth.apps.googleusercontent.com";

  private static final String CLIENT_SECRET_FILE = "../secret.json";

  private static final NetHttpTransport transport = new NetHttpTransport();

  private static final GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, JacksonFactory.getDefaultInstance())
    // Specify the CLIENT_ID of the app that accesses the backend:
    .setAudience(Collections.singletonList(CLIENT_ID))
    // Or, if multiple clients access the backend:
    //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
    .build();

  public static void main(String[] args) {

    MongoClient mongoClient = new MongoClient();
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    RideController rideController = new RideController(database);
    RideRequestHandler rideRequestHandler = new RideRequestHandler(rideController);
    UserController userController = new UserController(database);
    UserRequestHandler userRequestHandler = new UserRequestHandler(userController);

    //Configure Spark
    port(serverPort);
    enableDebugScreen();

    // Specify where assets like images will be "stored"
    staticFiles.location("/public");

    options("/*", (request, response) -> {

      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    // Redirects for the "home" page
    redirect.get("", "/");

    Route clientRoute = (req, res) -> {
	  InputStream stream = Server.class.getResourceAsStream("/public/index.html");
	  return IOUtils.toString(stream);
    };

    get("/", clientRoute);

    /// Ride Endpoints ///////////////////////////
    /////////////////////////////////////////////

    get("api/rides", rideRequestHandler::getRides);
    get("api/rides/:userId", rideRequestHandler::getUserRides);
    //get("api/rides/:destination", rideRequestHandler::getRideJSON);
    post("api/rides/new", rideRequestHandler::addNewRide);
    post("api/rides/update", rideRequestHandler::updateRide);
    post("api/rides/remove", rideRequestHandler::deleteRide);
    post("api/rides/addRider", rideRequestHandler::addRider);

    // User Endpoints ///////////////////////////////////
    /////////////////////////////////////////////////////
    get("api/users", userRequestHandler::getUsers);
    get("api/user/:id", userRequestHandler::getUserJSON);
    post("api/user/editProfile", userRequestHandler::editUserProfile);
    post("api/user/rateProfile", userRequestHandler::rateUser);

    post("api/login", userRequestHandler::login/*(Request req, Response res) -> {
      return userRequestHandler.login(req, res);*/);

//    post("api/signup", (req, res) -> {
//      return userRequestHandler.signup(req, res);
//    });

    // An example of throwing an unhandled exception so you can see how the
    // Java Spark debugger displays errors like this.
    get("api/error", (req, res) -> {
      throw new RuntimeException("A demonstration error");
    });

    // Called after each request to insert the GZIP header into the response.
    // This causes the response to be compressed _if_ the client specified
    // in their request that they can accept compressed responses.
    // There's a similar "before" method that can be used to modify requests
    // before they they're processed by things like `get`.
    after("*", Server::addGzipHeader);

    get("/*", clientRoute);

    // Handle "404" file not found requests:
    notFound((req, res) -> {
      res.type("text");
      res.status(404);
      return "Sorry, we couldn't find that!";
    });
  }

  public static GoogleIdToken auth(Request req){
    return auth(Document.parse(req.body()));
  }
  public static GoogleIdToken auth(Document body){
    return auth(body.getString("idtoken"));
  }
  public static GoogleIdToken auth(String token){
    try {
      return verifier.verify(token);
    } catch (Exception e) {
      System.err.println("Invalid ID token");
      e.printStackTrace();
      return null;
    }
  }

  // Enable GZIP for all responses
  private static void addGzipHeader(Request request, Response response) {
    response.header("Content-Encoding", "gzip");
  }
}
