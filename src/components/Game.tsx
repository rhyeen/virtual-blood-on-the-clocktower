import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { Character, Trait } from '../entities/characters';
import { shuffleNumberRange } from '../utils/shuffle';
import { AtNightScreen } from './AtNightScreen';
import { PlayerScreen } from './PlayerScreen';
import { StartGameScreen } from './StartGameScreen';

export const allCharacters: Character[] = [
  new Character('Gravekeeper', true, 'townsfolk'),
  new Character('Gossipmonger', true, 'townsfolk'),
  new Character('Ravenkeeper', true, 'townsfolk'),
  new Character('Investigator', true, 'townsfolk'),
  new Character('Bedmaker', true, 'townsfolk'),
  new Character('Medicine Doctor', true, 'townsfolk'),
  new Character('Hero', true, 'townsfolk'),
  new Character('Grandparent', true, 'townsfolk'),
  new Character('Oracle', true, 'townsfolk'),
  new Character('Townguard', true, 'townsfolk'),
  new Character('Dreamer', true, 'townsfolk'),
  new Character('Fortune Teller', true, 'townsfolk'),
  new Character('Poisoner', true, 'minion'),
  new Character('Spy', true, 'minion'),
  new Character('Assassin', true, 'minion'),
  new Character('Vampire Spawn', false, 'minion'),
  new Character('Mad Magician', true, 'villain'),
  new Character('Grim Reaper', true, 'villain'),
  new Character('Vampire', false, 'villain'),
  new Character('Cleric', true, 'outsiderGood'),
  new Character('Bard', true, 'outsiderGood'),
  new Character('Slayer', true, 'outsiderGood'),
  new Character('Mastermind', true, 'outsiderEvil'),
  new Character('Evil Twin', true, 'outsiderEvil'),
];

export const allTraits: Trait[] = [
  new Trait('Saint', true),
  new Trait('Recluse', true),
  new Trait('Drunk', true),
  new Trait('Lucky', false),
];

type Screen = 'players' | 'startGame' | 'atNight';

type PlayerUndef = string | undefined;

export const Game: FunctionComponent = (): ReactElement => {
  const [ characters, setCharacters ] = useState([] as Character[]);
  const [ traits, setTraits ] = useState([] as Trait[]);
  const [ screen, setScreen ] = useState('players' as Screen);
  const [ gossipmongerChoices, setGossipmongerChoices ] = useState<[PlayerUndef, PlayerUndef]>([undefined, undefined]);
  const [ investigatorChoice, setInvestigatorChoice ] = useState<PlayerUndef>(undefined);
  const [ medicineDoctorChoices, setMedicineDoctorChoices ] = useState<[PlayerUndef, PlayerUndef]>([undefined, undefined]);
  const [ grandParentChoice, setGrandParentChoice ] = useState<PlayerUndef>(undefined);
  const [ townguardChoices, setTownguardChoices ] = useState<[PlayerUndef, PlayerUndef]>([undefined, undefined]);
  const [ fortuneTellerRegisterChoice, setFortuneTellerRegisterChoice ] = useState<PlayerUndef>(undefined);
  const [ executedToday, setExecutedToday ] = useState<PlayerUndef>(undefined);
  const [ bardChoices, setBardChoices ] = useState<[PlayerUndef, PlayerUndef]>([undefined, undefined]);
  const [ drunkFromBardChoice, setDrunkFromBardChoice ] = useState<PlayerUndef>(undefined);
  const [ fortuneTellerChoices, setFortuneTellerChoices ] = useState<[PlayerUndef, PlayerUndef]>([undefined, undefined]);
  const [ poisonerChoice, setPoisonerChoice ] = useState<PlayerUndef>(undefined);
  const [ spyChoice, setSpyChoice ] = useState<PlayerUndef>(undefined);
  const [ heroChoice, setHeroChoice ] = useState<PlayerUndef>(undefined);
  const [ clericChoice, setClericChoice ] = useState<PlayerUndef>(undefined);
  const [ madMagicianChoice, setMadMagicianChoice ] = useState<PlayerUndef>(undefined);
  const [ grimReaperChoice, setGrimReaperChoice ] = useState<PlayerUndef>(undefined);
  const [ vampireSpawnChoice, setVampireSpawnChoice ] = useState<PlayerUndef>(undefined);
  const [ vampireChoice, setVampireChoice ] = useState<PlayerUndef>(undefined);
  const [ assassinChoice, setAssassinChoice ] = useState<PlayerUndef>(undefined);
  const [ bedmakerChoices, setBedmakerChoices ] = useState<[PlayerUndef, PlayerUndef]>([undefined, undefined]);
  const [ jsonGameState, setJsonGameState ] = useState('');

  useEffect(() => {
    const includedCharacters = allCharacters.filter(character => character.includeInGame);
    const includedTraits = allTraits.filter(trait => trait.includeInGame);
    const randomRange = shuffleNumberRange(1, includedCharacters.length + includedTraits.length);
    includedCharacters.forEach((character, index) => character.randomNumber = randomRange[index]);
    includedTraits.forEach((trait, index) => trait.randomNumber = randomRange[index + includedCharacters.length]);
    setCharacters(includedCharacters);
    setTraits(includedTraits);
  }, []);

  const updateCharacter = (index: number, character: Character) => {
    const cs = characters.map(c => c.copy());
    cs[index] = character;
    setCharacters(cs);
  };

  const updateCharacterWithoutIndex = (character: Character) => {
    const index = characters.findIndex(c => c.player === character.player);
    if (index === -1) {
      console.error('Could not find character', character);
    }
    updateCharacter(index, character);
  };

  const updateTrait = (index: number, trait: Trait) => {
    const tr = traits.map(c => c.copy());
    tr[index] = trait;
    setTraits(tr);
  };

  const saveGame = () => {
    setJsonGameState(JSON.stringify({
      characters: characters.map(c => c.json()),
      traits: traits.map(t => t.json()),
      gossipmongerChoices,
      investigatorChoice,
      medicineDoctorChoices,
      grandParentChoice,
      townguardChoices,
      fortuneTellerRegisterChoice,
      executedToday,
      bardChoices,
      drunkFromBardChoice,
      fortuneTellerChoices,
      poisonerChoice,
      spyChoice,
      heroChoice,
      clericChoice,
      madMagicianChoice,
      grimReaperChoice,
      vampireSpawnChoice,
      vampireChoice,
      assassinChoice,
      bedmakerChoices,
    }));
  };

  const loadGame = () => {
    const json = JSON.parse(jsonGameState);
    setCharacters(json.characters.map((c: any) => Character.build(c)));
    setTraits(json.traits.map((t: any) => Trait.build(t)));
    setGossipmongerChoices(json.gossipmongerChoices);
    setInvestigatorChoice(json.investigatorChoice);
    setMedicineDoctorChoices(json.medicineDoctorChoices);
    setGrandParentChoice(json.grandParentChoice);
    setTownguardChoices(json.townguardChoices);
    setFortuneTellerRegisterChoice(json.fortuneTellerRegisterChoice);
    setExecutedToday(json.executedToday);
    setBardChoices(json.bardChoices);
    setDrunkFromBardChoice(json.drunkFromBardChoice);
    setFortuneTellerChoices(json.fortuneTellerChoices);
    setPoisonerChoice(json.poisonerChoice);
    setSpyChoice(json.spyChoice);
    setHeroChoice(json.heroChoice);
    setClericChoice(json.clericChoice);
    setMadMagicianChoice(json.madMagicianChoice);
    setGrimReaperChoice(json.grimReaperChoice);
    setVampireSpawnChoice(json.vampireSpawnChoice);
    setVampireChoice(json.vampireChoice);
    setAssassinChoice(json.assassinChoice);
    setBedmakerChoices(json.bedmakerChoices);
  };

  return (
    <div style={{
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        columnGap: '10px',
      }}>
        <button onClick={() => setScreen('players')}>Players</button>
        <button onClick={() => setScreen('startGame')}>Start</button>
        <button onClick={() => setScreen('atNight')}>Night</button>
        <button onClick={saveGame}>Save Game</button>
        <div style={{
          display: 'flex',
          columnGap: '5px',
        }}>
          <input value={jsonGameState} onChange={(e) => setJsonGameState(e.target.value)} />
          <button onClick={loadGame}>Load Game</button>
        </div>
      </div>
      <div style={{
        padding: '20px',
      }}>
        {screen === 'players' &&
          <PlayerScreen
            characters={characters}
            traits={traits}
            updateCharacter={updateCharacter}
            updateTrait={updateTrait}
          />
        }
        {screen === 'startGame' &&
          <StartGameScreen
            characters={characters.map(c => c.copy())}
            traits={traits}
            gossipmongerChoices={gossipmongerChoices}
            setGossipmongerChoices={setGossipmongerChoices}
            investigatorChoice={investigatorChoice}
            setInvestigatorChoice={setInvestigatorChoice}
            medicineDoctorChoices={medicineDoctorChoices}
            setMedicineDoctorChoices={setMedicineDoctorChoices}
            grandParentChoice={grandParentChoice}
            setGrandParentChoice={setGrandParentChoice}
            townguardChoices={townguardChoices}
            setTownguardChoices={setTownguardChoices}
            fortuneTellerChoice={fortuneTellerRegisterChoice}
            setFortuneTellerChoice={setFortuneTellerRegisterChoice}
          />
        }
        {screen === 'atNight' &&
          <AtNightScreen
            characters={characters}
            traits={traits}
            fortuneTellerRegisterChoice={fortuneTellerRegisterChoice}
            townguardChoices={townguardChoices}
            grandParentChoice={grandParentChoice}
            executedToday={executedToday}
            setExecutedToday={setExecutedToday}
            bardChoices={bardChoices}
            setBardChoices={setBardChoices}
            drunkFromBardChoice={drunkFromBardChoice}
            setDrunkFromBardChoice={setDrunkFromBardChoice}
            fortuneTellerChoices={fortuneTellerChoices}
            setFortuneTellerChoices={setFortuneTellerChoices}
            poisonerChoice={poisonerChoice}
            setPoisonerChoice={setPoisonerChoice}
            spyChoice={spyChoice}
            setSpyChoice={setSpyChoice}
            heroChoice={heroChoice}
            setHeroChoice={setHeroChoice}
            clericChoice={clericChoice}
            setClericChoice={setClericChoice}
            madMagicianChoice={madMagicianChoice}
            setMadMagicianChoice={setMadMagicianChoice}
            grimReaperChoice={grimReaperChoice}
            setGrimReaperChoice={setGrimReaperChoice}
            vampireSpawnChoice={vampireSpawnChoice}
            setVampireSpawnChoice={setVampireSpawnChoice}
            vampireChoice={vampireChoice}
            setVampireChoice={setVampireChoice}
            assassinChoice={assassinChoice}
            setAssassinChoice={setAssassinChoice}
            bedmakerChoices={bedmakerChoices}
            setBedmakerChoices={setBedmakerChoices}
            updateCharacter={updateCharacterWithoutIndex}
          />
        }
      </div>
    </div>
  );
}
