# Google OAuth Security Squad
[![Build Status](https://travis-ci.org/UMM-CSci-3601-S19/iteration-4-endgame.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S19/iteration-4-endgame)

Google OAuth had been used in past and present Software Design course offerings and will likely be used in the future. By the last 
iteration this semester, every group was using Google OAuth in a way that was essential to use their web apps. 

Most Google OAuth work was based on a previous classes’ implementation. However, a critical flaw was that their implementation relied on 
using Local Storage to hold details like the user’s name, email, picture, id and so forth. Local Storage can be viewed and manipulated 
very easily by any logged in user and allowed for rides and users to be spoofed and for sensitive information to be out in the open. 
Additionally, our API was exposed and didn’t require any sort of user token from Google to be called; POST requests could be called by 
anybody to add, edit or delete ride information from anybody. 

That was the status quo for multiple years of software design until our instructors tasked a small team on the last iteration to fix the 
problem. Some of the members of this group spent Iteration 3 trying to get rid of Local Storage. They then continued to this iteration
with this group and made sure any POST requests on rides required a unique user identification token created by Google and that was only 
effective for that user’s info.

Once our group replaced Local Storage with user tokens and helped secure some POST requests regarding rides, we still had some work to do
to figure out how to make end-to-end tests and unit tests work with our new Google OAuth implemnation.

Feel free to poke around in our repo. Key files that differ from other groups is most of our unit test files, end to end files for 
ride-list, `Server.java`, `GoogleAuth.java`, and `auth.service.ts`. However, the key takeaways from this iteration are in our documentation:

## DOCUMENTATION
1. [CLIENT_TESTING_WITH_OAUTH: How to structure client tests](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/blob/master/Documentation/CLIENT_TESTING_WITH_OAUTH.md)
2. [Deploying and Development: How to set up your development and deployment environments](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/blob/master/Documentation/Deploying%20and%20Development.md)
3. [Endpoint Lockdown Notes: How to lock down the API](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/blob/master/Documentation/Endpoint%20Lockdown%20Notes.md)
4. [HTTPS: How to secure your connection between client and Cloudflare as HTTPS, with notes on what may be done to secure Cloudflare to server](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/blob/master/Documentation/HTTPS.md)
5. [documentation_e2e: How to set up end to end testing](https://github.com/UMM-CSci-3601-S19/iteration-4-endgame/blob/master/Documentation/documentation_e2e.md)

## ToDo List & Known Issues: 
See our issues and ZenHub for known issues and ToDo list. In particular, the New Issues and Out of Scope pipelines. Each issue or epic 
has some sort of description about what we know or why we didn't get around to something in time.
