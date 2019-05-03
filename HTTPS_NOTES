HTTPS vs. CloudFlare

Cloudflare is a content delivery network that secures your website (or web-app) with HTTPS for free. When the user makes a request on your site, that information
has to make it to your servers, and back to the user. Cloudflare sits in the middle between the user and your servers, and ensures that the information between the user
and Cloudflare is encrypted. HOWEVER, the information going between Cloudflare and YOUR SERVER is NOT ENCRYPTED. No matter how remote or difficult to exploit the connection, this
problem still means the information is not secure.

Cloudflare does have a Full SSL option (in contrast to the previously described option, which is Flexible SSL), but this requires you to configure your own
web server for SSL instead of just making a DNS change.

Cloudflare also uses shared SSL certificates. You can get a dedicated SSL cert, but it’s $5 per month per site. 

Other problems include slower loading times (User have to go through Cloudflare before they get to your site). 

……………………..

Spark Server and HTTPs

The current server we are using is Apache Spark 2.7.2… though Apache doesn’t keep documentation of previous versions of Spark. As of writing this, here are the current docs:

http://sparkjava.com/documentation#secure


And more….

http://sparkjava.com/documentation#how-do-i-enable-sslhttps

From the second link….
“Enabling HTTPS/SSL requires you to have a keystore file, which you can generate using the Java keytool (→ oracle docs). Once you have the keystore file, just point to its location and include its password.”
“Check out the fully working example on GitHub if you need more guidance.”





And for those who are lazy, some pseudo-code from the server…

Import static spark.SparkStuff;

Public class example {

	// View example at https://localhost:4567/secureHello

	Public static void main(String[] argz) {
		secure (“deploy/keystore.jks”, “password”, null ,null);
		get(“/secureHello”, (req, res) -> “Hello Secure World”);
	}
}

Somewhere in your project will be a “keystore” (probably a jks).

Sources:
https://en.wikipedia.org/wiki/Certificate_authority
https://docs.oracle.com/cd/E19509-01/820-3503/ggfen/index.html
http://sparkjava.com/documentation#examples-and-faq




