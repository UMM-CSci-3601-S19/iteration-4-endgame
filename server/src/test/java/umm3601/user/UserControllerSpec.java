//package umm3601.user;
//
//import com.mongodb.BasicDBObject;
//import com.mongodb.MongoClient;
//import com.mongodb.client.MongoCollection;
//import com.mongodb.client.MongoDatabase;
//import org.bson.*;
//import org.bson.codecs.*;
//import org.bson.codecs.configuration.CodecRegistries;
//import org.bson.codecs.configuration.CodecRegistry;
//import org.bson.json.JsonReader;
//import org.bson.types.ObjectId;
//import org.junit.Before;
//import org.junit.Test;
//
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//import static junit.framework.TestCase.assertEquals;
//import static junit.framework.TestCase.assertFalse;
//import static org.junit.Assert.assertNull;
//import static org.junit.Assert.assertTrue;
//
//public class UserControllerSpec {
//  private UserController userController;
//  private ObjectId knownId;
//
//
//  @Before
//  public void clearAndPopulateDB(){
//    MongoClient mongoClient = new MongoClient();
//    MongoDatabase db = mongoClient.getDatabase("test");
//    MongoCollection<Document> userDocuments = db.getCollection("Users");
//    userDocuments.drop();
//    List<Document> testUsers = new ArrayList<>();
//    testUsers.add(Document.parse("{\n" +
//      "name: \"Marci Sears\",\n" +
//      "email: \"sear007@morris.umn.edu\",\n" +
//      "phoneNumber: \"320 555 5555\",\n" +
//      "}"));
//    testUsers.add(Document.parse("{\n" +
//      "name: \"Sarci Mears\",\n" +
//      "email: \"mear420@morris.umn.edu\",\n" +
//      "phoneNumber: \"920 555 5555\",\n" +
//      "}"));
//    testUsers.add(Document.parse("{\n" +
//      "name: \"Marci Sears Jr\",\n" +
//      "email: \"sear000@morris.umn.edu\",\n" +
//      "phoneNumber: \"414 555 5555\",\n" +
//      "}"));
//    userDocuments.insertMany(testUsers);
//
//    knownId = new ObjectId();
//    BasicDBObject knownObj = new BasicDBObject("_id", knownId);
//    knownObj = knownObj
//      .append("name", "Marci Sears III")
//      .append("bio", "Hey look I have a bio ;>")
//      .append("email", "sear999@umn.edu")
//      .append("phoneNumber", "320 320 3200");
//    userDocuments.insertOne(Document.parse(knownObj.toJson()));
//
//    userController = new UserController(db);
//  }
//
//  private static BsonArray parseJsonArray(String json) {
//    final CodecRegistry codecRegistry
//      = CodecRegistries.fromProviders(Arrays.asList(
//      new ValueCodecProvider(),
//      new BsonValueCodecProvider(),
//      new DocumentCodecProvider()));
//
//    JsonReader reader = new JsonReader(json);
//    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);
//
//    return arrayReader.decode(reader, DecoderContext.builder().build());
//  }
//  private static String getAttribute(BsonValue val, String attribute){
//    BsonDocument doc = val.asDocument();
//    return ((BsonString) doc.get(attribute)).getValue();
//  }
//
//  private static String getName(BsonValue val){ return getAttribute(val, "name"); }
//
//  @Test
//  public void getAllUsers() {
//    Map<String, String[]> emptyMap = new HashMap<>();
//    String jsonResult = userController.getUsers(emptyMap);
//    BsonArray docs = parseJsonArray(jsonResult);
//    assertEquals("Should have 4 riders", 4, docs.size());
//    List<String> drivers = docs
//      .stream()
//      .map(val -> getAttribute(val, "name"))
//      .sorted()
//      .collect(Collectors.toList());
//    List<String> expectedDrivers = Arrays.asList("Marci Sears", "Marci Sears III", "Marci Sears Jr", "Sarci Mears");
//    assertEquals("Drivers should match", expectedDrivers, drivers);
//  }
//
//  @Test
//  public void getUserById(){
//    String jsonResult = userController.getUser(knownId.toString());
//    Document result = Document.parse(jsonResult);
//    assertEquals("Name should match", "Marci Sears III", result.get("name"));
//    String noJsonResult = userController.getUser(new ObjectId().toString());
//    assertNull("No ride should be found", noJsonResult);
//  }
//
//  @Test
//  public void editUser() {
//    Map<String, String[]> emptyMap = new HashMap<>();
//
//    Boolean resp = userController.editInfo(knownId.toString(),"I have 2 droids, R2UwU-D2UwU and c-3POwO", "(123) 456-7890");
//    assertTrue("Successful edit should return true", resp);
//
//    String singleResultJson = userController.getUser(knownId.toString());
//    Document singleResult = Document.parse(singleResultJson);
//    assertEquals("Name should match", "Marci Sears III", singleResult.get("name"));
//    assertEquals("Bio should match", "I have 2 droids, R2UwU-D2UwU and c-3POwO", singleResult.get("bio"));
//    assertEquals("Email should match", "sear999@umn.edu", singleResult.get("email"));
//    assertEquals("Phone Number should match", "(123) 456-7890", singleResult.get("phoneNumber"));
//  }
//
//  @Test
//  public void rateUser() {
//    String jsonResultNoReviews = userController.getUser(knownId.toString());
//    Document resultNoReviews = Document.parse(jsonResultNoReviews);
//    assertFalse("User should have no reviews", resultNoReviews.containsKey("numReviews"));
//    assertFalse("User should have no review score", resultNoReviews.containsKey("totalReviewScore"));
//    assertFalse("User should have no average score", resultNoReviews.containsKey("avgScore"));
//    userController.rateUser(knownId.toString(), 12, 3, 4);
//    String jsonResult = userController.getUser(knownId.toString());
//    Document result = Document.parse(jsonResult);
//    assertEquals("Number of reviews should be 3", 3, (int) result.getInteger("numReviews"));
//    assertEquals("Aggregate review score should be 12", 12, (int) result.getInteger("totalReviewScore"));
//    assertEquals("Average review score should be 4", 4, (int) result.getInteger("avgScore"));
//  }
//}
