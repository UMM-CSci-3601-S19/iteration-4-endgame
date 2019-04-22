package umm3601.user;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
//Todo: Maybe find something not deprecated.
import com.mongodb.util.JSON;

import static com.mongodb.client.model.Filters.eq;

public class UserController {

  private final MongoCollection<Document> userCollection;

  public UserController(MongoDatabase database) {
    userCollection = database.getCollection("Users");
  }

  String getUser(String id) {
    FindIterable<Document> jsonUsers = userCollection.find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonUsers.iterator();
    if (iterator.hasNext()) {
      Document user = iterator.next();
      return user.toJson();
    } else {
      // We didn't find the desired user
      return null;
    }
  }

  String getUsers(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingRides = userCollection.find(filterDoc);
    return serializeIterable(matchingRides);
  }

  private String serializeIterable(Iterable<Document> documents) {

    return StreamSupport.stream(documents.spliterator(), false)
      .map((Document d) -> d.toJson())
      .collect(Collectors.joining(", ", "[", "]"));
  }

  Boolean editInfo(String id, String bio, String phoneNumber) {
    ObjectId userId = new ObjectId(id);
    Document filter = new Document("_id", userId);
    Document updateFields = new Document();
    updateFields.append("bio", bio);
    updateFields.append("phoneNumber", phoneNumber);

    Document updateDoc = new Document("$set", updateFields);
    try {
      UpdateResult out = userCollection.updateOne(filter, updateDoc);
      return out.getModifiedCount() != 0;
    } catch(MongoException e) {
      e.printStackTrace();
      return false;
    }
  }

  Boolean rateUser(String id, Integer totalReviewScore, Integer numReviews, Integer avgScore) {
    ObjectId objId = new ObjectId(id);
    Document filter = new Document("_id", objId);
    Document updateFields = new Document();
    updateFields.append("totalReviewScore", totalReviewScore);
    updateFields.append("numReviews", numReviews);
    updateFields.append("avgScore", avgScore);

    Document updateDoc = new Document("$set", updateFields);
    try{
      UpdateResult out = userCollection.updateOne(filter, updateDoc);
      return out.getModifiedCount() != 0;
    }catch(MongoException e){
      e.printStackTrace();
      return false;
    }
  }

  String signup(String userId, String email, String name, String pictureUrl){
    Document filterDoc = new Document();

    Document contentRegQuery = new Document();
    contentRegQuery.append("$regex", userId);
    contentRegQuery.append("$options", "i");
    filterDoc = filterDoc.append("userId", contentRegQuery);

    FindIterable<Document> matchingUsers = userCollection.find(filterDoc);

    if(JSON.serialize(matchingUsers).equals("[ ]")) {
      ObjectId id = new ObjectId();

      Document newUser = new Document();
      newUser.append("_id", id);
      newUser.append("userId", userId);
      newUser.append("name", name);
      newUser.append("bio", "Nothing here yet");
      newUser.append("email", email);
      newUser.append("totalReviewScore", 0);
      newUser.append("numReviews", 0);

      newUser.append("pictureUrl", pictureUrl);
      try {
        userCollection.insertOne(newUser);
        // return JSON.serialize(newUser);
        Document userInfo = new Document();
        userInfo.append("_id", matchingUsers.first().get("_id"));
        userInfo.append("email", matchingUsers.first().get("email"));
        userInfo.append("name", matchingUsers.first().get("name"));
        userInfo.append("pictureUrl", matchingUsers.first().get("pictureUrl"));
        System.err.println("Successfully added new user [_id=" + id + ", userId=" + userId + " email=" + email + " name=" + name + " pictureUrl " + pictureUrl + "]");
        return "New User added";
      }catch(MongoException e){
        e.printStackTrace();
        return "Error trying to create user";
      }
    }else {
      return "User already exists";
    }
  }

  String login(String userId, String email, String name) {

    System.out.println("Checking database for user");
    FindIterable<Document> matchingUser = userCollection.find(eq("userId", userId));

    System.out.println("Is this a new user?   " + serializeIterable(matchingUser).equals("[]"));

    if (serializeIterable(matchingUser).equals("[]")) {
      ObjectId id = new ObjectId();
      Document newUser = new Document();

      newUser.append("_id", id);
      newUser.append("userId", userId);
      newUser.append("name", name);
      newUser.append("bio", "Nothing here yet");
      newUser.append("email", email);
      newUser.append("totalReviewScore", 0);
      newUser.append("numReviews", 0);
      try {
        userCollection.insertOne(newUser);
        System.out.println("Successfully added new user [_id: " + id + " | userId: " + userId + " | name: " + name + " | bio: Nothing here yet " + " | email: " + email + " | totalReviewScore: 0 | numReviews: 0");
        return "New user successfully added";
      } catch (MongoException e) {
        e.printStackTrace();
        return "Error trying to create user";
      }
    } else {
      System.out.println(serializeIterable(matchingUser));

      Document filter = new Document("userId", userId);
      Document getName = new Document();

      getName.append("name", name);

      Document setName = new Document("$set", getName);
      try {
        userCollection.updateOne(filter, setName);
        System.out.println("Updating a user [userId: " + userId + " | name: " + name + " was successful");
        return "Success in logging in returning user";
      } catch (MongoException e) {
        e.printStackTrace();
        return "Error trying to log in a returning user";
      }
    }
  }
}
