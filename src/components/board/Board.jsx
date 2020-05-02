import React, { useState, useEffect } from 'react';
import './Board.css';
import DisplayBoard from './DisplayBoard';

const opponentDeck = [
  {
    id: 522,
    name: 'Batman',
    powerstats: {
      intelligence: 81,
      strength: 14,
      speed: 21,
      durability: 100,
      power: 100,
      combat: 30
    },
    index: 1,
    images: {
      md: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/md/69-batman.jpg'
    }
  },
  {
    id: 523,
    name: 'Batman',
    powerstats: {
      intelligence: 81,
      strength: 14,
      speed: 21,
      durability: 80,
      power: 100,
      combat: 38
    },
    index: 2,
    images: {
      md: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/md/69-batman.jpg'
    }
  },
  {
    id: 524,
    name: 'Batman',
    powerstats: {
      intelligence: 81,
      strength: 14,
      speed: 21,
      durability: 75,
      power: 100,
      combat: 40
    },
    index: 3,
    images: {
      md: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/md/69-batman.jpg'
    }
  }
];
const playerDeck = [
  {
    id: 525,
    name: 'Poison Ivy',
    powerstats: {
      intelligence: 81,
      strength: 14,
      speed: 21,
      durability: 70,
      power: 100,
      combat: 40
    },
    index: 4,
    images: {
      md: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/md/522-poison-ivy.jpg'
    }
  },
  {
    id: 526,
    name: 'Poison Ivy',
    powerstats: {
      intelligence: 81,
      strength: 14,
      speed: 21,
      durability: 90,
      power: 100,
      combat: 30
    },
    index: 5,
    images: {
      md: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/md/522-poison-ivy.jpg'
    }
  },
  {
    id: 527,
    name: 'Poison Ivy',
    powerstats: {
      intelligence: 81,
      strength: 14,
      speed: 21,
      durability: 95,
      power: 100,
      combat: 50
    },
    index: 6,
    images: {
      md: 'https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/images/md/522-poison-ivy.jpg'
    }
  }
];

const Board = () => {
  const [didMount, setDidMount] = useState(false);
  const [indexToDisplay, setIndexToDisplay] = useState();
  const [selectedCard, setSelectedCard] = useState();
  const [playerTurn, setPlayerTurn] = useState(true);
  const [oponentTurn, setOponentTurn] = useState(false);
  const [areFighting, setAreFighting] = useState([null, null, false, null]);
  const [isLoosingPoints, setIsLoosingPoints] = useState(false);
  const [life, setLife] = useState([
    playerDeck[0].powerstats.durability,
    playerDeck[1].powerstats.durability,
    playerDeck[2].powerstats.durability,
    opponentDeck[0].powerstats.durability,
    opponentDeck[1].powerstats.durability,
    opponentDeck[2].powerstats.durability
  ]);
  const [attack, setAttack] = useState([
    playerDeck[0].powerstats.combat,
    playerDeck[1].powerstats.combat,
    playerDeck[2].powerstats.combat,
    opponentDeck[0].powerstats.combat,
    opponentDeck[1].powerstats.combat,
    opponentDeck[2].powerstats.combat
  ]);

  useEffect(() => setDidMount(true), []);

  const handleHover = index => {
    setIndexToDisplay(index);
  };

  const clearIndex = () => {
    setIndexToDisplay();
  };

  /* Losing points one by one */
  useEffect(() => {
    const id = setInterval(() => {
      if (didMount && life[areFighting[0]] > areFighting[1] && life[areFighting[0]] > 0) {
        setIsLoosingPoints(true);
        const tempLife = [...life];
        tempLife[areFighting[0]] -= 1;
        setLife(tempLife);
        setAreFighting([areFighting[0], areFighting[1], !areFighting[2], areFighting[3]]);
      } else {
        setIsLoosingPoints(false);
      }
    }, 1000 / areFighting[3]);
    return () => {
      clearInterval(id);
    };
  }, [areFighting]);

  /* Set IA turn and timing */
  useEffect(() => {
    const id = setTimeout(() => {
      if (didMount && !isLoosingPoints && !playerTurn) {
        setOponentTurn(!oponentTurn);
      }
    }, 1400);
    return () => {
      clearTimeout(id);
    };
  }, [isLoosingPoints]);

  /* IA turn */
  useEffect(() => {
    if (didMount) {
      /* Random IA choice */
      const aliveSort = [...life].map((card, i) => (card > 0 ? i : 'dead'));
      const oponentSort = [...aliveSort].splice(3).filter(card => card !== 'dead');
      const playerSort = [...aliveSort].splice(0, 3).filter(card => card !== 'dead');
      const randomOponent = oponentSort[Math.floor(Math.random() * oponentSort.length)];
      const randomPlayer = playerSort[Math.floor(Math.random() * playerSort.length)];
      /* Apply attack */
      const newLife = life[randomPlayer] - attack[randomOponent];
      const diffDamage =
        attack[randomOponent] < life[randomPlayer] ? attack[randomOponent] : life[randomPlayer];
      setAreFighting([randomPlayer, newLife, !areFighting[2], diffDamage]);
      setPlayerTurn(true);
      console.log(`IA n°${randomOponent} attack player n°${randomPlayer} => loose ${diffDamage}`);
    }
  }, [oponentTurn]);

  /* User Turn */
  const handleClick = e => {
    const index = e.currentTarget.getAttribute('index');
    if (index < 3 && life[index] > 0 && playerTurn && !isLoosingPoints) {
      setSelectedCard(index);
    } else if (index >= 3 && life[index] > 0 && selectedCard) {
      setPlayerTurn(false);
      const newLife = life[index] - attack[selectedCard];
      const diffDamage = attack[selectedCard] < life[index] ? attack[selectedCard] : life[index];
      setAreFighting([index, newLife, !areFighting[2], diffDamage]);
      setSelectedCard();
      console.log(`Player n°${selectedCard} attack IA n°${index} => loose ${diffDamage}`);
    }
  };

  return (
    <DisplayBoard
      opponentDeck={opponentDeck}
      playerDeck={playerDeck}
      handleClick={handleClick}
      handleHover={handleHover}
      clearIndex={clearIndex}
      life={life}
      attack={attack}
    />
  );
};

export default Board;
