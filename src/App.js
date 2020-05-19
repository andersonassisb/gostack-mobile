import React from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = React.useState([
    {
      id: "d6e43105-a559-45b7-8fd7-53416b415741",
      title: "Desafio React Native",
      url: "https://github.com/josepholiveira",
      techs: ["React Native", "Node.js"],
      likes: 0,
    },
  ]);

  React.useEffect(() => {
    (async function () {
      await api
        .post("repositories", {
          title: "Desafio React Native",
          url: "https://github.com/josepholiveira",
          techs: ["React Native", "Node.js"],
        })
        .then((response) => setRepositories([...repositories, response.data]));
    })();
  }, []);

  async function handleLikeRepository(id) {
    if (!id) return;
    await api.post(`/repositories/${id}/like`).then((response) => {
      const updateRepository = repositories;
      const repositoryIndex = updateRepository.findIndex(
        (arr) => arr.id === response.data.id
      );
      updateRepository[repositoryIndex] = response.data;
      setRepositories([...updateRepository]);
    });
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {repositories.length > 0 && (
          <FlatList
            data={repositories}
            keyExtractor={(repository) => String(repository.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{item.title}</Text>

                <View style={styles.techsContainer}>
                  {item.techs.length > 0 &&
                    item.techs.map((tech) => (
                      <React.Fragment key={tech}>
                        <Text style={styles.tech}>{tech}</Text>
                      </React.Fragment>
                    ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${item.id}`}
                  >
                    {item.likes} curtidas
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(item.id)}
                  testID={`like-button-${item.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
