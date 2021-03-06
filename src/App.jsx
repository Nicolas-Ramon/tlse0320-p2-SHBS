import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import Collection from './components/collection/Collection';
import SecondHomePage from './components/home/SecondHomePage';
import Board from './components/board/Board';
import Stats from './components/stats/Stats';
import NavBar from './components/nav/NavBar';
import './App.css';

function App() {
  const [deck, setDeck] = useState([]);
  const [deckOp, setDeckOp] = useState([]);

  return (
    <div>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Collection" exact>
            <Collection addDeck={setDeck} addDeckOp={setDeckOp} />
          </Route>
          <Route path="/Board" exact>
            <Board deck={deck} deckOp={deckOp} />
          </Route>
          <Route path="/Rules" exact component={Home} />
          <Route path="/Stats" exact component={Stats} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
