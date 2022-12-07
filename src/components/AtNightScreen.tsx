import React, { ChangeEvent, FunctionComponent, ReactElement } from 'react';
import { Character, Trait } from '../entities/characters';
import { CharacterRecord } from './CharacterRecord';

type CharUndef = Character | undefined;

const NULL = '_NULL';

interface Props {
  characters: Character[];
  traits: Trait[];
  executedToday: CharUndef;
  setExecutedToday: (player: CharUndef) => void;
  bardChoices: [CharUndef, CharUndef];
  setBardChoices: (players: [CharUndef, CharUndef]) => void;
  drunkFromBardChoice: CharUndef;
  setDrunkFromBardChoice: (player: CharUndef) => void;
  fortuneTellerChoices: [CharUndef, CharUndef];
  setFortuneTellerChoices: (players: [CharUndef, CharUndef]) => void;
  poisonerChoice: CharUndef;
  setPoisonerChoice: (player: CharUndef) => void;
  spyChoice: CharUndef;
  setSpyChoice: (player: CharUndef) => void;
  heroChoice: CharUndef;
  setHeroChoice: (player: CharUndef) => void;
  clericChoice: CharUndef;
  setClericChoice: (player: CharUndef) => void;
  madMagicianChoice: CharUndef;
  setMadMagicianChoice: (player: CharUndef) => void;
  grimReaperChoice: CharUndef;
  setGrimReaperChoice: (player: CharUndef) => void;
  vampireSpawnChoice: CharUndef;
  setVampireSpawnChoice: (player: CharUndef) => void;
  vampireChoice: CharUndef;
  setVampireChoice: (player: CharUndef) => void;
  assassinChoice: CharUndef;
  setAssassinChoice: (player: CharUndef) => void;
  bedmakerChoices: [CharUndef, CharUndef];
  setBedmakerChoices: (players: [CharUndef, CharUndef]) => void;
  updateCharacter: (character: Character) => void;
}

export const AtNightScreen: FunctionComponent<Props> = (props): ReactElement => {
  const prompts: [Character | Trait, string, ReactElement | undefined][] = [];
  const chs = props.characters;
  const trs = props.traits;
  const playerCharacters = chs.filter(c => c.player);
  const players = playerCharacters.map(c => c.player || '');
  const minion = chs.find(c => c.type === 'minion' && c.player);
  const assassinSkipped = props.assassinChoice?.role === 'Assassin';
  const grimReaperSkipped = props.grimReaperChoice?.role === 'Grim Reaper';

  const isTempDrunk = (ch: CharUndef | Trait): boolean => {
    if (!ch) {
      return false;
    }
    return ch?.player === props.drunkFromBardChoice?.player || ch?.player === props.poisonerChoice?.player;
  };

  const heroStoppedVillain = (villain: CharUndef): string | undefined => {
    const selectedByVillain = villain?.player === props.heroChoice?.player;
    const heroIsDrunk = hero?.isDrunk(trs) || isTempDrunk(hero);
    if (!selectedByVillain || heroIsDrunk) {
      return undefined;
    }
    return `The Hero stopped you from murder tonight, but revealed themselves to be ${hero?.player}.`;
  };

  const selectCharacter = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>): CharUndef => {
    const val = e.target.value;
    if (val === NULL) {
      return undefined;
    }
    return playerCharacters.find(c => c.player === val);
  };

  const poisoner = chs.find(c => c.role === 'Poisoner' && c.player);
  if (poisoner && !poisoner.killed) {
    prompts.push([poisoner, `
      Respond with the name of a player.
      Their ability malfunctions until the start of the next night.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.poisonerChoice?.player}
          onChange={(e) => props.setPoisonerChoice(selectCharacter(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
      </div>
    )]);
  }

  const waitForPoisoner = poisoner && !poisoner.killed && !props.poisonerChoice?.player ? 'Must wait for poisoner' : undefined;

  const spy = chs.find(c => c.role === 'Spy' && c.player);
  if (spy && !spy.killed) {
    prompts.push([spy, `
      Respond with the name of a player (other than yourself).
      You will learn their role.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.spyChoice?.player}
          onChange={(e) => props.setSpyChoice(selectCharacter(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {props.spyChoice?.player && 
          <div>{`${props.spyChoice.player} is the ${props.spyChoice.role}`}</div>
        }
      </div>
    )]);
  }

  const assassin = chs.find(c => c.role === 'Assassin' && c.player);
  if (assassin && !assassin.killed) {
    prompts.push([assassin, `
      If you wish to use your one-time ability, respond with the name of the 
      player you wish to kill (other than yourself).
      Otherwise, respond with "skip".
      This player will still be able to use their ability this night.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.assassinChoice?.player}
          onChange={(e) => props.setAssassinChoice(selectCharacter(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
          {/* NOTE: we just set it to the assassin because it's conveniant */}
          <option value={assassin.player} key={assassin.player}>Skip</option>
        </select>
      </div>
    )]);
  }

  const waitForAssassin = assassin && !assassin.killed && !props.assassinChoice?.player ? 'Must wait for assassin' : undefined;

  const bard = chs.find(c => c.role === 'Bard' && c.player);
  if (bard && !bard.killed) {
    prompts.push([bard, `
      Respond with the name of 2 players (other than yourself).
      Only if both of them are good, they cannot die at night until you do.
      One of them is going to be Drunk tonight.
      You do not know if they are good or evil.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.bardChoices[0]?.player ?? ''}
          onChange={(e) => props.setBardChoices([
            selectCharacter(e),
            props.bardChoices[1],
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.bardChoices[1]?.player ?? ''}
          onChange={(e) => props.setBardChoices([
            props.bardChoices[0],
            selectCharacter(e),
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {!props.bardChoices[0]?.player || !props.bardChoices[1]?.player ?
          <div>Wait for bard to choose</div>
        :
          <select
            value={props.drunkFromBardChoice?.player}
            onChange={(e) => props.setDrunkFromBardChoice(selectCharacter(e))}
          >
            <option value={''} key={NULL}>Drunk Player</option>
            {props.bardChoices.filter(c => c?.isGood).map(c => <option value={c?.player} key={c?.player}>{`${c?.player} (${c?.role})`}</option>)}
            {/* NOTE: we just set it to the bard because it's conveniant */}
            <option value={bard.player} key={bard.player}>No drunk</option>
          </select>
        }
      </div>
    )]);
  }

  const waitForBard = (
    bard && 
    !bard.killed &&
    (!props.bardChoices[0]?.player || !props.bardChoices[1]?.player || !props.drunkFromBardChoice?.player) ?
    'Must wait for bard' : undefined
  );

  const waitForDrunks = waitForBard || waitForPoisoner;

  const gravekeeper = chs.find(c => c.role === 'Gravekeeper' && c.player);
  if (gravekeeper && props.executedToday && !gravekeeper.killed) {
    prompts.push([gravekeeper, waitForDrunks ? waitForDrunks : `
      ${props.executedToday.player}, who was executed today, was the ${props.executedToday.role}.
    `, undefined]);
  }

  const fortuneTeller = chs.find(c => c.role === 'FortuneTeller' && c.player);
  if (fortuneTeller && !fortuneTeller.killed) {
    prompts.push([fortuneTeller, `
      Respond with the name of 2 players (other than yourself) that you want to 
      see if they register as the Villain or not.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.fortuneTellerChoices[0]?.player}
          onChange={(e) => props.setFortuneTellerChoices([
            selectCharacter(e),
            props.fortuneTellerChoices[1],
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.fortuneTellerChoices[1]?.player}
          onChange={(e) => props.setFortuneTellerChoices([
            props.fortuneTellerChoices[0],
            selectCharacter(e),
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForDrunks ? waitForDrunks : '' }</div>
      </div>
    )]);
  }

  const hero = chs.find(c => c.role === 'Hero' && c.player);
  if (hero && !hero.killed) {
    prompts.push([hero, `
      Respond with the name of a player.
      If that player is the Villain, they will know who you are and will not be 
      able to kill anyone tonight.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.heroChoice?.player}
          onChange={(e) => props.setHeroChoice(playerCharacters.find(c => c.player === e.target.value))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForDrunks ? waitForDrunks : '' }</div>
      </div>
    )]);
  }

  const waitForHero = hero && !hero.killed && !props.heroChoice?.player ? 'Must wait for hero' : undefined;

  const cleric = chs.find(c => c.role === 'Cleric' && c.player);
  if (cleric && !cleric.killed) {
    prompts.push([cleric, `
      Respond with the name of a player (other than yourself) 
      to protect from the Villain tonight.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.clericChoice?.player}
          onChange={(e) => props.setClericChoice(playerCharacters.find(c => c.player === e.target.value))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForDrunks ? waitForDrunks : '' }</div>
      </div>
    )]);
  }

  const waitForCleric = cleric && !cleric.killed && !props.clericChoice?.player ? 'Must wait for cleric' : undefined;
  const waitForSavedFromDeath = waitForCleric || waitForHero;

  const madMagician = chs.find(c => c.role === 'Mad Magician' && c.player);
  if (madMagician) {
    if (!minion?.player) {
      return <div>Mad Magician requires a minion.</div>;
    }
    prompts.push([madMagician, minion.killed ? 'Respond with the name of a player to kill' : `
      Respond with the name of a player to kill,
      which can be yourself if you wish ${minion.player} to become the Mad Magician.
      This player will still be able to use their ability this night.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.madMagicianChoice?.player}
          onChange={(e) => props.setMadMagicianChoice(playerCharacters.find(c => c.player === e.target.value))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(madMagician) }</div>
      </div>
    )]);
  }

  const waitForMadMagician = madMagician && !props.madMagicianChoice?.player ? 'Must wait for mad magician' : undefined;

  const grimReaper = chs.find(c => c.role === 'Grim Reaper' && c.player);
  if (grimReaper) {
    if (!minion?.player) {
      return <div>Grim Reaper requires a minion.</div>;
    }
    prompts.push([grimReaper, props.executedToday?.player ? 'Someone was executed today, so you cannot kill tonight.' : `
      Respond with the name of a player to kill (other than yourself).
      This player will still be able to use their ability this night.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.grimReaperChoice?.player}
          onChange={(e) => props.setGrimReaperChoice(playerCharacters.find(c => c.player === e.target.value))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
          {/* NOTE: we just set it to the grimReaper because it's conveniant */}
          <option value={grimReaper.player} key={grimReaper.player}>Skip</option>
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(grimReaper) }</div>
      </div>
    )]);
  }

  const waitForGrimReaper = grimReaper && !props.grimReaperChoice?.player ? 'Must wait for grim reaper' : undefined;

  const vampire = chs.find(c => c.role === 'Vampire' && c.player);
  if (vampire) {
    if (!minion?.player) {
      return <div>Vampire requires a minion.</div>;
    }
    prompts.push([vampire, `
      Respond with two names: 
      The first name is the player that if they are executed the next day, 
      they become a Vampire Spawn at the start of the next night.
      The second name is the player that you kill tonight.
      This player will still be able to use their ability this night.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.vampireSpawnChoice?.player}
          onChange={(e) => props.setVampireSpawnChoice(playerCharacters.find(c => c.player === e.target.value))}
        >
          <option value={''} key={NULL}>Select player to spawn</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.vampireChoice?.player}
          onChange={(e) => props.setVampireChoice(playerCharacters.find(c => c.player === e.target.value))}
        >
          <option value={''} key={NULL}>Select player to kill</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(vampire) }</div>
      </div>
    )]);
  }

  const waitForVampire = vampire && !props.vampireChoice?.player && !props.vampireSpawnChoice?.player ? 'Must wait for vampire' : undefined;
  const waitForVillain = waitForMadMagician || waitForGrimReaper || waitForVampire;

  const dreamer = chs.find(c => c.role === 'Dreamer' && c.player);
  if (dreamer && !dreamer.killed) {
    const deadEvilPlayers = chs.filter(c => c.killed && c.registersAsEvil(trs));
    prompts.push([dreamer, waitForDrunks ? waitForDrunks : `
      You know ${deadEvilPlayers.length} dead player(s) are evil.  
      Note that a recluse appears evil, if there is one.
    `, undefined]);
  }

  const bedmaker = chs.find(c => c.role === 'Bedmaker' && c.player);
  if (bedmaker && !bedmaker.killed) {
    const countAbility = (player: string): 0 | 1 => {
      const ch = prompts.map(prompt => prompt[0]).find(ch => ch.player === player);
      if (!ch) {
        return 0;
      }
      if (ch.role === 'Assassin' && assassinSkipped) {
        return 0;
      }
      if (ch.role === 'Grim Reaper' && grimReaperSkipped) {
        return 0;
      }
      return 1;
    };

    prompts.push([bedmaker, `
      Respond with the name of 2 players.
      You learn how many used their abilities tonight.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.bedmakerChoices[0]?.player}
          onChange={(e) => props.setBedmakerChoices([
            selectCharacter(e),
            props.bedmakerChoices[1],
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.bedmakerChoices[1]?.player}
          onChange={(e) => props.setBedmakerChoices([
            props.bedmakerChoices[0],
            selectCharacter(e),
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {
          waitForDrunks ? waitForDrunks : 
          waitForSavedFromDeath ? waitForSavedFromDeath : 
          waitForVillain ? waitForVillain : 
          waitForAssassin ? waitForAssassin :
          (!props.bedmakerChoices[0]?.player || !props.bedmakerChoices[1]?.player) ? undefined :
          (countAbility(props.bedmakerChoices[0]?.player) + countAbility(props.bedmakerChoices[1]?.player)) + ' player(s) used their ability tonight'
        }
      </div>
    )]);
  }

  const getResultingDeaths = (): ReactElement => {
    const deadPlayers = [];
    if (props.executedToday?.player) {
      deadPlayers.push(props.executedToday)
    }
    if (props.assassinChoice?.player) {
      deadPlayers.push(props.assassinChoice);
    }
    let villainKill: CharUndef = undefined;
    if (props.madMagicianChoice?.player && !heroStoppedVillain(madMagician)) {
      villainKill = props.madMagicianChoice;
    }
    if (props.grimReaperChoice?.player && !heroStoppedVillain(grimReaper)) {
      villainKill = props.grimReaperChoice;
    }
    if (props.vampireChoice?.player && !heroStoppedVillain(vampire)) {
      villainKill = props.vampireChoice;
    }
    if (
      !isTempDrunk(bard) &&
      props.bardChoices[0]?.isGood && 
      props.bardChoices[1]?.isGood && 
      props.bardChoices.find(c => c?.player === villainKill?.player)
    ) {
      villainKill = undefined;
    }
    if (!isTempDrunk(cleric) && props.clericChoice?.player === villainKill?.player) {
      villainKill = undefined;
    }
    if (villainKill?.player) {
      deadPlayers.push(villainKill);
    }
    return (
      <div>
        {deadPlayers.map((character, index) => {
          return (
            <div key={index}>
              <CharacterRecord killOnly character={character} update={(ch) => props.updateCharacter(ch)} />
            </div>
          );
        })}
      </div>
    );
  };

  const reset = () => {
    props.setExecutedToday(undefined);
    props.setBardChoices([undefined, undefined]);
    props.setDrunkFromBardChoice(undefined);
    props.setFortuneTellerChoices([undefined, undefined]);
    props.setPoisonerChoice(undefined);
    props.setSpyChoice(undefined);
    props.setHeroChoice(undefined);
    props.setClericChoice(undefined);
    props.setMadMagicianChoice(undefined);
    props.setGrimReaperChoice(undefined);
    props.setVampireSpawnChoice(undefined);
    props.setVampireChoice(undefined);
    props.setAssassinChoice(undefined);
    props.setBedmakerChoices([undefined, undefined]);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '25px',
      }}>
        <div style={{
          display: 'flex',
          columnGap: '40px',
        }}>
          <select
            value={props.executedToday?.player}
            onChange={(e) => props.setExecutedToday(selectCharacter(e))}
          >
            <option value={''} key="_NULL">Executed Today</option>
            {playerCharacters.map(c => <option value={c.player} key={c.player}>{`${c.player} (${c.role})`}</option>)}
          </select>
          <button onClick={reset}>Reset</button>
        </div>
        <div>
          { prompts.map((prompt, index) => {
            const [ ch, p, additionalDetails ] = prompt;
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: '5px',
              }}>
                <div style={{
                  display: 'flex',
                  columnGap: '10px',
                  fontWeight: 700,
                }}>
                  <div>{ch.player}</div>
                  <div>|</div>
                  <div>{ch.role}:</div>
                </div>
                <div style={{
                  backgroundColor: ch.isDrunk(trs) ? '#dd99dd' : isTempDrunk(ch) ? '#ddbbdd' : undefined,
                  padding: '5px',
                }}>{p}</div>
                {additionalDetails}
              </div>
            );
          }) }
        </div>
        <div>
          <h3>Resulting Deaths</h3>
          {
            waitForDrunks ? waitForDrunks : 
            waitForSavedFromDeath ? waitForSavedFromDeath : 
            waitForVillain ? waitForVillain : 
            waitForAssassin ? waitForAssassin : getResultingDeaths()
          }
        </div>
      </div>
    </div>
  );
}
