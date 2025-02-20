import pickle
import streamlit as st
import requests

def get_movie_poster(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US"
    response = requests.get(url).json()
    poster_url = "https://image.tmdb.org/t/p/w500/" + response['poster_path']
    return poster_url

def get_recommendations(selected_movie):
    movie_idx = movies[movies['title'] == selected_movie].index[0]
    similar_movies = sorted(list(enumerate(similarity[movie_idx])), key=lambda x: x[1], reverse=True)

    recommended_titles = []
    recommended_posters = []

    for movie in similar_movies[1:6]:
        movie_id = movies.iloc[movie[0]].movie_id
        recommended_titles.append(movies.iloc[movie[0]].title)
        recommended_posters.append(get_movie_poster(movie_id))

    return recommended_titles, recommended_posters

st.header('Movie Recommendation System')
movies = pickle.load(open('model/movie_list.pkl', 'rb'))
similarity = pickle.load(open('model/similarity.pkl', 'rb'))

movie_list = movies['title'].values
selected_movie = st.selectbox("Choose a movie from the list", movie_list)

if st.button('Show Recommendations'):
    recommended_titles, recommended_posters = get_recommendations(selected_movie)
    col1, col2, col3, col4, col5 = st.columns(5)
    with col1:
        st.text(recommended_titles[0])
        st.image(recommended_posters[0])
    with col2:
        st.text(recommended_titles[1])
        st.image(recommended_posters[1])
    with col3:
        st.text(recommended_titles[2])
        st.image(recommended_posters[2])
    with col4:
        st.text(recommended_titles[3])
        st.image(recommended_posters[3])
    with col5:
        st.text(recommended_titles[4])
        st.image(recommended_posters[4])
