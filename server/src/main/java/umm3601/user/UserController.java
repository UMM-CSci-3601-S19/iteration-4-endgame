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

  Boolean rateUser(String id, Integer totalReviewScore, Integer numReviews, Double avgScore) {
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
}
