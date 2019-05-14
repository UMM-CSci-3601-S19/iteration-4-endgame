package umm3601;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import spark.Request;

import java.util.Collections;
import java.util.Iterator;

public class GoogleAuth {
  private static final String CLIENT_ID = "375549452265-kpv6ds6lpfc0ibasgeqcgq1r6t6t6sth.apps.googleusercontent.com";

  private static final NetHttpTransport transport = new NetHttpTransport();

  private static final GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, JacksonFactory.getDefaultInstance())
    // Specify the CLIENT_ID of the app that accesses the backend:
    .setAudience(Collections.singletonList(CLIENT_ID))
    // Or, if multiple clients access the backend:
    //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
    .build();

  private final MongoCollection<Document> userCollection;

  public GoogleAuth(MongoDatabase database) {
    this.userCollection = database.getCollection("Users");
  }

  public GoogleIdToken auth(Request req){
    return auth(Document.parse(req.body()));
  }
  public GoogleIdToken auth(Document body){
    return auth(body.getString("idtoken"));
  }
  public GoogleIdToken auth(String token){
    try {
      System.out.println(token);
      return verifier.verify(token);
    } catch (Exception e) {
      //Should return 401: Unauthorized
      System.err.println("Invalid ID token");
      e.printStackTrace();
      return null;
    }
  }

  public String getEmail(String token){
    return auth(token).getPayload().getEmail();
  }

  public String getName(Request req){
    return getName(Document.parse(req.body()));
  }
  public String getName(Document body) { return getName(body.getString("idtoken"));}
  public String getName(String token){
    return (String) auth(token).getPayload().get("name");
  }

  public String getUserId(String token){
    return (String) auth(token).getPayload().getSubject();
  }
  public String getPicture(String token){
    return (String) auth(token).getPayload().get("picture");
  }

  public String getUserMongoId(GoogleIdToken token){
    return getUserMongoId(token.getPayload().getSubject());
  }

  public String getUserMongoId(String googleSubjectId) {
    Document filterDoc = new Document("userId", googleSubjectId);
    FindIterable<Document> matchingUser = userCollection.find(filterDoc);
    Iterator<Document> iterator = matchingUser.iterator();
    if (iterator.hasNext()) {
      Document user = iterator.next();
      String userMongoId = user.getObjectId("_id").toHexString();
      System.out.println("Got user's mongo ID: " + userMongoId);
      return userMongoId;
    } else {
      return null;
    }
  }

}
