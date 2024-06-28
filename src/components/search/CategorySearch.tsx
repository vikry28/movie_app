import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native'

interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string
}

interface Genre {
  id: number
  name: string
}

const TMDB_API_KEY = '04f6dd992a0e046fd8dd068b4e4025a4'

const CategorySeach = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  const fetchGenres = async () => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`

    try {
      setLoading(true)
      const response = await fetch(url)
      const data = await response.json()
      console.log('Fetched Genres:', data.genres)
      setGenres(data.genres)
    } catch (error) {
      console.error('Error fetching genres:', error)
      setGenres([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMoviesByGenre = async (genreId: number) => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US&page=1`

    try {
      setLoading(true)
      const response = await fetch(url)
      const data = await response.json()
      console.log('Fetched Movies by Genre:', data.results)
      setMovies(data.results)
    } catch (error) {
      console.error('Error fetching movies by genre:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const handleGenrePress = (genreId: number) => {
    setSelectedGenre(genreId)
    fetchMoviesByGenre(genreId)
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {/* Daftar Kategori */}
      <FlatList
        data={genres}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.genreItem,
              item.id === selectedGenre ? styles.selectedGenre : {},
            ]}
            onPress={() => handleGenrePress(item.id)}
          >
            <Text style={styles.genreName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && genres.length === 0 ? (
            <Text style={styles.noResultsText}>No genres found</Text>
          ) : null
        }
      />
      {/* Daftar Film Berdasarkan Kategori */}
      {selectedGenre && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image
                style={styles.poster}
                source={{
                  uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                }}
              />
              <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                {item.overview ? (
                  <Text style={styles.overview}>{item.overview}</Text>
                ) : (
                  <Text style={styles.overview}>No overview available</Text>
                )}
                <Text style={styles.releaseDate}>
                  Release Date: {item.release_date}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            !loading && movies.length === 0 ? (
              <Text style={styles.noResultsText}>No movies found</Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  genreItem: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
  selectedGenre: {
    backgroundColor: '#cce7ff',
  },
  genreName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overview: {
    fontSize: 14,
    color: 'gray',
  },
  releaseDate: {
    fontSize: 12,
    color: 'blue',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
})

export default CategorySeach
