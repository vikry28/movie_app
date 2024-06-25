import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import type { Movie } from '../types/app'
import MovieList from '../components/MovieList'
import { API_ACCESS_TOKEN } from '@env'
import { FontAwesome } from '@expo/vector-icons'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          },
        )
        const data = await response.json()
        setMovie(data)
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Add logic to add/remove movie from favorites list
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
        <Text>Movie not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.poster}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
      />
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
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rating:</Text>
          <Text style={styles.detailText}>{movie.vote_average}</Text>
        </View>
        <TouchableOpacity
          onPress={toggleFavorite}
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
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
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
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
  },
})

export default MovieDetail
