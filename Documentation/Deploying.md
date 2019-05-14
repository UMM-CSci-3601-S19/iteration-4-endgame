# Google OAUTH: Deploying on Droplet

## The Problem
Setting up Google OATH to work on localhost is already one big learning process, but using documentation from previous classes 
("Assumptions/Prerequisites") makes it viable. That said, that documentation is missing key steps to make Google OAUTH work on a Droplet. This guide builds upon the previous documentation and supplements it. 

That said, there are two major issues with deploying to a Droplet. 
1. Megabittron's documentation is set as is for localhost information and not top level domain information.
2. This version of Google OAuth as we implement it does not have a `credentials.json` file. This project only needs a client_id field one file.

## Assumptions/Prerequisites
* [Megabittron's Google OATH tutorial](https://github.com/UMM-CSci-3601-S18/iteration-4-megabittron/blob/master/Documentation/Secure%20Google%20Login/DocumentationForGoogleLogin.md)
* [Megabittron's HTTPS Tutorial](https://github.com/UMM-CSci-3601-S18/iteration-4-megabittron/blob/master/Documentation/HTTPS.md)
* [UMM-CSci-3601's Droplet Setup Instructions](https://github.com/UMM-CSci-3601/droplet-setup-and-build)

The HTTPS Tutorial is especially important as you need a top level domain, and it should go through Cloudflare to make the droplet's 
oauth implementation more secure. Also, ensure that your `environment.prod.ts` file uses your top level domain name instead of your 
DigitalOcean droplet's IP address. To do this, on the line API_URL, enter `https://yoursite.yourTopLevelDomain/api/`." Contrary to the 
`UMM-CSci-3601's Droplet Setup Instructions`, you don't need to include the port, and in our experience, likely shouldn't. You can 
commit that change to master and never need to change it again manually after you pull in your repo. 

Additionally, contrary to the Droplet Setup instructions, ssh into root@[your_ip] instead of deploy-user@[your_ip].

## Modifying `Server.java`
`Server.java` needs to be modified in your Droplet to be different than your master build. Your master build references localhost in places where the below code references your top level domain, and your master build uses serverPort 4567 whereas the Droplet should use port 80. This is so that you can push changes between your group partners that work on localhost whereas the Droplet needs the following implementation. 

>cd ~     
>cd your-repos-name-here/server/src/main/java/umm3601/    
>nano Server.java

#### `Server.java`
```java
  private static final int serverPort = 80;
```
## Modifying `GoogleAuth.java`
`GoogleAuth.java` needs your Google Developer Console's client_id. Place it like so in the file:

>cd ~     
>cd your-repos-name-here/server/src/main/java/umm3601/    
>nano GoogleAuth.java

#### `GoogleAuth.java`
```java
public class GoogleAuth {
  private static final String CLIENT_ID = "your_client_id_here";
```  
If you are the group member that set up your project's OUATH API, make sure you go to the "IAM & admin" panel in the Developer 
Console and add all your group members as project owners so that anyone can retrieve this information or make changes as needed. 
If you are reading this as a deploying member without access, bug your project's owner for this permission; in the meantime if you 
really need to hit the ground running without the owner, nothing is stopping you from making your own Google API version of your 
project for the moment. And whoever you are, ensure your next iteration group does all this sharing before any new code is written.
