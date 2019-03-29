package umm3601.user;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
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
}
