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

  //Todo: Test getUserRides Method

  @Before
  public void clearAndPopulateDB(){
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> rideDocuments = db.getCollection("Rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    Document ride = new Document();
    testRides.add(Document.parse("{\n" +
      "ownerId: \"5ca243f0712ed630c21a8407\",\n" +
      "destination: \"Maplegrove\",\n" +
      "origin: \"Knight Court\",\n" +
      "roundTrip: true,\n" +
      "departureDate: \"2019-08-08T05:00:00.000Z\",\n" +
      "departureTime: \"15:00\",\n" +
      "driving: true,\n" +
      "mpg: 20,\n" +
      "numSeats: 4,\n" +
      "riderList: [],\n" +
      "notes: \"I like to drive with no air conditioning\"\n" +
      "}"));
    testRides.add(Document.parse("{\n" +
      "ownerId: \"5ca243f0b4676a59e54a2ca6\",\n" +
      "destination: \"St.Paul\",\n" +
      "origin: \"Polar Street\",\n" +
      "roundTrip: false,\n" +
      "departureDate: \"2019-04-08T05:00:00.000Z\",\n" +
      "departureTime: \"09:47\",\n" +
      "driving: false,\n" +
      "mpg: 20,\n" +
      "numSeats: 2,\n" +
      "riderList: ['Jim'],\n" +
      "notes: \"No room in the trunk of my car\"\n" +
      "}"));
    testRides.add(Document.parse("{\n" +
      "ownerId: \"5ca243f04e7664997cbc9119\",\n" +
      "destination: \"Duluth\",\n" +
      "origin: \"Oliver Street\",\n" +
      "roundTrip: true,\n" +
      "departureDate: \"2019-09-08T05:00:00.000Z\",\n" +
      "departureTime: \"01:29\",\n" +
      "driving: false,\n" +
      "mpg: 20,\n" +
      "numSeats: 12,\n" +
      "riderList: [],\n" +
      "notes: \"I love to crank the volume up to 11\"\n" +
      "}"));
    rideDocuments.insertMany(testRides);

    knownId = new ObjectId();
    BasicDBObject knownObj = new BasicDBObject("_id", knownId);
    knownObj = knownObj
      .append("ownerId", "5ca243f0db41ec9258d40336")
      .append("destination", "Moon Moon")
      .append("origin", "Balfour Place")
      .append("roundTrip", false)
      .append("departureDate", "2020-05-12T05:00:00.000Z")
      .append("departureTime", "06:12")
      .append("driving", true)
      .append("mpg", 15)
      .append("riderList", new ArrayList())
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


  private static String getDestination(BsonValue val) {
    return getAttribute(val, "destination");
  }
  private static String getMPG(BsonValue val) { return getAttribute(val, "mpg"); }

  @Test
  public void getAllRides() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should have 4 rides", 4, docs.size());
    List<String> destinations = docs
      .stream()
      .map(RideControllerSpec::getDestination)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDestinations = Arrays.asList("Duluth","Maplegrove", "Moon Moon", "St.Paul");
    assertEquals("Destinations should match", expectedDestinations, destinations);
  }

  @Test
  public void getRideById(){
    String jsonResult = rideController.getRide(knownId.toString());
    Document result = Document.parse(jsonResult);
    assertEquals("Destination should match", "Moon Moon", result.get("destination"));
    String noJsonResult = rideController.getRide(new ObjectId().toString());
    assertNull("No ride should be found", noJsonResult);
  }


  @Test
  public void getRideByDriving(){
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("driving", new String[]{"true"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 2 rides driving", 2, docs.size());
    List<String> drivers = docs.stream().map(RideControllerSpec::getDestination).sorted().collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Maplegrove", "Moon Moon");
    assertEquals("Number of drivers should match", expectedDrivers, drivers);
  }

  @Test
  public void addRide(){
    Map<String, String[]> emptyMap = new HashMap<>();
    String beforeResult = rideController.getRides(emptyMap);
    BsonArray beforeDocs = parseJsonArray(beforeResult);
    assertEquals("Should have 4 riders before adding a new one", 4, beforeDocs.size());
    List<String> riderList = Arrays.asList("RiderOne");
    Document doc = new Document();
    doc.append("ownerId", "5cb8bee0889cc09ffc7a0205");
    doc.append("destination", "Far, Far Away");
    doc.append("origin", "The RFC");
    doc.append("driving", false);
    doc.append("roundTrip", true);
    doc.append("departureDate", "2020-04-07");
    doc.append("departureTime", "5:00 PM");
    doc.append("mpg","30");
    doc.append("notes", "We're never coming back.");
    doc.append("numSeats", "4");
    String jsonResult = rideController.addNewRide(doc);
    assertNotNull("Add ride result should not be null", jsonResult);
    String afterResult = rideController.getRides(emptyMap);
    BsonArray afterDocs = parseJsonArray(afterResult);
    assertEquals("Should have 5 rides after adding a new one", 5, afterDocs.size());
    List<String> destinations = afterDocs
      .stream()
      .map(RideControllerSpec::getDestination)
      .collect(Collectors.toList());
    assertTrue("Should contain newly added destination", destinations.contains("Far, Far Away"));

  }

  @Test
  public void deleteRide(){
    //Bad Deletion - User does not own ride (403)
    Boolean badUserResp = rideController.deleteRide(knownId.toString(), new ObjectId().toHexString());
    assertFalse("Unsuccessful deletion should return false", badUserResp);

    //Good Deletion - Ride exists and user owns ride
    Map<String, String[]> emptyMap = new HashMap<>();
    Boolean resp = rideController.deleteRide(knownId.toString(), "5ca243f0db41ec9258d40336");
    //Post-deletion testing
    assertTrue("Successful deletion should return true", resp);
    String result = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(result);
    assertEquals("Should have 3 rides after deletion", 3, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDestination)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Duluth", "Maplegrove", "St.Paul");
    assertEquals("Drivers should match after deletion", expectedDrivers, drivers);
    //Bad Deletion - Ride does not exist (404)
    Boolean badResp = rideController.deleteRide(new ObjectId().toString(), "5ca243f0db41ec9258d40336");
    assertFalse("Unsuccessful deletion should return false", badResp);
    result = rideController.getRides(emptyMap);
    docs = parseJsonArray(result);
    assertEquals("Should still have 3 rides after bad deletion", 3, docs.size());
  }

  @Test
  public void updateRide(){
    Map<String, String[]> emptyMap = new HashMap<>();
    //Test good update
    Document doc = new Document();
    doc.append("_id", knownId.toHexString());
    doc.append("ownerId", "5ca243f0db41ec9258d40336");
    doc.append("destination", "Milwaukee");
    doc.append("origin", "Arizona");
    doc.append("driving", false);
    doc.append("roundTrip", false);
    doc.append("departureDate", "2019-04-01TT05:00:00.000Z");
    doc.append("departureTime", "03:00");
    doc.append("mpg","30");
    doc.append("notes", "Lets Go!");
    doc.append("numSeats", "4");
    Boolean resp = rideController.updateRide(doc);
    assertTrue("Successful update should return true",resp);
    String result = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(result);
    assertEquals("Should have 4 riders after update", 4, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDestination)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Duluth", "Maplegrove", "Milwaukee", "St.Paul");
    assertEquals("Drivers should match after update", expectedDrivers, drivers);
    String singleResultJson = rideController.getRide(knownId.toString());
    Document singleResult = Document.parse(singleResultJson);
    assertEquals("Id should match", knownId.toHexString(), singleResult.get("_id").toString());
    assertEquals("Destination should match", "Milwaukee", singleResult.get("destination"));
    assertEquals("Origin should match", "Arizona", singleResult.get("origin"));
    assertEquals("Round Trip should match", false, singleResult.get("roundTrip"));
    assertEquals("Driving should match", false, singleResult.get("driving"));
    assertEquals("Departure Date should match", "2019-04-01TT05:00:00.000Z", singleResult.get("departureDate"));
    assertEquals("Departure Time should match", "03:00", singleResult.get("departureTime"));
    assertEquals("Notes should match", "Lets Go!", singleResult.get("notes"));
    //Test bad update - Incorrect User
    doc.append("_id", knownId.toHexString());
    doc.append("ownerId", new ObjectId().toHexString());
    Boolean badUser = rideController.updateRide(doc);
    assertFalse("Unsuccessful update should return false", badUser);
    assertEquals("Should have 4 riders after failed update", 4, docs.size());
    assertEquals("Drivers should match after failed update", expectedDrivers, drivers);
    //Test bad update - Ride does not exist
    doc.append("_id", new ObjectId().toHexString());
    doc.append("ownerId", "5ca243f0db41ec9258d40336");
    Boolean badResp = rideController.updateRide(doc);
    assertFalse("Unsuccessful update should return false", badResp);
    assertEquals("Should have 4 riders after failed update", 4, docs.size());
    assertEquals("Drivers should match after failed update", expectedDrivers, drivers);

  }

  @Test
  public void addRider(){
    //Bad Request: User requesting to be added owns the ride
    Boolean badResp = rideController.addRider(knownId.toString(), "5ca243f0db41ec9258d40336", "James");
    assertFalse("Rider should not add themselves to their ride", badResp);
    //Good Request: User is added to ride
    Boolean goodResp = rideController.addRider(knownId.toString(), new ObjectId().toHexString(), "James James");
    assertTrue("Rider can join a ride", goodResp);
    Document ride = Document.parse(rideController.getRide(knownId.toString()));
    assertEquals("Rider is now added to the ride", "[James James]", ride.get("riderList").toString());
  }
}

