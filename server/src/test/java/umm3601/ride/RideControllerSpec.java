package umm3601.ride;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.junit.Before;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import com.mongodb.BasicDBObject;
import org.junit.Test;


import java.util.*;
import java.util.stream.Collectors;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class RideControllerSpec {
  private RideController rideController;
  private ObjectId knownId;

  //Todo: This functionality is not implemented
  //Add protection against entries with improper or empty ownerId field
  //Todo: This functionality is not tested
  //Check ownerData has been properly added (Involve


  @Before
  public void clearAndPopulateDB(){
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> rideDocuments = db.getCollection("Rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "driver: \"Marci Sears\",\n" +
      "ownerId: \"5ca243f0712ed630c21a8407\",\n" +
      "destination: \"Maplegrove\",\n" +
      "origin: \"Knight Court\",\n" +
      "roundTrip: true,\n" +
      "departureDate: \"2019-08-08T05:00:00.000Z\",\n" +
      "departureTime: \"15:00\",\n" +
      "driving: true,\n" +
      "mpg: 20,\n" +
      "notes: \"I like to drive with Y	no air conditioning\"\n" +
      "}"));
    testRides.add(Document.parse("{\n" +
      "driver: \"Boyer Kramer\",\n" +
      "ownerId: \"5ca243f0b4676a59e54a2ca6\",\n" +
      "destination: \"St.Paul\",\n" +
      "origin: \"Polar Street\",\n" +
      "roundTrip: false,\n" +
      "departureDate: \"2019-04-08T05:00:00.000Z\",\n" +
      "departureTime: \"09:47\",\n" +
      "driving: false,\n" +
      "mpg: 20,\n" +
      "notes: \"No room in the trunk of my car\"\n" +
      "}"));
    testRides.add(Document.parse("{\n" +
      "driver: \"Millie Flores\",\n" +
      "ownerId: \"5ca243f04e7664997cbc9119\",\n" +
      "destination: \"Duluth\",\n" +
      "origin: \"Oliver Street\",\n" +
      "roundTrip: true,\n" +
      "departureDate: \"2019-09-08T05:00:00.000Z\",\n" +
      "departureTime: \"01:29\",\n" +
      "driving: false,\n" +
      "mpg: 20,\n" +
      "notes: \"I love to crank the volume up to 11\"\n" +
      "}"));
    rideDocuments.insertMany(testRides);

    knownId = new ObjectId();
    BasicDBObject knownObj = new BasicDBObject("_id", knownId);
    knownObj = knownObj
      .append("driver", "Carter Browning")
      .append("ownerId", "5ca243f0db41ec9258d40336")
      .append("destination", "Maplegrove")
      .append("origin", "Balfour Place")
      .append("roundTrip", false)
      .append("departureDate", "2020-05-12T05:00:00.000Z")
      .append("departureTime", "06:12")
      .append("driving", true)
      .append("mpg", 15)
      .append("notes", "I will pay for lunch for anyone who is riding with me and I am a cool guy");
    rideDocuments.insertOne(Document.parse(knownObj.toJson()));

    rideController = new RideController(db);
  }

  private static BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getAttribute(BsonValue val, String attribute){
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get(attribute)).getValue();
  }

  private static String getDriver(BsonValue val) {
    return getAttribute(val, "driver");
  }
  private static String getDestination(BsonValue val) {
    return getAttribute(val, "destination");
  }
  private static String getMPG(BsonValue val) { return getAttribute(val, "mpg"); }

  @Test
  public void getAllRides() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should have 4 riders", 4, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Boyer Kramer", "Carter Browning", "Marci Sears", "Millie Flores");
    assertEquals("Drivers should match", expectedDrivers, drivers);
  }

  @Test
  public void getRideById(){
    String jsonResult = rideController.getRide(knownId.toString());
    Document result = Document.parse(jsonResult);
    assertEquals("Driver should match", "Carter Browning", result.get("driver"));
    String noJsonResult = rideController.getRide(new ObjectId().toString());
    assertNull("No ride should be found", noJsonResult);
  }

  @Test
  public void getRideByDriver(){
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("driver", new String[]{"Marci Sears"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 1 driver", 1, docs.size());
    List<String> drivers = docs.stream().map(RideControllerSpec::getDriver).sorted().collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Marci Sears");
    assertEquals("Drivers should match", expectedDrivers, drivers);
  }

  @Test
  public void getRideByDriving(){
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("driving", new String[]{"true"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 2 rides driving", 2, docs.size());
    List<String> drivers = docs.stream().map(RideControllerSpec::getDriver).sorted().collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Carter Browning", "Marci Sears");
    assertEquals("Number of drivers should match", expectedDrivers, drivers);
  }

  @Test
  public void addRide(){
    Map<String, String[]> emptyMap = new HashMap<>();
    String beforeResult = rideController.getRides(emptyMap);
    BsonArray beforeDocs = parseJsonArray(beforeResult);
    assertEquals("Should have 4 riders before adding a new one", 4, beforeDocs.size());
    String jsonResult = rideController.addNewRide("Good Driver", "Far, Far Away", "The RFC", false, true,"2020-04-07", "5:00 PM","30", "We're never coming back.", "5ca243f0db41ec9258d40336");
    assertNotNull("Add ride result should not be null", jsonResult);
    String afterResult = rideController.getRides(emptyMap);
    BsonArray afterDocs = parseJsonArray(afterResult);
    assertEquals("Should have 5 riders after adding a new one", 5, afterDocs.size());
    List<String> destinations = afterDocs
      .stream()
      .map(RideControllerSpec::getDestination)
      .collect(Collectors.toList());
    assertTrue("Should contain newly added destination", destinations.contains("Far, Far Away"));
  }

  @Test
  public void deleteRide(){
    Map<String, String[]> emptyMap = new HashMap<>();
    //Deletion
    Boolean resp = rideController.deleteRide(knownId.toString());
    //Post-deletion testing
    assertTrue("Successful deletion should return true", resp);
    String result = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(result);
    assertEquals("Should have 3 riders after deletion", 3, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Boyer Kramer", "Marci Sears", "Millie Flores");
    assertEquals("Drivers should match after deletion", expectedDrivers, drivers);
    //Bad Deletion
    Boolean badResp = rideController.deleteRide(new ObjectId().toString());
    assertFalse("Unsuccessful deletion should return false", badResp);
    result = rideController.getRides(emptyMap);
    docs = parseJsonArray(result);
    assertEquals("Should still have 3 riders after bad deletion", 3, docs.size());

  }

  @Test
  public void updateRide(){
    Map<String, String[]> emptyMap = new HashMap<>();
    //Test good update
    Boolean resp = rideController.updateRide(knownId.toString(), "Christian", "Milwaukee", "Arizona", false, false,"2019-04-01TT05:00:00.000Z", "03:00", "30", "Lets Go!");
    assertTrue("Successful update should return true",resp);
    String result = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(result);
    assertEquals("Should have 4 riders after update", 4, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Boyer Kramer", "Christian", "Marci Sears", "Millie Flores");
    assertEquals("Drivers should match after update", expectedDrivers, drivers);
    String singleResultJson = rideController.getRide(knownId.toString());
    Document singleResult = Document.parse(singleResultJson);
    assertEquals("Driver should match", "Christian", singleResult.get("driver"));
    assertEquals("Destination should match", "Milwaukee", singleResult.get("destination"));
    assertEquals("Origin should match", "Arizona", singleResult.get("origin"));
    assertEquals("Round Trip should match", false, singleResult.get("roundTrip"));
    assertEquals("Driving should match", false, singleResult.get("driving"));
    assertEquals("Departure Date should match", "2019-04-01TT05:00:00.000Z", singleResult.get("departureDate"));
    assertEquals("Departure Time should match", "03:00", singleResult.get("departureTime"));
    assertEquals("Notes should match", "Lets Go!", singleResult.get("notes"));
    //Test bad update
    Boolean badResp = rideController.updateRide(new ObjectId().toString(), "Christian2", "Milwaukee", "Arizona", false, true,"2019-04-01TT05:00:00.000Z","14:05","100", "Lets Go!");
    assertFalse("Unsuccessful update should return false", badResp);
    assertEquals("Should have 4 riders after failed update", 4, docs.size());
    assertEquals("Drivers should match after failed update", expectedDrivers, drivers);

  }
}
