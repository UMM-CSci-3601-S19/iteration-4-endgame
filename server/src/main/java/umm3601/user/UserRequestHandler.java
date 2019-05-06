package umm3601.user;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.bson.Document;
import spark.Request;
import spark.Response;
import umm3601.GoogleAuth;
import umm3601.Server;
import umm3601.user.UserController;

import java.util.Collections;
import java.util.List;

public class UserRequestHandler {
  private final UserController userController;
  private final GoogleAuth gauth;


  private static final String CLIENT_ID = "375549452265-kpv6ds6lpfc0ibasgeqcgq1r6t6t6sth.apps.googleusercontent.com";

  private static final String CLIENT_SECRET_FILE = "../secret.json";

  private static NetHttpTransport transport = new NetHttpTransport();

  public UserRequestHandler(UserController userController, GoogleAuth gauth) {
    this.userController = userController;
    this.gauth = gauth;
  }

  public String getUserJSON(Request req, Response res) {
    res.type("application/json");
    String id = req.params("id");
    String user;
    try {
      user = userController.getUser(id);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested user ID, " + id + ", wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (user != null) {
      return user;
    } else {
      res.status(404);
      res.body("The requested user with id " + id + " was not found");
      return "";
    }
  }

  public String getUsers(Request req, Response res) {
    res.type("application/json");
    return userController.getUsers(req.queryMap().toMap());
  }

  public Boolean editUserProfile(Request req, Response res) {
    res.type("application/json");

    Document editInfo = Document.parse(req.body());

    String id = editInfo.getObjectId("_id").toHexString();
    String bio = editInfo.getString("bio");
    String phoneNumber = editInfo.getString("phoneNumber");

    return userController.editInfo(id, bio, phoneNumber);
  }

  public Boolean rateUser(Request req, Response res) {
    res.type("application/json");

    Document rateUser = Document.parse(req.body());

    String id = rateUser.getObjectId("_id").toHexString();
    Integer totalReviewScore = rateUser.getInteger("totalReviewScore");
    Integer numReviews = rateUser.getInteger("numReviews");
    Integer avgScore = rateUser.getInteger("avgScore");

    return userController.rateUser(id, totalReviewScore, numReviews, avgScore);
  }

  public String login(Request req, Response res) {
    res.type("application/json");

    Document body = Document.parse(req.body());
    String token = body.getString("idtoken"); //key formerly 'code'
    GoogleIdToken idToken = gauth.auth(token);
    if (idToken != null) {
      GoogleIdToken.Payload payload = idToken.getPayload();
      String userId = payload.getSubject();
      String email = payload.getEmail();
      String name = (String) payload.get("name");
      return userController.login(userId, email, name);
    } else {
      return null;
    }
  }
  public String signup(Request req, Response res) {
    res.type("application/json");

    Document body = Document.parse(req.body());
    GoogleIdToken idToken = gauth.auth(body);
    if (idToken != null) {
      GoogleIdToken.Payload payload = idToken.getPayload();
      String userId = payload.getSubject();
      String email = payload.getEmail();
      String name = (String) payload.get("name");
      String pictureUrl = (String) payload.get("picture");
      return userController.signup(userId, email, name, pictureUrl);
    }else{
      return null;
    }
  }
}
