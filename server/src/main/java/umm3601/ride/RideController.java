package umm3601.ride;

import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

import org.bson.Document;
import org.bson.codecs.BsonTypeClassMap;
import org.bson.codecs.DocumentCodec;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.types.ObjectId;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.in;


public class RideController {

  private final MongoCollection<Document> rideCollection;
  private final MongoCollection<Document> userCollection;

  public RideController(MongoDatabase database) {
    rideCollection = database.getCollection("Rides");
    userCollection = database.getCollection("Users");

  }

  String getRide(String id) {
    FindIterable<Document> jsonRides = rideCollection.find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonRides.iterator();
    if (iterator.hasNext()) {
      Document ride = iterator.next();
      return ride.toJson();
    } else {
      // We didn't find the desired ride
      return null;
    }
  }

  String getRides(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("driver")) {
      String targetContent = (queryParams.get("driver")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetContent);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("driver", contentRegQuery);
    }

    if (queryParams.containsKey("driving")) {
      Boolean targetBool = Boolean.parseBoolean(queryParams.get("driving")[0]);
      filterDoc = filterDoc.append("driving", targetBool);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingRides = rideCollection.find(filterDoc);
    Iterable<Document> ridesWithUsers = addUsersToRides(matchingRides);
    return serializeIterable(ridesWithUsers);
  }

  String getUserRides(String userId) {

    System.out.println("We are attempting to gather results");

    BasicDBObject orQuery = new BasicDBObject();
    List<BasicDBObject> params = new ArrayList<BasicDBObject>();
    params.add(new BasicDBObject("ownerId", getStringField(userId, "_id")));
    params.add(new BasicDBObject("riderList", getStringField(userId, "name")));
    orQuery.put("$or", params);

    System.out.println(orQuery);

    FindIterable<Document> matchingRides = rideCollection.find(orQuery);

    return serializeIterable(matchingRides);
  }
  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    CodecRegistry codecRegistry = CodecRegistries.fromRegistries(MongoClient.getDefaultCodecRegistry());
    DocumentCodec codec = new DocumentCodec(codecRegistry, new BsonTypeClassMap());
    return StreamSupport.stream(documents.spliterator(), false)
      .map((Document d) -> d.toJson(codec))
      .collect(Collectors.joining(", ", "[", "]"));
  }

  String addNewRide(String driver, String destination, String origin, Boolean roundTrip, Boolean driving, String departureDate, String departureTime, String mpg, String notes, String ownerId, List<String> riderList, String numSeatsString) {
    System.out.println(ownerId);
    Document newRide = new Document();
    ownerId = getStringField(driver, "_id");
    System.out.println(ownerId);
    newRide.append("driver", driver);
    newRide.append("destination", destination);
    newRide.append("origin", origin);
    newRide.append("roundTrip", roundTrip);
    newRide.append("driving", driving);
    newRide.append("departureDate", departureDate);
    newRide.append("departureTime", departureTime);
    if (mpg != null) {
      if (mpg.isEmpty()) {
        newRide.append("mpg", null);
      } else {
        int mpgInt = Integer.parseInt(mpg);
        newRide.append("mpg", mpgInt);
      }
    } else {
      newRide.append("mpg", mpg);
    }
    newRide.append("notes", notes);
    newRide.append("ownerId", ownerId);

    int numSeats = Integer.parseInt(numSeatsString);
    newRide.append("numSeats", numSeats);

    newRide.append("riderList", riderList);

    try {
      rideCollection.insertOne(newRide);
      ObjectId _id = newRide.getObjectId("_id");
      System.err.println("Successfully added new ride [_id=" + _id + ", driver=" + driver + ", destination=" + destination + ", origin=" + origin + ", roundTrip=" + roundTrip + ", driving=" + driving + " departureDate=" + departureDate + " departureTime=" + departureTime + " mpg=" + mpg + " notes=" + notes + ']');
      return _id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }

  Boolean deleteRide(String id){
    ObjectId objId = new ObjectId(id);
    try{
      DeleteResult out = rideCollection.deleteOne(new Document("_id", objId));
      //Returns true if at least 1 document was deleted
      return out.getDeletedCount() != 0;
    }
    catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }

  Boolean updateRide(String id, String driver, String destination, String origin, Boolean roundTrip, Boolean driving, String departureDate, String departureTime, String mpgString, String notes, String numSeatsString){
    ObjectId objId = new ObjectId(id);
    Document filter = new Document("_id", objId);
    Document updateFields = new Document();
    updateFields.append("driver", driver);
    updateFields.append("destination", destination);
    updateFields.append("origin", origin);
    updateFields.append("driving", driving);
    updateFields.append("roundTrip", roundTrip);
    updateFields.append("departureDate", departureDate);
    updateFields.append("departureTime", departureTime);
    if (mpgString != null && !mpgString.isEmpty()) {
      int mpg = Integer.parseInt(mpgString);
      updateFields.append("mpg", mpg);
    } else {
      updateFields.append("mpg", mpgString);
    }
    updateFields.append("notes", notes);

    int numSeats = Integer.parseInt(numSeatsString);
    updateFields.append("numSeats", numSeats);

    System.out.println(updateFields.toString());
    Document updateDoc = new Document("$set", updateFields);
    try{
      UpdateResult out = rideCollection.updateOne(filter, updateDoc);
      //returns false if no documents were modified, true otherwise
      return out.getModifiedCount() != 0;
    }catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }

  private Iterable<Document> addUsersToRides(FindIterable<Document> rides){
    ArrayList<Document> ridesWithUsers = new ArrayList<>();
    for (Document ride: rides) {
      Document ownerRef = new Document();
      Document contentRegQuery = new Document();
      contentRegQuery.append("_id", ride.getString("ownerId"));
      ownerRef = ownerRef.append("_id", new ObjectId(ride.getString("ownerId")));
      ride.put("ownerData", userCollection.find(ownerRef).first());
      ridesWithUsers.add(ride);
    }
    return ridesWithUsers;
  }

  private String getStringField(String userId, String field) {
    FindIterable<Document> jsonRides = userCollection.find(eq("userId", userId));

    Iterator<Document> iterator = jsonRides.iterator();
    if (iterator.hasNext()) {
      String fieldInfo;
      Document ride = iterator.next();
      if (field.equals("_id")) {
        fieldInfo = ride.getObjectId(field).toHexString();
      } else {
        fieldInfo = ride.getString(field);
      }
      System.out.println("Got user: " + userId + " " + field + " = " + fieldInfo);

      return fieldInfo;
    }
    return "User Not Found";
  }

  Boolean addRider(String id, List<String> riderList, String newRider, Integer numSeats) {
    ObjectId objId = new ObjectId(id);
    Document filter = new Document("_id", objId);
    Document updateFields = new Document();

    newRider = getStringField(newRider, "name");
    System.out.println("adding " + newRider + " to the ride");

    riderList.set(riderList.size()-1, newRider);

    System.out.println(riderList);

    updateFields.append("riderList", riderList);
    updateFields.append("numSeats", numSeats);

    Document updateDoc = new Document("$set", updateFields);

    try{
      UpdateResult out = rideCollection.updateOne(filter, updateDoc);
      //returns false if no documents were modified, true otherwise
      return out.getModifiedCount() != 0;
    }catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }
}
