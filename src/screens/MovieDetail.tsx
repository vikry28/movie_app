import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome } from '@expo/vector-icons'
import { API_ACCESS_TOKEN } from '@env'
import { Movie } from '../types/app'
import MovieList from '../components/MovieList'

const { width } = Dimensions.get('window')

const MovieDetail = ({ route }: { route: any }): JSX.Element => {
  const { id } = route.params
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
          }
        )
        const data = await response.json()
        setMovie(data)
        checkIfFavorite(data.id)
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  useEffect(() => {
    checkIfFavorite(id)
  }, [id])

  const checkIfFavorite = async (movieId: number) => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@FavoriteList')
      if (storedFavorites !== null) {
        const favoriteList: Movie[] = JSON.parse(storedFavorites)
        const isFav = favoriteList.some((movie) => movie.id === movieId)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addFavorite = async (movie: Movie) => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
      let favMovieList: Movie[] = []

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie]
      } else {
        favMovieList = [movie]
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(true)
    } catch (error) {
      console.log(error)
    }
  }

  const removeFavorite = async (movieId: number) => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        let favMovieList: Movie[] = JSON.parse(initialData)
        favMovieList = favMovieList.filter((movie) => movie.id !== movieId)
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
        setIsFavorite(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.posterContainer}>
        <Image
          style={styles.poster}
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.tagline}>{movie.tagline}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <Text style={styles.subTitle}>Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Release Date:</Text>
            <Text style={styles.detailText}>
              {new Date(movie.release_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Runtime:</Text>
            <Text style={styles.detailText}>{movie.runtime} minutes</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
            <FontAwesome name="star" size={16} color="yellow" />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (isFavorite) {
                removeFavorite(movie.id)
              } else {
                addFavorite(movie)
              }
            }}
            style={styles.favoriteButton}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color={isFavorite ? '#ff3d71' : '#555'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.subTitle}>Genres</Text>
        <View style={styles.genres}>
          {Array.isArray(movie.genres) &&
            movie.genres.map((genre) => (
              <Text key={genre.id} style={styles.genre}>
                {genre.name}
              </Text>
            ))}
        </View>
        <Text style={styles.subTitle}>Recommendations</Text>
        <MovieList
          title="Recommendations"
          path={`movie/${id}/recommendations`}
          coverType="poster"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  posterContainer: {
    width: '100%',
    aspectRatio: 2 / 3, 
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  tagline: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  overview: {
    fontSize: 16,
    marginBottom: 16,
    color: '#888',
    textAlign: 'justify',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    color: '#555',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 8,
  },
  rating: {
    color: 'black',
    fontWeight: '700',
    marginRight: 4,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genre: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 8,
    color: '#555',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default MovieDetail
