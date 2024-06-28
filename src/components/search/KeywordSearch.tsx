import React, { useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native'

interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string
}

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState('') // State untuk menyimpan keyword pencarian
  const [movies, setMovies] = useState<Movie[]>([]) // State untuk menyimpan hasil pencarian film
  const [loading, setLoading] = useState(false) // State untuk status loading

  // Fungsi untuk memanggil API TMDB berdasarkan kata kunci
  const fetchMoviesByKeyword = async (query: string) => {
    const TMDB_API_KEY = '04f6dd992a0e046fd8dd068b4e4025a4' // Gantilah dengan API key Anda dari TMDB
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=en-US&page=1`

    try {
      setLoading(true)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Fetched Movies:', data.results) // Log data yang diterima untuk debug
      if (data.results) {
        setMovies(data.results)
      } else {
        setMovies([]) // Set hasil ke kosong jika tidak ada data
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      setMovies([]) // Jika terjadi error, set hasil pencarian ke kosong
    } finally {
      setLoading(false)
    }
  }

  // Fungsi untuk menangani submit pencarian
  const handleSubmit = () => {
    if (keyword.trim().length > 0) {
      fetchMoviesByKeyword(keyword)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setKeyword} // Mengupdate state keyword
        value={keyword}
        placeholder="Input Title Movie Here"
        onSubmitEditing={handleSubmit} // Memanggil handleSubmit saat pengguna menekan tombol "Enter"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Menampilkan spinner saat loading
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()} // Kunci unik untuk setiap item
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
              <Text style={styles.noResultsText}>No results found</Text>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
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

export default KeywordSearch
