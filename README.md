
# KAM Lead Management System

This is the KAM Lead Management System, designed to manage leads efficiently. Follow the steps below to set up and run the project locally.

This is the KAM Lead Management System, designed to manage leads efficiently. The application is built using **Node.js**, **EJS**, **MongoDB**, and **Express**. It uses **JWT tokens** for authentication and authorization.

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js**: Download and install Node.js from [here](https://nodejs.org/).
- **MongoDB**: You can either use a local MongoDB instance or connect to a MongoDB Atlas cluster. Make sure you have your MongoDB URI and Secret ready.

## Setup and Run the Project

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/kaustubhgaupal/KAM-Lead-Management-System.git
```

### 2. Navigate to the Server Directory

Once the repository is cloned, navigate to the server directory:

```bash
cd KAM-Lead-Management-System/server
```

### 3. Add MongoDB URI and Secret to .env

In the server directory, you’ll find a .env file. Open it and add your MongoDB URI and Secret like below:

```env
MONGODB_URI=your_mongodb_uri_here
SECRET=your_secret_key_here
```

Replace:
- `your_mongodb_uri_here` with the URI of your MongoDB database.
- `your_secret_key_here` with a secret key for your application (this is often used for JWT authentication).

### 4. Install Dependencies

Now, install the necessary dependencies using npm:

```bash
npm install
```

This will install all the required packages listed in the package.json file.

### 5. Run the Project

Finally, start the server by running:

```bash
node index.js
```

This will start the application, and it should be running on the default port ([http://localhost:5000](http://localhost:5000)).
