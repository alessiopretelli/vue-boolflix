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

                    this.movies[0].forEach((element) => {                        
                        axios
                        .get(`https://flagcdn.com/${element.original_language}/codes.json`)
                        .then((res) => {
                            //res da' stato 200 a 'en' ma non restituisce alcun png, pur inserendo le bandiere di altri paesi anglofoni; l'ho quindi escluso.
                            if((res.status == 200) && (element.original_language != 'en')) {
                                element.original_language = [element.original_language];
                                element.original_language.push(
                                    'https://flagcdn.com/16x12/' + element.original_language[0] + '.png',
                                    'ok'
                                );
                            }

                            if(element.original_language == 'en') {
                                element.original_language = [element.original_language];
                                element.original_language.push(
                                    'https://www.countryflags.io/gb/flat/16.png',
                                    'ok'
                                );
                            }

                        });
                    });

                    console.log(this.movies);
                });
                
                this.search = '';
            }
        }    
    }

});