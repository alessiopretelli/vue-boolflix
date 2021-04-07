var app = new Vue({
    el: '#app',
    data: {
        movies: [],
        flag: ['gb', 'it', 'es', 'fr', 'de'],
        search: ''
    },
    methods: {
        searching: function() {
            this.movies = [];
            if (this.search == 0) {
                this.movies = [];
            } else {
                //chiamata API per film
                axios
                .get('https://api.themoviedb.org/3/search/movie?api_key=1054834a21f5e84aed95192bd4b277cd&', { params: { query: this.search } })
                .then((result) => {

                    result.data.results.forEach((element) => {
                        this.movies.push(element);
                    });

                });
                //chiamata API per serie TV con adattamento per in interpretazione nell'HTML
                axios
                .get('https://api.themoviedb.org/3/search/tv?api_key=1054834a21f5e84aed95192bd4b277cd&', { params: { query: this.search } })
                .then((re) => {
                    //metodo adattamento serie TV
                    this.convert(re);
                    console.log(this.movies);
                    //metodo bandiere. A volte non carica tutte le bandiere per problemi di connessione.
                    this.flags();
                    //metodo copertina
                    this.PosterPath();
                    //metodo ordinamento per popolarita'
                    this.IsPopular();
                });

                this.search = '';
            }
        },
        flags: function() {

            this.movies.forEach((element) => {

                if (element.original_language == 'en') {
                    element.original_language = 'gb';
                }
                
                if (this.flag.includes(element.original_language)) {
                    element.original_language = [element.original_language];
                    element.original_language.push(
                        `https://www.countryflags.io/${element.original_language}/flat/16.png`,
                        'ok'
                    );
                }

            });
        },
        convert: function(re) {
            re.data.results.forEach((element) => {
                var tmp = element.original_name;
                element.original_title = tmp;
                tmp = element.name;
                element.title = tmp;
                this.movies.push(element);
            });
        },
        IsPopular: function() {
            for (let i = 0; i < this.movies.length; i++) {

                for (let ii = i; ii < this.movies.length; ii++) {

                    if (this.movies[i].popularity < this.movies[ii].popularity) {
                        var tmp = this.movies[ii];
                        this.movies[ii] = this.movies[i];
                        this.movies[i] = tmp;
                    }    

                }

            }
        },
        PosterPath: function() {
            
            this.movies.forEach((element) => {
                element.posterURL = `https://image.tmdb.org/t/p/w185${element.poster_path}`
            });

        }    
    }

});