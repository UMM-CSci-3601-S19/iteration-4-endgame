package umm3601.user;

import org.apache.commons.lang3.ArrayUtils;
import org.bson.Document;
import spark.Request;
import spark.Response;
import umm3601.user.UserController;

import java.util.List;

public class UserRequestHandler {
  private final UserController userController;

  public UserRequestHandler(UserController userController) {
    this.userController = userController;
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

  public Boolean rateUser(Request req, Response res) {
    res.type("application/json");

    Document rateUser = Document.parse(req.body());

    String id = rateUser.getObjectId("_id").toHexString();
    return userController.rateUser(id, rateUser.getInteger("reviewScores"), rateUser.getInteger("numReviews"));
  }

}
