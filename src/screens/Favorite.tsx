import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { ImageBackground, Text, TouchableOpacity, View, FlatList, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native'
import { API_ACCESS_TOKEN } from '@env'
import { Movie } from '../types/app'

type FavoriteScreenNavigationProp = NavigationProp<
  { MovieDetail: { id: number } }
>;

const coverImageSize = {
  width: 100,
  height: 150,
}

const Favorite = (): JSX.Element =>{
  const [favorites, setFavorites] = useState<Movie[]>([])
  const navigation = useNavigation<FavoriteScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      getFavoriteMovies()
    }, [])
  )

  const getFavoriteMovies = async (): Promise<void> => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@FavoriteList')
      if (storedFavorites !== null) {
        const favoriteList: Movie[] = JSON.parse(storedFavorites)
        const movieDetails = await Promise.all(
          favoriteList.map(async (movie) => {
            const url = `https://api.themoviedb.org/3/movie/${movie.id}`
            const options = {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
              },
            }
            const response = await fetch(url, options)
            return await response.json()
          })
        )
        setFavorites(movieDetails)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { id: movie.id })
  }

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
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <Text style={styles.movieTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color="yellow" />
            <Text style={styles.rating}>{(item.vote_average ?? 0).toFixed(1)}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Movies</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString(36).substr(2, 9)}
        numColumns={3}
        columnWrapperStyle={styles.column}
      />
    </View>
  )
}

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
  gradientStyle: {
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
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  column: {
    justifyContent: 'space-between',
  },
})

export default Favorite