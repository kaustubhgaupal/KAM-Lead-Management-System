KAM Lead Management System Setup
Prerequisites
Ensure the following are installed:

Node.js – Download here.
MongoDB – Use either a local instance or a MongoDB Atlas cluster. Have the MongoDB URI and secret key ready.
Setup Steps
Clone the Repository

bash
Copy code
git clone https://github.com/kaustubhgaupal/KAM-Lead-Management-System.git
Navigate to the Server Directory

bash
Copy code
cd KAM-Lead-Management-System/server
Configure Environment Variables

Open the .env file in the server directory.
Add the following details:
env
Copy code
MONGODB_URI=your_mongodb_uri_here
SECRET=your_secret_key_here
Replace:
your_mongodb_uri_here with your MongoDB database URI.
your_secret_key_here with a custom secret key (commonly used for JWT authentication).
Install Dependencies

bash
Copy code
npm install
Run the Project

bash
Copy code
node index.js
The application will start on the default port: http://localhost:3000.
