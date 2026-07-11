import './style.css';
import * as ui from './ui.js';

// index.html still uses inline onclick/oninput attributes (unchanged from the
// original prototype) — those run in global scope, so the handlers they call
// need to exist on window. Everything else in ui.js stays module-private.
Object.assign(window, {
  selectMode: ui.selectMode,
  goHome: ui.goHome,
  goSetup: ui.goSetup,
  addPlayer: ui.addPlayer,
  removePlayer: ui.removePlayer,
  updatePlayerName: ui.updatePlayerName,
  goToPeek: ui.goToPeek,
  unlockPeek: ui.unlockPeek,
  peekNext: ui.peekNext,
  selectMeta: ui.selectMeta,
  confirmMeta: ui.confirmMeta,
  startEliminationVote: ui.startEliminationVote,
  confirmElimination: ui.confirmElimination,
  confirmTiedVote: ui.confirmTiedVote,
  showGameOver: ui.showGameOver,
  restartSame: ui.restartSame,
});

ui.initPlayers();
