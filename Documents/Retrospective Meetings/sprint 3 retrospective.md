# SPRINT 3 RETROSPECTIVE MEETING

DATE: 26 May 2023

## Minutes:

###  Initial goals for sprint 3:

-  Implement functionality that allows the lecturer to set their available days, times and group sizes for a consultation - all info linked to database.

-  Display the lecturers available times to the student. 

-  Build on the 'schedule meeting' functionality allowing students to schedule and join meetings - linking the info to the database.

-  A user's scheduled meetings should be displayed on their calendar showing all the details of the meeting. 

-  Implement Tests for all new functionality.

###  Actual outcome of sprint 3:

-  A lecturer is able to set their available days, times and group sizes for consultations - this info is stored in the database.

-  A student is able to select a lecturer and view the days and times that they are avilable for a consultation.

-  Based on a lecturers avilability, a student is able to schedule a meeting with them. Their username, the lecturers username, the day, time and duration and group size of the meeting is stored in the database. A student cannot join an existing meeting yet, and thus the meeting info stored in the database does not include a list for students that join. Furthermore, the group size limit is not being used as yet to limit the number of students in a meeting. 

-  A user's (student and lecturer) upcoming meetings are highlighted on their calendar. Clicking on the highlighted date triggers a pop up/dialogue box which provides all the details of the scheduled meeting. This pop-up does not function on safari. Furthermore, we are unable to test if the dialogue box opens as the JSDOM is not compatible with how the dialogue box is opened. 

- Tests for all user stories implemented in this sprint have been done.

###  Reasons for  the outcomes of sprint 3:

-  We found that writing tests took longer than expected. This caused a delay which then resulted in certain implemenation of some functionalities being reduced. 

- User stories were more complex than expected and could have been broken down into smaller stories. Therefore, completing the funcitonality for a single user story took longer than expected. 

###  What could have been done to improve the sprint 1 release:

-  The views could have been improved on with further styling using bootstrap and css. 

-  Functionality of scheduling a meeting was built on, but it could have been fully implemented. 

-  Some tests were very basic and could have been built on for better testing.

###  How did the team work together?

-  The team continues to work well together. We do still struggle with time management which can be improved on.

# Retrospective

## What the team did well:

-  The team worked well together to implement most of the functionality and fix bugs when they arose.

-  All members reviewed at least one pull request and have started responding to reviews.

-  The assigned tasks were completed by the corresponding person to ensure equal work.

-  Team members are always willing to assist when one encounters a problem.

-  The team managed to complete enough to ensure the end of the sprint was not pushed out/delayed.

## What went wrong:

-  The feature for scheduling a meeting is still not fully functional. Writing tests in general took longer than expected causing delays

-  Styling of the webiste has been a low priority and has not been edited.

-  While working on a user story, we found that it could have been split up better into more developer sized stories. This resulted in the implementation of a specific user story taking longer than expected as there were some sub-features that we did not think about only until we started implementing the feature. 

-  Overall, we were unable to complete the full functionality of some tasks.

## What could be improved:

-  Better time management regarding writing tests.

-  Better prioritisation of tasks. 

-  Better planning of user stories into smaller develeper-sized stories to allow for smaller achievable goals. 

## Approach for Final Sprint:

-  The USM and scrumboard is to be updated at the beginning of the sprint.

-  Prioritise tasks better to ensure the best outcome for the final submission.

-  Aim to implement all core functionality with a pleasing UI.

-  Aim to have an overall polished and well functioning web app.

-  Ensure all documentation is ready for final submission by the end of last sprint: 1 June 2023.

## Sprint velocity achieved for sprint 2:

-  Formula:

   `Sum of all story points / no. of sprints`
   
   `= (1 + 5 + 5 + 6 + 8 ) / 3`
   
   `= 8.33`
