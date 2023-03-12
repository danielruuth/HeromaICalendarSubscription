# About
This is a fork of the .NET work by [linusnyren](https://github.com/linusnyren/VgrICalSubscription).
The plan is to create a working nodejs equivalent.

# Heroma iCal subscription for VGR employees  
## Short description
This api logs in to Heroma to get cookies and access tokens.  
It then uses the cookies and tokens to retrieve an ical compatible calendar.  
It then serves them as a subscription calendar in .ics format.  

It responds to GET calls /schema/user/password/months and returns an .ICS file which a user can subscribe to on their iPhone or Android device.
