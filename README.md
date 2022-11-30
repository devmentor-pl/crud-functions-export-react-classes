# crud-functions-export-react-classes

*Jest to kontynuacja artykułu [CRUD w osobnym pliku – lepszy kod dla API](https://devmentor.pl/b/crud-w-osobnym-pliku-lepszy-kod-dla-api) z przykładami komponentów klasowych Reacta*

Mamy już provider: `catFactsProvider.js`, z którego importujemy pojedyncze funkcje do kontaktu z API.

Teraz znów chcemy jedynie wyświetlić użytkownikowi randomową ciekawostkę, potrzebujemy więc funkcji `get()` w pliku [App.js](./App.js). Wystarczy, że zaimportujemy ją z pliku catFactsProvider.js:

```js
// ./src/App.js

import { get } from  '../catFactsProvider.js';

```

Następnie pobieramy dane z API w momencie renderowania komponentu App – czyli w metodzie `componentDidMount()` – i umieszczamy pobraną informację w stanie komponentu (`this.setState`). Treść wyświetlamy użytkownikowi w elemencie `<p>`.

```js
// ./src/App.js
import React from 'react';
import './App.css';

import { get } from '../catFactsProvider.js';

class App extends React.Component {
    state = { catFact: '' };

    componentDidMount = () => {
        get('/fact').then(resp => {
            this.setState({ catFact: resp.fact });
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>{this.state.catFact}</p>
                </header>
            </div>
        );
    }
}

export default App;
```

## CRUD – wykorzystanie w aplikacji  

Teraz pokażę Ci zaletę trzymania metod dla API w osobnym pliku. Ten przykład także oprę na Reakcie, lecz oczywiście podejście to możemy wykorzystać również w czystym JS-ie czy innych bibliotekach/frameworkach.  

Załóżmy, że prócz faktu o kotach, chcemy wyświetlić też jakąś rasę. Zamiast tworzyć tę logikę w pliku App.js i go „zaśmiecać”, możemy stworzyć sobie **dodatkowy komponent** [RandomCatBreed](./RandomCatBreed.js) (w JS-ie byłby to osobny plik z odpowiednim kodem i eksportem) i w nim odpytać API, korzystając z gotowych metod z pliku catFactsProvider.js.

Zauważ, że korzystamy z możliwości odpytania innego zasobu. Wcześniej był to `/fact`, a teraz są rasy: `/breeds`.

```js
// ./src/RandomCatBreed.js

import React from 'react';
import { get } from './catFactsProvider'; // wykorzystujemy gotową metodę

class RandomCatBreed extends React.Component {
    state = { cat: {} };

    componentDidMount = () => {
        // odpytujemy API pod kątem ras
        get('/breeds').then(resp => {
            const random =
                resp.data[Math.floor(Math.random() * resp.data.length)];
            this.setState({ cat: random });
        });
    };

    render() {
        return <p>– {this.state.cat.breed} –</p>;
    }
}

export default RandomCatBreed;
```
W powyższym komponencie z API pobieramy informacje o wszystkich dostępnych rasach i losujemy z nich randomowy obiekt, na który składa się m.in: nazwa rasy, jej pochodzenie, długość sierści itp. My wykorzystamy tylko nazwę i w komponencie App.js wyświetlimy ją pod ciekawostką:

```js
// ./src/App.js
import React from 'react';
import './App.css';

import { get } from '../catFactsProvider.js';
import RandomCatBreed from './RandomCatBreed'; // importujemy nowy komponent

class App extends React.Component {
    state = { catFact: '' };

    componentDidMount = () => {
        get('/fact').then(resp => {
            this.setState({ catFact: resp.fact });
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>{this.state.catFact}</p>
                    {/* wyświetlamy nazwę rasy */}
                    <RandomCatBreed />
                </header>
            </div>
        );
    }
}

export default App;
```
Zobacz, w jak niewielkim stopniu zmienił się plik App.js – doszły zaledwie dwie linijki (import i render)! Cała logika trafiła do osobnego komponentu RandomCatBreed, a dzięki temu, że trzymamy CRUD w osobnym pliku, mogliśmy w tym komponencie z pomocą importu łatwo i szybko skorzystać z potrzebnej nam metody.

## JSON Server – przetestuj CRUD

Tak jak mówiłem na początku, ogólnodostępne API umożliwiają jedynie odczytywanie danych. Możesz jednak przetestować nasz osobny plik z CRUD-em dzięki [JSON Serverowi](https://www.npmjs.com/package/json-server).

  

To rozwiązanie, które **imituje działanie API** – możesz więc odczytywać, dodawać, modyfikować i usuwać dane z fake’owego serwera (czyli pliku JSON na Twoim komputerze). [Instalacja i uruchomienie](https://www.npmjs.com/package/json-server#getting-started) są bardzo proste, więc jeśli jeszcze nie korzystałeś z tego narzędzia, zacznij koniecznie! 🙂

  

Ja stworzyłem sobie „bazę danych” z kociętami w pliku [data.json](./data.json) w projekcie z Reactem (pamiętaj, że taki plik dla JSON Servera powinien się znajdować w katalogu głównym projektu).

```json
{
  "kittens": [
      {
          "id": 1,
          "name": "Gloria",
          "age": "2 months"
      },
      {
          "id": 2,
          "name": "Gutek",
          "lastName": "3 months"
      },
      {
          "id": 3,
          "name": "Teofil",
          "lastName": "6 months"
      }
  ]
}
```

Następnie zmieniłem adres URL w pliku **catFactsProvider.js** na nowe API, które zapewnia mi JSON Server (zwróć uwagę na to, by DevServer webpacka nie był również uruchomiony na porcie 3000):

```js

const  url = 'http://localhost:3000'

```

A teraz wykonam następujące operacje:

1. Zmienię imię pierwszego kota:

```js

update('/kittens', 1, { name:  'Gigi' });

```

2. Usunę drugiego kota z bazy:

```js

remove('/kittens', 2);

```

3. Dodam nowego kota:

```js

create('/kittens', { name:  'Max', age:  '3 months' });

```
Działania te będą asynchroniczne, niezależnie od siebie, dlatego w kodzie nie zastosowałem _async...await_ lub _.then()_, by poczekać na wynik poprzedniej operacji.

**Uwaga:** w prawdziwym projekcie operacji na bazie danych raczej nie wykonujemy przy uruchomieniu komponentu (tu: wewnątrz componentDidMount). Zrobiłem tak, by uprościć nasz przykład – chcemy jedynie sprawdzić, czy nastąpią zmiany w pliku data.json.

**Uwaga:** jeżeli korzystamy z create-react-app (a ono z kolei ze strict mode), to w trybie developerskim powinniśmy spodziewać się dwukrotnego uruchomienia kodu wewnątrz metody componentDidMount. Aby nam to nie przeszkadzało, wyłączymy strict mode w pliku index.js:

```js
// ./index.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
);
```
Ponieważ jednak strict mode jest po to, byśmy trzymali się dobrych prakryk, lepiej byłoby zastosować [odpowiedni zapis](https://stackoverflow.com/questions/71755119/reactjs-componentdidmount-executes-twice/71755316#71755316). Polecam zapoznać się w wolnej chwili.

Całość prezentuje się w następujący sposób (możesz przekleić poniższy kod do pliku App.js):
```js
// ./src/App.js

import React from 'react';
import './App.css';

import { update, remove, create } from './catFactsProvider.js';

class App extends React.Component {
    state = { catFact: '' };

    componentDidMount = () => {
        update('/kittens', 1, { name: 'Gigi' });
        remove('/kittens', 2);
        create('/kittens', { name: 'Max', age: '3 months' });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>testujesz JSON Server - sprawdź zmiany w pliku data.json</p>
                </header>
            </div>
        );
    }
}

export default App;
```

Po uruchomieniu kodu zmieniła się nasza baza danych zgodnie z tym, jakich metod użyłem: Gloria ma teraz na imię Gigi, obiekt z Gutkiem zniknął z bazy i pojawił się nowy obiekt z Maxem.
```json
{
  "kittens": [
    {
      "id": 1,
      "name": "Gigi",
      "age": "2 months"
    },
    {
      "id": 3,
      "name": "Teofil",
      "lastName": "6 months"
    },
    {
      "name": "Max",
      "age": "3 months",
      "id": 4
    }
  ]
}
```
Jeżeli chcesz, możesz nasz program rozbudować o dodatkowe opcje, np. formularz dodawania kociąt. Dzięki temu wykorzystanie CRUD-a stanie się bardziej naturalne – raczej bowiem przy pierwszym renderze komponentu nie korzystamy z innych metod niż get(). Jak już wspomniałem: zrobiłem to tylko na potrzeby zaprezentowania działania reszty metod 🙂

&nbsp;

W pracy programisty takie porządki w kodzie czekają Cię w każdym projekcie (a przynajmniej w tym, który będzie utrzymywany i rozwijany). Dążymy bowiem do tego, by w razie potrzeby każdy w zespole zorientował się w stworzonych przez nas funkcjonalnościach (czytelność), mógł korzystać z reużywalnych modułów (CRUD w osobnym pliku) i nie tworzył niepotrzebnego kodu (zasada DRY).
