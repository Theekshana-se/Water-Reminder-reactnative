import { Account, Client, ID, Databases, Query } from 'appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '66fad7d00019dfe1b467',
    databaseId: '66fad9b2001d11a7fe7c',
    userCollectionId: '66fad9dc0012ad58aa89', // Users collection ID
    waterbottlecollectionid: '67e3791b0007897983cc', // Replace with your collection ID
    waterfillingcollectionid: '67e37a2f000b08b690c9',
    storageId: '66fadc270005ccc67004'
};


// Initialize your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

const account = new Account(client);
const databases = new Databases(client);



// Create a shop (for both water bottle and filling station types)
export const createShop = async (shopData, isWaterBottleShop) => {
  const collectionId = isWaterBottleShop ? waterbottlecollectionid : waterfillingcollectionid;

  // Ensure shopData contains all required attributes
  const validatedShopData = {
    name: shopData.name,
    latitude: parseFloat(shopData.latitude), // Ensure latitude is a number
    longitude: parseFloat(shopData.longitude), // Ensure longitude is a number
    address: shopData.address,
    phone: shopData.phone,
    hours: shopData.hours,
    license: shopData.license,
    image: shopData.image,
    email: shopData.email,
  };

  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(), // Generates a unique ID
      validatedShopData
    );
    console.log('Shop created:', response);
    return response;
  } catch (error) {
    console.error('Error creating shop:', error);
    throw error;
  }
};
  
  // Read all shops from a collection
  export const fetchShops = async (isWaterBottleShop) => {
    const collectionId = isWaterBottleShop ? waterbottlecollectionid : waterfillingcollectionid;
    try {
      const response = await databases.listDocuments(DATABASE_ID, collectionId);
      console.log('Fetched shops:', response.documents);
      return response.documents;
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
  };
  
  // Update a shop
  export const updateShop = async (shopId, shopData, isWaterBottleShop) => {
    const collectionId = isWaterBottleShop ? waterbottlecollectionid : waterfillingcollectionid;
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        collectionId,
        shopId,
        shopData
      );
      console.log('Shop updated:', response);
      return response;
    } catch (error) {
      console.error('Error updating shop:', error);
      throw error;
    }
  };
  
  // Delete a shop
  export const deleteShop = async (shopId, isWaterBottleShop) => {
    const collectionId = isWaterBottleShop ? waterbottlecollectionid : waterfillingcollectionid;
    try {
      await databases.deleteDocument(DATABASE_ID, collectionId, shopId);
      console.log('Shop deleted:', shopId);
    } catch (error) {
      console.error('Error deleting shop:', error);
      throw error;
    }
  };

// Create a user
// Create a user
export const createUser = async (email, password, username, profilePicUrl, phoneNumber) => {
    try {
        // Create the user in Appwrite account service
        const newAccount = await account.create(
            ID.unique(),   // Generate unique user ID
            email,         // User email
            password,      // User password
            username       // User name
        );

        if (!newAccount) throw new Error('Failed to create account');

        // Step 2: Create a session for the newly created user
        const session = await account.createEmailPasswordSession(email, password);
        console.log('Session created for new user:', session);

        // Optionally assign roles here based on your Appwrite setup

        // Store the user data in the Appwrite database (users collection)
        const newUserDocument = await databases.createDocument(
            config.databaseId,         // The database ID
            config.userCollectionId,   // The users collection ID
            ID.unique(),               // Unique document ID
            {                           // Data to store in the document
                accountid: newAccount.$id,  // Store the account ID from Appwrite
                username: username,          // Store the username
                email: email,                // Store the email
                profilepic: profilePicUrl,   // Store the profile picture URL
                phoneNumber: phoneNumber,     // Store the phone number
            }
        );

        // Return the newly created user document and session
        return { userDocument: newUserDocument, session };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error(error);
    }
};


// Login a user
// Login a user
export const loginUser = async (email, password) => {
    try {
      // Attempt to get the current user
      const currentUser = await account.get();
      if (currentUser) {
        console.log('User is already logged in:', currentUser);
        return { session: null, accountId: currentUser.$id };
      }
    } catch (error) {
      // If the error is because the user is a guest, continue to login
      if (error.code !== 401) {
        console.error('Unexpected error while checking user:', error);
        throw error;
      }
    }
  
    // Attempt to log in with email and password
    try {
      console.log(`Attempting to log in with email: ${email}`);
      const session = await account.createEmailPasswordSession(email, password);
  
      // Fetch the user data after session creation
      const currentUser = await account.get(); // Fetches the logged-in user data
      const accountId = currentUser?.$id;
  
      if (!accountId) {
        console.error("Account ID is missing.");
        throw new Error("Unable to retrieve Account ID.");
      }
  
      console.log('User and session created:', { session, accountId });
      return { session, accountId };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Invalid email or password. Please verify your credentials.');
    }
  };
  


// Get the current logged-in user
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
};

export { account };


// update water consuption of each user 
export const updateUserWaterConsumption = async (waterConsumption,dailygoal) => {
    try {
        // Get the current user account
        const user = await account.get(); // This fetches the current logged-in user's account details

        // Search for the user document by accountid in the users collection
        const userDocument = await databases.listDocuments(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            [Query.equal('accountid', user.$id)] // Query the documents where the 'accountid' matches the logged-in user's ID
        );

        // Check if a matching document was found
        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        const documentId = userDocument.documents[0].$id; // Get the document ID from the query result

        // Convert waterConsumption to a string (since Appwrite expects a string type)
        const waterConsumptionStr = waterConsumption.toString();
        const dailygoalStr = dailygoal.toString();

        // Update the water consumption for the current user in the database
        const updatedDocument = await databases.updateDocument(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            documentId,                 // Document ID retrieved from the user document
            { waterConsumption: waterConsumptionStr,
              dailygoal: dailygoalStr,
             } // Convert water consumption to string
        );

        console.log('Water consumption updated:', updatedDocument);
        return updatedDocument;
    } catch (error) {
        console.error('Error updating water consumption:', error);
        throw error;
    }
};


//fetch waterconsuption of the user 

//import { Query } from 'appwrite'; // Make sure Query is imported

export const fetchUserWaterConsumption = async () => {
    try {
        const user = await account.get(); // Get the current logged-in user's account details
        
        // Search for the user document by accountid in the users collection
        const userDocument = await databases.listDocuments(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            [Query.equal('accountid', user.$id)] // Query the documents where the 'accountid' matches the logged-in user's ID
        );

        // Check if a matching document was found
        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        // Return the water consumption field from the first matching document
        return userDocument.documents[0].waterConsumption;
    } catch (error) {
        console.error('Error fetching user water consumption:', error);
        throw error;
    }
};


// store age in database 

// update the age of each user 
export const updateUserAge = async (age) => {
    try {
        // Get the current user account
        const user = await account.get(); // This fetches the current logged-in user's account details

        // Search for the user document by accountid in the users collection
        const userDocument = await databases.listDocuments(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            [Query.equal('accountid', user.$id)] // Query the documents where the 'accountid' matches the logged-in user's ID
        );

        // Check if a matching document was found
        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        const documentId = userDocument.documents[0].$id; // Get the document ID from the query result

        // Convert age to string if needed (Appwrite may expect strings in the schema)
        const ageStr = age.toString();

        // Update the age for the current user in the database
        const updatedDocument = await databases.updateDocument(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            documentId,                 // Document ID retrieved from the user document
            { age: ageStr }             // Update age field
        );

        console.log('Age updated:', updatedDocument);
        return updatedDocument;
    } catch (error) {
        console.error('Error updating age:', error);
        throw error;
    }
};

//fetch age from data base 

export const fetchUserAge = async () => {
    try {
        const user = await account.get(); // Get the current logged-in user's account details
        
        // Search for the user document by accountid in the users collection
        const userDocument = await databases.listDocuments(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            [Query.equal('accountid', user.$id)] // Query the documents where the 'accountid' matches the logged-in user's ID
        );

        // Check if a matching document was found
        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        // Return the age field from the first matching document
        return userDocument.documents[0].age;
    } catch (error) {
        console.error('Error fetching user age:', error);
        throw error;
    }
};

// Function to update user weight
export const updateUserWeight = async (weight) => {
    try {
        const user = await account.get(); // Fetch current user details

        // Search for user document by accountid
        const userDocument = await databases.listDocuments(
            config.databaseId, 
            config.userCollectionId,
            [Query.equal('accountid', user.$id)]
        );

        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        const documentId = userDocument.documents[0].$id;

        // Convert weight to string if needed (Appwrite might expect strings in some cases)
        const weightStr = weight.toString();

        // Update the user's weight in the database
        const updatedDocument = await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            documentId,
            { weight: weightStr }
        );

        console.log('Weight updated:', updatedDocument);
        return updatedDocument;
    } catch (error) {
        console.error('Error updating weight:', error);
        throw error;
    }
};

// Function to fetch user weight
export const fetchUserWeight = async () => {
    try {
        const user = await account.get();

        const userDocument = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountid', user.$id)]
        );

        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        return userDocument.documents[0].weight; // Return the weight from the document
    } catch (error) {
        console.error('Error fetching user weight:', error);
        throw error;
    }
};

// Function to fetch user email and phone number
export const fetchUserEmailAndPhone = async () => {
    try {
        const user = await account.get(); // Get the current logged-in user's account details

        // Search for the user document by accountid in the users collection
        const userDocument = await databases.listDocuments(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            [Query.equal('accountid', user.$id)] // Query where 'accountid' matches logged-in user's ID
        );

        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        const userData = userDocument.documents[0];
        return {
            email: userData.email,       // Return the email
            phoneNumber: userData.phonenumber,
            username:userData.username, // Return the phone number
        };
    } catch (error) {
        console.error('Error fetching user email and phone:', error);
        throw error;
    }
};

//update profile picture 
export const updateProfilePicture = async (imageUri) => {
    try {
      const user = await account.get();
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
  
      const file = await storage.createFile('your_bucket_id', 'unique()', formData);
  
      // Now update the user's profile with the file ID of the uploaded image
      const userDocument = await databases.listDocuments(
        config.databaseId, 
        config.userCollectionId, 
        [Query.equal('accountid', user.$id)]
      );
  
      if (userDocument.documents.length > 0) {
        const documentId = userDocument.documents[0].$id;
        await databases.updateDocument(config.databaseId, config.userCollectionId, documentId, {
          profilePic: file.$id,
        });
      }
  
      console.log('Profile picture updated:', file.$id);
      return file.$id;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  };
  


//wakeuptime update 
export const updateWakeUpTime = async (wakeUpTime) => {
    try {
        // Get the current logged-in user's account details
        const user = await account.get();
        console.log('Current User:', user.$id);  // Log the current user to ensure it fetches the correct user

        // Search for the user document by accountid in the users collection
        const userDocument = await databases.listDocuments(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            [Query.equal('accountid', user.$id)] // Query where 'accountid' matches logged-in user's ID
        );

        // Check if a matching document was found
        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        const documentId = userDocument.documents[0].$id;
        console.log('User Document Found:', documentId);  // Log the document ID

        // Update the user's wake-up time
        const updatedDocument = await databases.updateDocument(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            documentId,                 // Document ID retrieved from the user document
            { wakeUpTime }     // Only update the wake-up time field
        );

        console.log('Wake-up time updated:', updatedDocument);
        return updatedDocument;

    } catch (error) {
        console.error('Error updating wake-up time:', error);  // Log the error if something goes wrong
        throw error;
    }
};

//fetch wakeup time 
export const fetchUserWakeUpTime = async () => {
    try {
      const user = await account.get(); // Get the current logged-in user's account details
      
      // Search for the user document by accountid in the users collection
      const userDocument = await databases.listDocuments(
        config.databaseId,          // Your database ID
        config.userCollectionId,    // Your user collection ID
        [Query.equal('accountid', user.$id)] // Query the documents where the 'accountid' matches the logged-in user's ID
      );
  
      // Check if a matching document was found
      if (userDocument.documents.length === 0) {
        throw new Error('No user document found with the given accountid');
      }
  
      // Return the wakeUpTime field from the first matching document
      return userDocument.documents[0].wakeUpTime;
    } catch (error) {
      console.error('Error fetching user wake-up time:', error);
      throw error;
    }
  };
  
// Function to update user's bedtime based on accountid
export const updateBedtime = async (bedtime) => {
    try {
        // Get the current logged-in user's account details
        const user = await account.get();
        console.log('Current User:', user.$id);  // Log the current user to ensure it fetches the correct user

        // Search for the user document by accountid in the users collection
        const userDocument = await databases.listDocuments(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            [Query.equal('accountid', user.$id)] // Query where 'accountid' matches logged-in user's ID
        );

        // Check if a matching document was found
        if (userDocument.documents.length === 0) {
            throw new Error('No user document found with the given accountid');
        }

        const documentId = userDocument.documents[0].$id;
        console.log('User Document Found:', documentId);  // Log the document ID

        // Update the user's bedtime
        const updatedDocument = await databases.updateDocument(
            config.databaseId,          // Your database ID
            config.userCollectionId,    // Your user collection ID
            documentId,                 // Document ID retrieved from the user document
            { bedtime }     // Only update the bedtime field
        );

        console.log('Bedtime updated:', updatedDocument);
        return updatedDocument;

    } catch (error) {
        console.error('Error updating bedtime:', error);  // Log the error if something goes wrong
        throw error;
    }
};

//fetch bedtime 

export const fetchUserBedtime = async () => {
    try {
      const user = await account.get(); // Get the current logged-in user's account details
      
      // Search for the user document by accountid in the users collection
      const userDocument = await databases.listDocuments(
        config.databaseId,          // Your database ID
        config.userCollectionId,    // Your user collection ID
        [Query.equal('accountid', user.$id)] // Query the documents where the 'accountid' matches the logged-in user's ID
      );
  
      // Check if a matching document was found
      if (userDocument.documents.length === 0) {
        throw new Error('No user document found with the given accountid');
      }
  
      // Return the bedtime field from the first matching document
      return userDocument.documents[0].bedtime;
    } catch (error) {
      console.error('Error fetching user bedtime:', error);
      throw error;
    }
  };
  
  // Function to update user email and phone number in Appwrite
export const updateUserEmailAndPhone = async ({ email, phoneNumber }) => {
    try {
      const user = await account.get(); // Get the current logged-in user's account details
  
      // Search for the user document by accountid in the users collection
      const userDocument = await databases.listDocuments(
        config.databaseId,          // Your database ID
        config.userCollectionId,    // Your user collection ID
        [Query.equal('accountid', user.$id)] // Query where 'accountid' matches logged-in user's ID
      );
  
      if (userDocument.documents.length === 0) {
        throw new Error('No user document found with the given accountid');
      }
  
      const documentId = userDocument.documents[0].$id;
  
      // Update the email and phone number
      const updatedDocument = await databases.updateDocument(
        config.databaseId, 
        config.userCollectionId, 
        documentId,
        { email, phoneNumber }
      );
  
      console.log('Email and phone number updated:', updatedDocument);
      return updatedDocument;
    } catch (error) {
      console.error('Error updating email and phone:', error);
      throw error;
    }
  };
  