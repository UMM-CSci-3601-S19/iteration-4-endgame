#Secruing API Endpoints

##The Problem

One source of security vulnerabilities in this project was the ability to send requests to the api without authentication.
While the client would restrict activities that a user should not be able to do, such as not displaying the "delete ride"
button for other users' rides. However, an intelligent, but malicious user could call directly to those api endpoints, allowing
them to delete other users' rides. 

__ Include image example of exploit. ___

This is an example of the exploit using Postman, a program designed to make http requests easily. Other methods of doing this
include Insomnia, another graphical application, and curl or similar command line interfaces. Do yourself a favor and use a graphical one.

As you can see, anyone can make a post request to this endpoint and delete any ride that they know the id for. Because these ids
can be easily found, such as in the html of our page, this is not good. As a general rule, you should not trust anything coming
from the client without ensuring you know who is sending the request.

To fix this, we will need to ensure two things

1. The user is logged in (has a valid token)

2. The user is authorized to perform this action

##The Solution

First, we will address the issue with knowing that the user is logged in. This is done through communications with Google.
We do this in the GoogleAuth.java class. Because we will be doing this in many different requests, it was a good idea to
move the code into its own class where it can be reused, rather than copied and pasted in each method. This makes the code more
maintainable, as any changes that have to be made can be made in only one place rather than everywhere.

On to the code!

First, you will have had to implement Google's authentication on both your client and server. The documentation for how to do that
can be found ___ here ___.

Once you've implemented Google authentication in your GoogleAuth class, you can use the same method to get a user's profile before
handling other API requests from them.



__ Link to  google's documentation somewhere __
Because we will be doing this in multiple requests, it is a go