Howdy, friend! My name is Aaron, and I'm here to guide you through the wild
world of Google authentication and authorization. Odds are pretty good that
you're a student at the University of Minnesota, Morris taking the Software
Design and Development course. If you are, that's cool! If you're not, that's
also cool. If you're a future employer, note that I wrote this in a rather
loopy state of mind. I do like to exercise my creative writing muscles when
I can. Perks of going to a liberal arts university. You see, future employer,
it's not actually a bad thing that I have BA degrees rather than BS ones. I'm 
what you might call a Citizen of the World (TM). Jackson, I know you're reading 
this. I hope you find it funny. Of course it's probably correct to delete this.
I hope it will still serve as a useful framework for when we get back together
to finish this. It will be on the internet Forever, though...

So, what in the frickity-frack is Google OAuth? Well, it's a helpful tool 
that we can use for authentication and authorization. What are those things?
Well, authentication makes sure you are who you say you are. Authorization
makes sure you have permission to do what you're asking to do. Both are pretty
vital to the functionality and security of most modern websites.

Google lets us do this without too much fuss. Thank goodness for that, because
god knows you'll be spending enough time on other things in this class.

Where does it start? Well, when two web developers love each other very much...
Really, it starts on the client side. There's a neat little sign-in button on the
home page. It calls auth.signIn(). Here, auth is our home component's own AuthService.
AuthService is pretty sweet, in that it encapsulates most of the client-side auth
functionality.

AuthService relies pretty heavily on gapi, which is Google's API.
(google api => g api => gapi, you see.) Where does gapi come from? Well, we basically
have no frickin' clue. We just ask it nicely to show up, and it does. It probably comes
from the script we run in index.html, which we grab from Google. gapi lets us log people
in. We use gapi to grab the authorization instance, or AuthInstance. That spits out a token
when someone signs in. We don't touch any of their password stuff, it goes directly to Google.
That way, if someone hacks us, they can't also hack our users' Google accounts.

With the token we get from gapi, we can log someone in using our own server-side stuff.
We yeet the token to the api/login endpoint.

*IMPORTANT* We also yeet the token at the server in most of the other requests the client
side makes. For more information about this, see the endpoint lockdown notes (they're in the
same documentation folder this is in.)

Now, back to what's happening with the login. We pass off the token (like a football, basketball,
or *insert sport* ball. Yeah, it could even be a hockey ball. How do you like that, smartass?) to the
user request handler. The user request handler has a useful object (a sweet gig, a slick dealio)
called gauth. gauth is an instance of our custom class GoogleAuth. GoogleAuth can be thought
of as the server-side equivalent of AuthService - it encapsulates most of the server-side
authentication and authorization functionality.

Let's talk a little bit about what gauth can do. gauth.auth(req) is basically our golden ticket.
Or golden token, whatever. If the token that comes in from the client side is legit, gauth.auth
gives us back a proper GoogleIdToken which we can do stuff with. For example, we can get
the payload from it. The payload is like a buffet full of juicy food, but we only really
care about a couple of the menu options, at least within the scope of this project.

The payload can provide us with a user's gmail address, name, and google subject id.
The google subject id is pretty important, as it is a unique identifier for a google user.
Because a google user's email address can change, Google recommends that the google subject
id be used as the primary key rather than the email.

To Be Continued