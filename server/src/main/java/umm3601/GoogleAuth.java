package umm3601;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.bson.Document;
import spark.Request;

import java.util.Collections;

public class GoogleAuth {
  private static final String CLIENT_ID = "375549452265-kpv6ds6lpfc0ibasgeqcgq1r6t6t6sth.apps.googleusercontent.com";

  private static final String CLIENT_SECRET_FILE = "../secret.json";

  private static final NetHttpTransport transport = new NetHttpTransport();

  private static final GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, JacksonFactory.getDefaultInstance())
    // Specify the CLIENT_ID of the app that accesses the backend:
    .setAudience(Collections.singletonList(CLIENT_ID))
    // Or, if multiple clients access the backend:
    //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
    .build();

  public GoogleIdToken auth(Request req){
    return auth(Document.parse(req.body()));
  }
  public GoogleIdToken auth(Document body){
    return auth(body.getString("idtoken"));
  }
  public GoogleIdToken auth(String token){
    try {
      return verifier.verify(token);
    } catch (Exception e) {
      System.err.println("Invalid ID token");
      e.printStackTrace();
      return null;
    }
  }
}
