package umm3601.ride;

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

    Document newRide = Document.parse(req.body());

    String driver = newRide.getString("driver");
    String destination = newRide.getString("destination");
    String origin = newRide.getString("origin");
    Boolean roundTrip = newRide.getBoolean("roundTrip");
    Boolean driving = newRide.getBoolean("driving");
    String departureDate = newRide.getString("departureDate");
    String departureTime = newRide.getString("departureTime");
    String mpg = newRide.getString("mpg");
    String notes = newRide.getString("notes");
    List<String> riderList = newRide.getList("riderList", String.class);
    String numSeats = newRide.getString("numSeats");
    String ownerId;
    if(newRide.containsKey("ownerId")){
      ownerId = newRide.getString("ownerId");
    }else{
      ownerId = new ObjectId().toHexString();
    }


    System.err.println("Adding new ride [driver=" + driver + " ownerId=" + ownerId + " destination=" + destination + " origin=" + origin + " roundTrip=" + roundTrip + " driving=" + driving + " departureDate=" + departureDate + " departureTime=" + departureTime + " mpg=" + mpg + " notes=" + notes + ']');
    return rideController.addNewRide(driver, destination, origin, roundTrip, driving, departureDate, departureTime, mpg, notes, ownerId, riderList, numSeats);
  }

  public Boolean updateRide(Request req, Response res) {
    res.type("application/json");

    Document editRide = Document.parse(req.body());

    String id = editRide.getObjectId("_id").toHexString();
    String driver = editRide.getString("driver");
    String destination = editRide.getString("destination");
    String origin = editRide.getString("origin");
    Boolean roundTrip = editRide.getBoolean("roundTrip");
    Boolean driving = editRide.getBoolean("driving");
    String departureDate = editRide.getString("departureDate");
    String departureTime = editRide.getString("departureTime");
    String mpg = editRide.getString("mpg");
    String notes = editRide.getString("notes");
    String numSeats = editRide.getString("numSeats");


    System.err.println("Editing ride [id=" + id + " driver=" + driver + " destination=" + destination + " origin=" + origin + " roundTrip=" + roundTrip + " driving=" + driving + " departureDate=" + departureDate + " departureTime=" + departureTime + " notes=" + notes + ']');
    return rideController.updateRide(id, driver, destination, origin, roundTrip, driving, departureDate, departureTime, mpg, notes, numSeats);
  }

  public Boolean deleteRide(Request req, Response res){
    res.type("application/json");

    Document deleteRide = Document.parse(req.body());

    String id = deleteRide.getString("_id");
    System.err.println("Deleting ride id=" + id);
    return rideController.deleteRide(id);
  }

  public Boolean addRider(Request req, Response res) {
    res.type("application/json");

    Document addedRider = Document.parse(req.body());

    String id = addedRider.getObjectId("_id").toHexString();
    List<String> riderList = addedRider.getList("riderList", String.class);
    String newRider = riderList.get(riderList.size() - 1);
    Integer numSeats = addedRider.getInteger("numSeats");
    System.out.println("ride id: " + id + " riderList: " + riderList + " newRiderUserId: " + newRider + " numSeats: " + numSeats);
    return rideController.addRider(id, riderList, newRider, numSeats);
  }
}
