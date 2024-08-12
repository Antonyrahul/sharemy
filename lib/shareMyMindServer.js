import axios from 'axios';


// Register user
export async function signup(email, password, username) {
    // try {
    //   const newAccount = await account.create(
    //     ID.unique(),
    //     email,
    //     password,
    //     username
    //   );
  
    //   if (!newAccount) throw Error;
  
    //   const avatarUrl = avatars.getInitials(username);
  
    //   await signIn(email, password);
  
    //   const newUser = await databases.createDocument(
    //     appwriteConfig.databaseId,
    //     appwriteConfig.userCollectionId,
    //     ID.unique(),
    //     {
    //       accountId: newAccount.$id,
    //       email: email,
    //       username: username,
    //       avatar: avatarUrl,
    //     }
    //   );
  
    //   return newUser;
    // } catch (error) {
    //   throw new Error(error);
    // }
    console.log("in signup")
    try {
        const response = await axios.post("http://192.168.0.104:8000/registeruser",{email,password});
        console.log("response",response)
        console.log("response data",response.data)
        return response.data
    }
     catch (error) {
        console.log(error)
        throw new Error(error);
    }
    
  }

  export async function signin(email, password) {

    console.log("in signin")
    try {
        const response = await axios.post("http://192.168.0.104:8000/loginuser",{email,password});
        console.log("response",response)
        console.log("response data",response.data)
        return response.data
    }
     catch (error) {
        console.log(error)
        throw new Error(error);
    }
    
  }

  export async function addUrlForUser(email,url) {

    console.log("in addurlforuser")
    try {
        const response = await axios.post("http://192.168.0.104:8000/addurlforuser",{email,url});
        console.log("response",response)
        console.log("response data",response.data)
        return response.data
    }
     catch (error) {
        console.log(error)
        throw new Error(error);
    }
    
  }

  export async function getNotesForUser(email) {

    console.log("in getnotesforuser")
    try {
        const response = await axios.post("http://192.168.0.104:8000/getnotesforuser",{email});
        console.log("response",response)
        console.log("response data",response.data)
        return response.data
    }
     catch (error) {
        console.log(error)
        throw new Error(error);
    }
    
  }