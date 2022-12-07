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

type CharUndef = Character | undefined;

export const Game: FunctionComponent = (): ReactElement => {
  const [ characters, setCharacters ] = useState([] as Character[]);
  const [ traits, setTraits ] = useState([] as Trait[]);
  const [ screen, setScreen ] = useState('players' as Screen);
  const [ gossipmongerChoices, setGossipmongerChoices ] = useState<[CharUndef, CharUndef]>([undefined, undefined]);
  const [ investigatorChoice, setInvestigatorChoice ] = useState<CharUndef>(undefined);
  const [ medicineDoctorChoices, setMedicineDoctorChoices ] = useState<[CharUndef, CharUndef]>([undefined, undefined]);
  const [ grandParentChoice, setGrandParentChoice ] = useState<CharUndef>(undefined);
  const [ townguardChoices, setTownguardChoices ] = useState<[CharUndef, CharUndef]>([undefined, undefined]);
  const [ fortuneTellerChoice, setFortuneTellerChoice ] = useState<CharUndef>(undefined);
  const [ executedToday, setExecutedToday ] = useState<CharUndef>(undefined);
  const [ bardChoices, setBardChoices ] = useState<[CharUndef, CharUndef]>([undefined, undefined]);
  const [ drunkFromBardChoice, setDrunkFromBardChoice ] = useState<CharUndef>(undefined);
  const [ fortuneTellerChoices, setFortuneTellerChoices ] = useState<[CharUndef, CharUndef]>([undefined, undefined]);
  const [ poisonerChoice, setPoisonerChoice ] = useState<CharUndef>(undefined);
  const [ spyChoice, setSpyChoice ] = useState<CharUndef>(undefined);
  const [ heroChoice, setHeroChoice ] = useState<CharUndef>(undefined);
  const [ clericChoice, setClericChoice ] = useState<CharUndef>(undefined);
  const [ madMagicianChoice, setMadMagicianChoice ] = useState<CharUndef>(undefined);
  const [ grimReaperChoice, setGrimReaperChoice ] = useState<CharUndef>(undefined);
  const [ vampireSpawnChoice, setVampireSpawnChoice ] = useState<CharUndef>(undefined);
  const [ vampireChoice, setVampireChoice ] = useState<CharUndef>(undefined);
  const [ assassinChoice, setAssassinChoice ] = useState<CharUndef>(undefined);
  const [ bedmakerChoices, setBedmakerChoices ] = useState<[CharUndef, CharUndef]>([undefined, undefined]);
  
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
    console.log(index, character);
    updateCharacter(index, character);
  };

  const updateTrait = (index: number, trait: Trait) => {
    const tr = traits.map(c => c.copy());
    tr[index] = trait;
    setTraits(tr);
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
            fortuneTellerChoice={fortuneTellerChoice}
            setFortuneTellerChoice={setFortuneTellerChoice}
          />
        }
        {screen === 'atNight' &&
          <AtNightScreen
            characters={characters}
            traits={traits}
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
