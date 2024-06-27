import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Movie } from '../types/app';
import { FontAwesome } from '@expo/vector-icons';

const coverImageSize = {
  width: 100,
  height: 150,
};

const Favorite = (): JSX.Element => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      getFavoriteMovies();
    }, [])
  );

  const getFavoriteMovies = async (): Promise<void> => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@FavoriteList');
      if (storedFavorites !== null) {
        const favoriteList: Movie[] = JSON.parse(storedFavorites);
        setFavorites(favoriteList);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { id: movie.id }); // Navigasi ke layar MovieDetail dengan membawa ID film
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity style={styles.movieContainer} onPress={() => handleMoviePress(item)}>
      <ImageBackground
        resizeMode="stretch"
        style={[styles.backgroundImage, coverImageSize]}
        imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.movieTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color="yellow" />
            <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Movies</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.column}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  movieContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 2 / 3,
  },
  backgroundImage: {
    justifyContent: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
  },
  backgroundImageStyle: {
    borderRadius: 8,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  movieTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
    marginLeft: 2,
    fontSize: 12,
  },
  column: {
    justifyContent: 'space-between',
  },
});

export default Favorite;
