import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, Alert, StyleSheet, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { CustomButton, FormField } from "../../components";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';


//import Clipboard from '@react-native-clipboard/clipboard';


import { images } from "../../constants";

import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";
import { addUrlForUser, getNotesForUser } from "../../lib/shareMyMindServer";
import { useShareIntent, ShareIntentFile } from "expo-share-intent";

const Home = () => {
  var isFocused = false
  isFocused = useIsFocused();
  console.log("isfocused", isFocused)
  const dummy = 1
  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntent({
      debug: false,
      resetOnBackground: true,
    });

  //console.log(url)
  //const dummy = true
  console.log("hasshareintent", hasShareIntent)
  console.log("shareIntent", shareIntent)
  const [url, setUrl] = useState(() => dummy > 0 ? getintentvars(hasShareIntent, shareIntent) : "initial url");
  console.log("url", url)
  if (hasShareIntent) {
    console.log("the url is ", shareIntent.webUrl)
    // setUrl(shareIntent.webUrl)

  }

  function getintentvars(intentBool, intenVal) {
    console.log("in the get function", intentBool)
    return intenVal.webUrl
  }

  useEffect(() => {
    console.log("in useeffect")

    getNotes();
    if (hasShareIntent) {
      console.log("has share intent in use effect")
      setUrl(shareIntent.meta.webUrl)
    }

  }, [isFocused]);
  useFocusEffect(
    useCallback(() => {
      console.log("Its focused bro")
      if (hasShareIntent)
        setUrl(shareIntent.meta.webUrl)
    }, [])
  )


  async function getNotes() {

    console.log("in getnotes")
    const email = await AsyncStorage.getItem("email")

    const response = await getNotesForUser(email)
    console.log(response)
    setNotes(response.data[0].notes)
    setDisplayUrls(notes)
  }
  // const { data: posts, refetch } = useAppwrite(getAllPosts);
  // const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [notes, setNotes] = useState()
  const [displayUrls, setDisplayUrls] = useState(notes)

  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    url: "",
    password: "",
  });


  const onRefresh = async () => {
    setRefreshing(true);

    setRefreshing(false);
  };
  const searchQuery = async (e) => {
    setQuery(e)
    console.log(e)
    if (e.length > 2) {
      const res = notes.filter((item) => {

        return item.url.includes(e)
      })
      console.log(res, res.length)
      if (res.length > 0) {
        setDisplayUrls(res)
      }
    }
    else {
      setDisplayUrls(notes)
    }
  }

  const submit = async () => {
    // if (form.email === "" || form.password === "") {
    //   Alert.alert("Error", "Please fill in all fields");
    // }

    setSubmitting(true);

    try {
      const email = await AsyncStorage.getItem("email")
      //await signIn(form.email, form.password);
      const response = await addUrlForUser(email, url)
      //const result = await getCurrentUser();
      //setUser(result);
      // setIsLogged(true);
      console.log(response)
      setUrl('')
      //  if (response.status==200)
      //  {
      //   setUser(response)
      //   setIsLogged(true)
      //  }

      Alert.alert("Success", "Url added successfully");
      getNotes();
      // router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);

    }
  };

  const Item = ({ title }) => (
    <View className="mr-5 w-62 rounded-[33px] mt-3 bg-white/10" >
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  const ItemUrl = ({ content, title, description, imageurl }) => (
    <View className="mr-5 w-62 rounded-[33px] mt-3 bg-white/10" >
      <Text style={styles.title}>{content}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>{description}</Text>
      <Image style={styles.logo} source={{ uri: imageurl }}></Image>
    </View>

  )

  // one flatlist
  // with list header
  // and horizontal flatlist

  //  we cannot do that with just scrollview as there's both horizontal and vertical scroll (two flat lists, within trending)

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Sharemymind
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
              <TextInput
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={query}
                placeholder="Search a content"
                placeholderTextColor="#CDCDE0"
                onChangeText={(e) => searchQuery(e)}
              />

              <TouchableOpacity
                onPress={() => {
                  if (query === "")
                    return Alert.alert(
                      "Missing Query",
                      "Please input something to search results across database"
                    );

                  if (pathname.startsWith("/search")) router.setParams({ query });
                  else router.push(`/search/${query}`);
                }}
              >

              </TouchableOpacity>
            </View>
            <View>
              <FormField
                title="Enter Notes"
                value={url}
                id="notes"
                placeholder="Enter notes"
                handleChangeText={(e) => setUrl(e)}
                otherStyles="mt-7"
                keyboardType="email-address"
              />
              <CustomButton
                title="save"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={isSubmitting}
              />

            </View>


            <View className="w-full flex-1 pt-5 pb-8">



              <FlatList
                data={displayUrls}
                vertical
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (item.title) {
                    return <ItemUrl content={item.url} title={item.title} description={item.description} imageurl={item.imgUrl} />
                  }
                  else {
                    return <Item title={item.url} />
                  }

                }}

              />

            </View>
          </View>
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No Notes Found"
            subtitle="No Notes created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default Home;
