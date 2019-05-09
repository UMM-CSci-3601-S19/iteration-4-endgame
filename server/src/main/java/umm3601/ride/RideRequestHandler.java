package umm3601.ride;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;
import umm3601.GoogleAuth;

import java.util.List;

public class RideRequestHandler {

  private final RideController rideController;
  private final GoogleAuth gauth;

  public RideRequestHandler(RideController rideController, GoogleAuth gauth) {
    this.rideController = rideController;
    this.gauth = gauth;
  }

  /**
   * Method called from Server when the 'api/rides/:id' endpoint is received.
   * Get a JSON response with a list of all the rides in the database.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return one ride in JSON formatted string and if it fails it will return text with a different HTTP status code
   */
  public String getRideJSON(Request req, Response res) {
    res.type("application/json");
    String destination = req.params("destination");
    String ride;
    try {
      ride = rideController.getRide(destination);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested ride destination " + destination + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (ride != null) {
      return ride;
    } else {
      res.status(404);
      res.body("The requested ride with id " + destination + " was not found");
      return "";
    }
  }


  /**
   * Method called from Server when the 'api/rides' endpoint is received.
   * This handles the request received and the response
   * that will be sent back.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return an array of rides in JSON formatted String
   */
  public String getRides(Request req, Response res) {
    res.type("application/json");
    return rideController.getRides(req.queryMap().toMap());
  }

  public String getUserRides(Request req, Response res) {
    res.type("application/json");
    String userId = req.params("userId");
    String userRides;
    try {
      userRides = rideController.getUserRides(userId);
    } catch (IllegalArgumentException e) {
      res.status(400);
      res.body("Could not find the userId " + userId);
      return "";
    }
    if (userRides != null) {
      return userRides;
    } else {
      res.status(404);
      res.body("The requested user with userId " + userId + " was not found");
      return "";
    }
  }
  /**
   * Method called from Server when the 'api/rides/new' endpoint is received.
   * Gets specified ride info from request and calls addNewRide helper method
   * to append that info to a document
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return a boolean as whether the ride was added successfully or not
   */
  public String addNewRide(Request req, Response res) {
    res.type("application/json");

    GoogleIdToken token = gauth.auth(req);

    Document newRide = Document.parse(req.body());

    Document rideInfo = new Document();

    rideInfo.append("destination", newRide.getString("destination"));
    rideInfo.append("origin", newRide.getString("origin"));
    rideInfo.append("roundTrip", newRide.getBoolean("roundTrip"));
    rideInfo.append("departureDate", newRide.getString("departureDate"));
    rideInfo.append("departureTime", newRide.getString("departureTime"));
    String seats = newRide.getString("numSeats");
    if (seats != null && ! seats.isEmpty()) {
      int numSeats = Integer.parseInt(seats);
      rideInfo.append("numSeats", numSeats);
    } else {
      newRide.append("numSeats", null);
    }
    String mpg = newRide.getString("mpg");
    if (mpg != null && ! mpg.isEmpty()) {
      int mpgInt = Integer.parseInt(mpg);
      rideInfo.append("mpg", mpgInt);
    } else {
      newRide.append("mpg", null);
    }
    rideInfo.append("notes", newRide.getString("notes"));
    rideInfo.append("riderList", newRide.getList("riderList", String.class));
    rideInfo.append("ownerId", gauth.getUserMongoId(token));

    return rideController.addNewRide(rideInfo);
  }

  public Boolean updateRide(Request req, Response res) {
    res.type("application/json");
    System.out.println(req.body());
    GoogleIdToken token = gauth.auth(req);
    Document updatedRide = Document.parse(req.body());
    System.out.println(updatedRide);
    Document rideInfo = new Document();
    rideInfo.append("_id", updatedRide.getObjectId("_id").toHexString());
    rideInfo.append("destination", updatedRide.getString("destination"));
    rideInfo.append("origin", updatedRide.getString("origin"));
    rideInfo.append("roundTrip", updatedRide.getBoolean("roundTrip"));
    rideInfo.append("departureDate", updatedRide.getString("departureDate"));
    rideInfo.append("departureTime", updatedRide.getString("departureTime"));
    String seats = updatedRide.getString("numSeats");
    if (seats != null && ! seats.isEmpty()) {
      int numSeats = Integer.parseInt(seats);
      rideInfo.append("numSeats", numSeats);
    } else {
      updatedRide.append("numSeats", null);
    }
    String mpg = updatedRide.getString("mpg");
    if (mpg != null && ! mpg.isEmpty() && ! mpg.equals("undefined")) {
      int mpgInt = Integer.parseInt(mpg);
      rideInfo.append("mpg", mpgInt);
    } else {
      updatedRide.append("mpg", null);
    }
    rideInfo.append("notes", updatedRide.getString("notes"));
    rideInfo.append("riderList", updatedRide.getList("riderList", String.class));
    rideInfo.append("ownerId", gauth.getUserMongoId(token));
    System.err.println("Editing ride [id="+ updatedRide.getObjectId("_id").toHexString() + ']');
    return rideController.updateRide(rideInfo);
  }

  public Boolean deleteRide(Request req, Response res){
    res.type("application/json");
    GoogleIdToken token = gauth.auth(req);
    if(token == null){
      return false;
    } else {
      String userId = token.getPayload().getSubject();
      String userMongoId = gauth.getUserMongoId(userId);
      if(userMongoId == null){ //Will this ever happen? Given that access tokens are unique to our app, if an access token is not null, we should have a user (and associated mongo id) that goes with it
        return false;
      }

      Document deleteRide = Document.parse(req.body());
      String rideId = deleteRide.getString("_id");
      System.err.println("Deleting ride id=" + rideId);
      return rideController.deleteRide(rideId, userMongoId);
    }
  }

  public Boolean addRider(Request req, Response res) {
    res.type("application/json");
    Document body = Document.parse(req.body());
    System.out.println(body);
    GoogleIdToken token = gauth.auth(body);
    String name = gauth.getName(body);
    String id = gauth.getUserMongoId(token);
    return rideController.addRider(body.getString("rideId"), id,name);
  }
}
