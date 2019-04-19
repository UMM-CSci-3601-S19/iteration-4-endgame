package umm3601;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
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

import java.io.FileReader;
import java.io.InputStream;
import java.util.Collections;

import org.bson.Document;

public class Server {

  private static final int serverPort = 4567;

  private static final String databaseName = "dev";

  private static final String CLIENT_ID = "375549452265-kpv6ds6lpfc0ibasgeqcgq1r6t6t6sth.apps.googleusercontent.com";

  private static final String CLIENT_SECRET_FILE = "../secret.json";

  public static void main(String[] args) {

    MongoClient mongoClient = new MongoClient();
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    RideController rideController = new RideController(database);
    RideRequestHandler rideRequestHandler = new RideRequestHandler(rideController);
    UserController userController = new UserController(database);
    UserRequestHandler userRequestHandler = new UserRequestHandler(userController);

    NetHttpTransport transport = new NetHttpTransport();

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
    //get("api/rides/:destination", rideRequestHandler::getRideJSON);
    post("api/rides/new", rideRequestHandler::addNewRide);
    post("api/rides/update", rideRequestHandler::updateRide);
    post("api/rides/remove", rideRequestHandler::deleteRide);

    // User Endpoints ///////////////////////////////////
    /////////////////////////////////////////////////////
    get("api/users", userRequestHandler::getUsers);
    get("api/users/:id", userRequestHandler::getUserJSON);
    get("api/user/:id", userRequestHandler::getUserJSON);
    post("api/users/rate", userRequestHandler::rateUser);

    post("api/signin", (Request req, Response res) -> {
      res.type("application/json");
      System.out.println("signin!");
      try {
        GoogleClientSecrets clientSecrets =
          GoogleClientSecrets.load(JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));
        String clientSecret = clientSecrets.getDetails().getClientSecret();
        GoogleTokenResponse tokenResponse =
          new GoogleAuthorizationCodeTokenRequest(
            transport,
            JacksonFactory.getDefaultInstance(),
            "https://oauth2.googleapis.com/token",
            clientSecrets.getDetails().getClientId(),
            clientSecret,
            authCode,
            "http://localhost:9000").execute();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, JacksonFactory.getDefaultInstance())
          .setAudience(Collections.singletonList(clientSecret))
          // Specify the CLIENT_ID of the app that accesses the backend:
          .setAudience(Collections.singletonList(CLIENT_ID))
          // Or, if multiple clients access the backend:
          //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
          .build();
        GoogleIdToken idToken = verifier.verify(tokenResponse)
      } catch (Exception e) {
        System.err.println("Client secret not found uwu");
        e.printStackTrace();
      }
      Document body = Document.parse(req.body());
      String token = body.getString("idtoken");
      System.out.println(token);
      res.body(token);
      return res;
    });


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

  // Enable GZIP for all responses
  private static void addGzipHeader(Request request, Response response) {
    response.header("Content-Encoding", "gzip");
  }
}
