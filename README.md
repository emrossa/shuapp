# shuapp

This application is for booking a party venue with optional attractions.

## Installation

The application requires:

* Node.js (see troubleshooting below)
* npm
* MongoDB

To install the application and its dependencies, run `npm install`. After installation, the post-install script will run to set up the database with the needed data.

## Using the application

In order to use the application, the user needs to register a user. After this, the user will be prompted to log in in with the new user credentials. An invalid username or password will display a message about invalid credentials.

All visitors can view each page describing the choices available in a booking. If the user correctly logs in, they can make, view and delete their bookings. Bookings must be made for a date in the future, and have at least one of the staff members as part of the booking, otherwise an error message will be displayed. Bookings can also not be made on the same date as other bookings. Users can make multiple staff choices and multiple attractions can be chosen in a single booking session. After a booking is made, a message is displayed about a succesful booking.

Bookings can be viewed on 'Your Bookings' page. There are links to each booking made that will take the user to the booking details, where a user can delete a specific booking. 'Booking' and 'Your booking' pages can only be viewed by a logged in user, and only the user that made a booking can view it.

When logged in, a user can view their account from the My Account page, and can also delete their account.

## Troubleshooting

The application uses bcrypt to encrypt the user passwords. There is an [issue with installing bcrypt on certain versions of Node.js](https://github.com/kelektiv/node.bcrypt.js/issues/648), which may stop the application from installing. It is suggested to use Node.js version 9+ to stop this.