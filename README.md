# ICSI 418Y Programming Assignment 3

This is my Programming Assignment 3 for ICSI 418Y.

For this assignment, I continued from my PA2 login and signup project and added the ability to create projects and memberships to the selected projects.

The project uses React for the frontend, Node.js Express for the backend, MongoDB Atlas for the database.

## Features

The application allows users to sign up for an account, log in, create a project, choose an already registered user as the project leader, choose a project progress status, view all projects, view the members of a project, add users to projects, remove members from projects, prevent duplicate memberships, and prevent the project leader from being removed.

## How to Run

The frontend and backend need to run at the same time.

To start the backend, open a terminal and enter the "server" folder. Run "npm install" if necessary. 
Ensure that ".env" file contains your MongoDB connection string and then try to run the server using "node server.js" in that same terminal. 

To get the frontend started, you need to open a second terminal and go into the "client" folder. There you will run "npm install" if necessary and then run "npm run dev" in that same terminal. You will be given a localhost link as terminal feedback, click and open the page. 

