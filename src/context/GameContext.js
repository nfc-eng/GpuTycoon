import React, {createContext, useContext} from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export default GameContext;
