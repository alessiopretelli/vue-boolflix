var app = new Vue({
    el: '#app',
    data: {
        movies: [],
        flag: ['gb', 'it', 'es', 'fr', 'de'],
        genres: [],
        types: ['Movies', 'Tv-Series'],
        typeselected: '',
        genreselected: [],
        glis: [],
        typeselected: [],
        search: ''
    },
    mounted() {
        axios
        .get('https://api.themoviedb.org/3/genre/movie/list?api_key=1054834a21f5e84aed95192bd4b277cd&language=en-US')
        .then((response) => {
            // console.log(response);
            response.data.genres.forEach((e) => {
                this.genres.push(e);
            });

        });
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
                        element.type = 'Movies';
                        element.visible = true;
                        this.movies.push(element);
                    });

                });
                //chiamata API per serie TV con adattamento per interpretazione nell'HTML
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
                    //metodo genere e cast
                    this.GenreNCast();       
                    //codice filtro
                    //si possono selezionare piu' filtri
                    if (this.genreselected.length > 0) {
                        console.log(this.genreselected);
                        this.movies.forEach((element) => {
                            element.visible = false;
                            for (let i = 0; i < element.genre.length; i++) {
            
                                if (this.genreselected.includes(element.genre[i])) {
                                    element.visible = true;
                                }
            
                            }
            
                        });    
                    }

                    if (this.typeselected != '') {

                        this.movies.forEach((element) => {

                            if ((this.typeselected == element.type) && (element.visible == true)) {
                                element.visible = true;
                            } else {
                                element.visible = false;
                            }

                        });

                    }    
                });

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
                element.type ='Tv-Series'
                element.visible = true;                
                this.movies.push(element);
            });
        },
        IsPopular: function() {

            for (let i = 0; i < this.movies.length; i++) {

                for (let ii = i; ii < this.movies.length; ii++) {

                    if (this.movies[i].popularity < this.movies[ii].popularity) {
                        var tmp2 = this.movies[ii];
                        this.movies[ii] = this.movies[i];
                        this.movies[i] = tmp2;
                    }    

                }

            }

        },
        PosterPath: function() {
            
            this.movies.forEach((element) => {
                element.posterURL = `https://image.tmdb.org/t/p/w342${element.poster_path}`;
                
                if (element.poster_path == null) {
                    element.posterURL = 'img/boolflix.png';
                }

            });
        },
        GenreNCast: function() {

            this.movies.forEach((element) => {
                element.genre = ["N/A"];
                element.cast = [];

                for (let i = 0; i < this.genres.length; i++) {

                    if (element.genre_ids.includes(this.genres[i].id)) {
                        
                        if (element.genre[0] == 'N/A') {
                            element.genre = [];
                        }

                        element.genre.push(this.genres[i].name);
                    }

                }
                //tentativo con AJAX in vanilla JS per velocita' risposta, solo il primo cast visualizzabile
                //mancata visualizzazione a schermo del cast, forse per mia connessione lenta, ma visibile nella console
                //anomalia: dopo la ricerca, premendo un tasto qualsiasi con la searchbar attiva si ha una parziale visualizzazione dei cast, ma non c'e' riaggiornamento pagina... 
                //concatenato AJAX in SEARCHING(): e' ancora piu' lento, non funziona...
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        if (JSON.parse(xhttp.response).cast.length >= 5) {
                            element.cast = [];

                            for (let i = 0; i < 5; i++) {
                                element.cast.push(JSON.parse(xhttp.response).cast[i].name);
                            }
                        
                        } else if ((JSON.parse(xhttp.response).cast.length == 0)) {
                            element.cast = ['N/A'];
                        } else {

                            for (let i = 0; i < JSON.parse(xhttp.response).cast.length; i++) {
                                element.cast.push(JSON.parse(xhttp.response).cast[i].name);
                            }

                        }

                    }
                };
                xhttp.open("GET",
                `http://api.themoviedb.org/3/movie/${element.id}/casts?api_key=1054834a21f5e84aed95192bd4b277cd`, true);
                xhttp.send();

            });

        },
        filterGenre: function(index) {

            console.log(index);
            if (this.genreselected.includes(this.genres[index].name)) {
                this.genreselected.splice(this.genreselected.indexOf(this.genres[index].name), 1);
                this.glis[index] = 0;
                console.log(this.glis);
            } else {
                this.genreselected.push(this.genres[index].name);
                this.glis[index] = 'selected';
                console.log(this.glis);
            }
            console.log(this.genreselected);

            this.searching();
        },
        filterType: function(index) {

            if (this.types[index] == this.typeselected) {
                this.typeselected = '';
            } else {
                this.typeselected = this.types[index];
            }

            this.searching();
        }
    }
});