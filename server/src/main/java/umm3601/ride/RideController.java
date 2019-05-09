package umm3601.ride;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
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
  //This code isn't used, but could be useful. We aren't going to test it (it is out of scope for our current project)
  //We want to leave it here so you, dear contributor, can utilize it in ways we could not.
  //Or so you can delete it later. That would be fine too.
  /*
  Boolean userExists(String id){ //may not be useful at all, given that checking for the nullity of the access token should tell us whether the user exists
    FindIterable<Document> userDocs = userCollection.find(new Document("_id", id));
    Iterator<Document> iterator = userDocs.iterator();
    if (iterator.hasNext()) {
      //The user exists
      return true;
    }else {
      //The user doesn't exist
      return false;
    }
  }

  Boolean userMatchesRide(String rideId, String userId){
    Document matchDoc = new Document();
    matchDoc.append("_id", new ObjectId(rideId));
    matchDoc.append("ownderId", userId);
    FindIterable<Document> matchDocs = rideCollection.find(matchDoc);
    Iterator<Document> iterator = matchDocs.iterator();
    if (iterator.hasNext()){
      return true;
    } else {
      return false;
    }
  }
  */
  Boolean rideExists(String id){
    FindIterable<Document> rideDocs = rideCollection.find(new Document("_id", new ObjectId(id)));
    Iterator<Document> iterator = rideDocs.iterator();

    if (iterator.hasNext()) {
      //The ride exists
      System.out.println("Ride does exist");
      return true;
    }else {
      //The ride doesn't exist
      System.out.println("Ride does not exist");
      return false;
    }
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

    if (queryParams.containsKey("driving")) {
      Boolean targetBool = Boolean.parseBoolean(queryParams.get("driving")[0]);
      filterDoc = filterDoc.append("driving", targetBool);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingRides = rideCollection.find(filterDoc);
    Iterable<Document> ridesWithUsers = addUsersToRides(matchingRides);
    return serializeIterable(ridesWithUsers);
  }

  //This code is untested because it is a part of user profiles, which we decided was out of scope for our security group's iteration
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

  String addNewRide(Document rideInfo) {

    try {
      rideCollection.insertOne(rideInfo);
      ObjectId _id = rideInfo.getObjectId("_id");
      System.err.println("Successfully added new ride [_id=" + _id + ']');
      return _id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }

  Boolean deleteRide(String rideId, String userMongoId){
    ObjectId objId = new ObjectId(rideId);
    try {
      Document deleteDoc = new Document();
      deleteDoc.append("_id", objId);
      deleteDoc.append("ownerId", userMongoId);
      //Try to delete the ride (Requires correct ride id and user id)
      DeleteResult deleteDocs = rideCollection.deleteOne(deleteDoc);
      //If delete was successful, we're done; return true.
      if (deleteDocs.getDeletedCount() != 0) {
        return true;
        //Otherwise, try to find out why it didn't work
        //This isn't necessary, but in an ideal world we would return either
        //404 Ride not found
        //403 Forbidden
        //instead of just false
      } else {
        //Check if the ride exists
        //This code doesn't really do anything right now, but is useful for server logging
        //As well as future implementation
        if (rideExists(objId.toHexString())) {
          //The ride exists, ideally we would return 403
          System.out.println(403);
          return false;
        } else {
          //The ride does not exist, ideally we would return 404
          System.out.println(404);
          return false;
        }
      }
    }
    catch(MongoException e){
      System.out.println("An error occurred while deleting ride.");
      e.printStackTrace();
      return false;
    }

  }

  Boolean updateRide(Document updatedRide){
    String idString = updatedRide.getString("_id");
    Document filter = new Document("_id", new ObjectId(idString));
    filter.append("ownerId", updatedRide.get("ownerId"));
    updatedRide.remove("_id");
    Document updateDoc = new Document("$set", updatedRide);
    try{
      UpdateResult update = rideCollection.updateOne(filter, updateDoc);
      //If update was successful, we're done; return true.
      if(update.getModifiedCount() != 0){
        return true;
        //Otherwise, try to find out why it didn't work
        //This isn't necessary, but in an ideal world we would return either
        //404 Ride not found
        //403 Forbidden
        //instead of just false
      }else{
        //Check if the ride exists
        //This code doesn't really do anything right now, but is useful for server logging
        //As well as future implementation
        if(rideExists(idString)){
          //The ride exists, ideally we would return 403
          System.out.println(403);
          return false;
        }else{
          //The ride does not exist, ideally we would return 404
          System.out.println(404);
          return false;
        }


      }
    }
    catch(MongoException e){
      System.out.println("An error occurred while deleting ride.");
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

  //This code is untested because it is a part of user profiles, which we decided was out of scope for our security group's iteration
  private String getStringField(String userId, String field) {
    FindIterable<Document> jsonRides = userCollection.find(eq("userId", userId)); //this userId is probably a mongo object id and not a google subject thing
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

  Boolean addRider(String rideId, String riderId, String riderName) {
    ObjectId objId = new ObjectId(rideId);
    Document filter = new Document("_id", objId);
    //Cannot check this because the riderList only stores names.
    //filter.append("riderList", "{$not: '" + newRiderId +"' }");
    filter.append("ownerId", new Document("$not", new Document("$eq", riderId)));
    Document updateDoc = new Document();
    updateDoc.append("$push", new Document("riderList", riderName));
    try{
      System.out.println(filter);
      System.out.println(updateDoc);
      UpdateResult out = rideCollection.updateOne(filter, updateDoc);
      System.out.println(out);
      //returns false if no documents were modified, true otherwise
      return out.getModifiedCount() != 0;
    }catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }
}
