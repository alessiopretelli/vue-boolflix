var app = new Vue({
    el: '#app',
    data: {
        movies: [],
        search: ''
    },
    methods: {
        searching: function() {
            this.movies = [];
            if (this.search == 0) {
                this.movies = [];
            } else {
                axios
                .get('https://api.themoviedb.org/3/search/movie?api_key=1054834a21f5e84aed95192bd4b277cd&', { params: { query: this.search } })
                .then((result) => {
                    this.movies = [];
                    this.movies.push(result.data.results);

                    

                    console.log(this.movies);
                });     
            }
        }    
    }

});