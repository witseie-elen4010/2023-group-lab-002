# SPRINT 2 RETROSPECTIVE MEETING

DATE: 19 May 2023

## Minutes:

###  Initial goals for sprint 2:

-  Set up the database to the Login and Signup pages 

-  Implement full functionality of the Login Page

-  Implement full functionality of the Signup Page 

-  Implement the feature that allows the user (student) to scheudle a consultation

-  Implement Tests

###  Actual outcome of sprint 2:

-  The database is set up with full functionality of the login and signup page.

-  An existing user is able to login to the web app. They are redirected to the respective dashboard based on their choice of a lecturer vs student upon sign up. An error message pops up if the login details entered are incorrect/do not exist in the database.

-  A new user is able to sign up to the web app and their details are stored into the database. They are unable to sign up if the usernmae or email they input already exists in the database. They are unable to sign up if their email is not in a valid email format. They are unable to sign up if their password is less than 8 characters. They are able to choose if they are signing up as a student or a lecturer. Lastly, they are only able to signup if all input fields have been filled out with valid inputs. 

- All passwords that are saved in the database have been hashed for security. 

-  The user is able to schedule a consultation. This feature is not implemented fully or correctly. The user can choose which lecturer they would like to schedule a consultation with. A list of the chosen lecturer's avaialable times are shown. The student is then able to select a date and time for the consultation. A submit button exists, however, it does not do anything as this feature is not yet linked to the database. 

###  Reasons for  the outcomes of sprint 1:

-  We underestimated the time required for setting up the database.

-  We struggled to keep on shcedule due to the large amount of deadlines for other courses within this week's sprint. 

###  What could have been done to improve the sprint 1 release:

-  Using bootstrap library and incorporating more CSS to provide a better looking UI. This has been done for the signup page. But still needs to used for the rest of the views. 

-  The full functionality of scheduling a meeting could have been implemented had we managed our time better

-  Tests for the feature of scheduling a meeting still needs to be implemented 

-  An about page still can be added to provide details on the author as well as the release number of the application

###  How did the team work together?

-  The team worked well together. However, improvements can be made on getting more tasks done effeiciently.

# Retrospective

## What the team did well:

-  Successfully set up the database with the login and signup page

-  Created an aesthetically pleasing UI for the sign up page

-  All members were able to review at least one pull request.

-  The assigned tasks were completed (partially if not fully) by the corresponding person successfully. 

## What went wrong:

-  The feature for scheduling a meeting is not fully functional nor is it set up with the database

-  The UI for most views is not particulary pleasing to the eye.

-  Implementing tests for the sign up page took longer than expected. We failed at using playwright, so we switched to JS DOM for testing webpage funcitonality. 

## What could be improved:

-  Better time management with deadlines from other courses.

-  Better communication between team memebers to improve work progress

## Approach for Sprint 3:

-  The scrumboard is to be updated at the beginning of the new sprint.

-  Equally split up tasks and communicate with each other about issues that may arise. 

-  Aim to implement full funcitonality of scheduling a meeting with the database. 

-  Ensure all documentation required for the end of sprint 3 is completed on time.

## Sprint velocity achieved for sprint 2:

-  Formula:

   `Sum of all story points / no. of sprints`
   
   `= (6 + 2 + 7 + 4 + 4 ) / 2`
   
   `= 11.5`
