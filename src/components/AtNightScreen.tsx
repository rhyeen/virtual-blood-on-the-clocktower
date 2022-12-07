import React, { ChangeEvent, FunctionComponent, ReactElement } from 'react';
import { Character, Trait } from '../entities/characters';
import { CharacterRecord } from './CharacterRecord';

type PlayerUndef = string | undefined;
type CharUndef = Character | undefined;

const NULL = '_NULL';

interface Props {
  characters: Character[];
  traits: Trait[];
  executedToday: PlayerUndef;
  setExecutedToday: (player: PlayerUndef) => void;
  bardChoices: [PlayerUndef, PlayerUndef];
  setBardChoices: (players: [PlayerUndef, PlayerUndef]) => void;
  drunkFromBardChoice: PlayerUndef;
  setDrunkFromBardChoice: (player: PlayerUndef) => void;
  fortuneTellerChoices: [PlayerUndef, PlayerUndef];
  setFortuneTellerChoices: (players: [PlayerUndef, PlayerUndef]) => void;
  poisonerChoice: PlayerUndef;
  setPoisonerChoice: (player: PlayerUndef) => void;
  spyChoice: PlayerUndef;
  setSpyChoice: (player: PlayerUndef) => void;
  heroChoice: PlayerUndef;
  setHeroChoice: (player: PlayerUndef) => void;
  clericChoice: PlayerUndef;
  setClericChoice: (player: PlayerUndef) => void;
  madMagicianChoice: PlayerUndef;
  setMadMagicianChoice: (player: PlayerUndef) => void;
  grimReaperChoice: PlayerUndef;
  setGrimReaperChoice: (player: PlayerUndef) => void;
  vampireSpawnChoice: PlayerUndef;
  setVampireSpawnChoice: (player: PlayerUndef) => void;
  vampireChoice: PlayerUndef;
  setVampireChoice: (player: PlayerUndef) => void;
  assassinChoice: PlayerUndef;
  setAssassinChoice: (player: PlayerUndef) => void;
  bedmakerChoices: [PlayerUndef, PlayerUndef];
  setBedmakerChoices: (players: [PlayerUndef, PlayerUndef]) => void;
  updateCharacter: (character: Character) => void;
}

export const AtNightScreen: FunctionComponent<Props> = (props): ReactElement => {
  const prompts: [Character | Trait, string, ReactElement | undefined][] = [];
  const chs = props.characters;
  const trs = props.traits;

  const charUndef = (player: PlayerUndef): CharUndef => {
    return chs.find(c => c.player === player);
  };

  const selectPlayer = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>): PlayerUndef => {
    const val = e.target.value;
    if (val === NULL) {
      return undefined;
    }
    return val;
  };

  const playerCharacters = chs.filter(c => c.player);
  const players = playerCharacters.map(c => c.player || '');
  const minion = chs.find(c => c.type === 'minion' && c.player);
  const assassinSkipped = charUndef(props.assassinChoice)?.role === 'Assassin';
  const grimReaperSkipped = charUndef(props.grimReaperChoice)?.role === 'Grim Reaper';

  const isTempDrunk = (pl: PlayerUndef): boolean => {
    if (!pl) {
      return false;
    }
    return pl === props.drunkFromBardChoice || pl === props.poisonerChoice;
  };

  const heroStoppedVillain = (villain: PlayerUndef): string | undefined => {
    const selectedByVillain = villain === props.heroChoice;
    const heroIsDrunk = hero?.isDrunk(trs) || isTempDrunk(hero?.player);
    if (!selectedByVillain || heroIsDrunk) {
      return undefined;
    }
    return `The Hero stopped you from murder tonight, but revealed themselves to be ${hero?.player}.`;
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
          value={props.poisonerChoice}
          onChange={(e) => props.setPoisonerChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
      </div>
    )]);
  }

  const waitForPoisoner = poisoner && !poisoner.killed && !props.poisonerChoice ? 'Must wait for poisoner' : undefined;

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
          value={props.spyChoice}
          onChange={(e) => props.setSpyChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {props.spyChoice && 
          <div>{`${props.spyChoice} is the ${charUndef(props.spyChoice)?.role}`}</div>
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
          value={props.assassinChoice}
          onChange={(e) => props.setAssassinChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
          {/* NOTE: we just set it to the assassin because it's conveniant */}
          <option value={assassin.player} key={assassin.player}>Skip</option>
        </select>
      </div>
    )]);
  }

  const waitForAssassin = assassin && !assassin.killed && !props.assassinChoice ? 'Must wait for assassin' : undefined;

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
          value={props.bardChoices[0] ?? ''}
          onChange={(e) => props.setBardChoices([
            selectPlayer(e),
            props.bardChoices[1],
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.bardChoices[1] ?? ''}
          onChange={(e) => props.setBardChoices([
            props.bardChoices[0],
            selectPlayer(e),
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {!props.bardChoices[0] || !props.bardChoices[1] ?
          <div>Wait for bard to choose</div>
        :
          <select
            value={props.drunkFromBardChoice}
            onChange={(e) => props.setDrunkFromBardChoice(selectPlayer(e))}
          >
            <option value={''} key={NULL}>Drunk Player</option>
            {props.bardChoices.filter(p => charUndef(p)?.isGood).map(p => <option value={p} key={p}>{`${p} (${charUndef(p)?.role})`}</option>)}
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
    (!props.bardChoices[0] || !props.bardChoices[1] || !props.drunkFromBardChoice) ?
    'Must wait for bard' : undefined
  );

  const waitForDrunks = waitForBard || waitForPoisoner;

  const gravekeeper = chs.find(c => c.role === 'Gravekeeper' && c.player);
  if (gravekeeper && props.executedToday && !gravekeeper.killed) {
    prompts.push([gravekeeper, waitForDrunks ? waitForDrunks : `
      ${props.executedToday}, who was executed today, was the ${charUndef(props.executedToday)?.role}.
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
          value={props.fortuneTellerChoices[0]}
          onChange={(e) => props.setFortuneTellerChoices([
            selectPlayer(e),
            props.fortuneTellerChoices[1],
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.fortuneTellerChoices[1]}
          onChange={(e) => props.setFortuneTellerChoices([
            props.fortuneTellerChoices[0],
            selectPlayer(e),
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
          value={props.heroChoice}
          onChange={(e) => props.setHeroChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForDrunks ? waitForDrunks : '' }</div>
      </div>
    )]);
  }

  const waitForHero = hero && !hero.killed && !props.heroChoice ? 'Must wait for hero' : undefined;

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
          value={props.clericChoice}
          onChange={(e) => props.setClericChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForDrunks ? waitForDrunks : '' }</div>
      </div>
    )]);
  }

  const waitForCleric = cleric && !cleric.killed && !props.clericChoice ? 'Must wait for cleric' : undefined;
  const waitForSavedFromDeath = waitForCleric || waitForHero;

  const madMagician = chs.find(c => c.role === 'Mad Magician' && c.player);
  if (madMagician) {
    if (!minion) {
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
          value={props.madMagicianChoice}
          onChange={(e) => props.setMadMagicianChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(madMagician.player) }</div>
      </div>
    )]);
  }

  const waitForMadMagician = madMagician && !props.madMagicianChoice ? 'Must wait for mad magician' : undefined;

  const grimReaper = chs.find(c => c.role === 'Grim Reaper' && c.player);
  if (grimReaper) {
    if (!minion?.player) {
      return <div>Grim Reaper requires a minion.</div>;
    }
    prompts.push([grimReaper, props.executedToday ? 'Someone was executed today, so you cannot kill tonight.' : `
      Respond with the name of a player to kill (other than yourself).
      This player will still be able to use their ability this night.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.grimReaperChoice}
          onChange={(e) => props.setGrimReaperChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
          {/* NOTE: we just set it to the grimReaper because it's conveniant */}
          <option value={grimReaper.player} key={grimReaper.player}>Skip</option>
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(grimReaper.player) }</div>
      </div>
    )]);
  }

  const waitForGrimReaper = grimReaper && !props.grimReaperChoice ? 'Must wait for grim reaper' : undefined;

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
          value={props.vampireSpawnChoice}
          onChange={(e) => props.setVampireSpawnChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player to spawn</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.vampireChoice}
          onChange={(e) => props.setVampireChoice(selectPlayer(e))}
        >
          <option value={''} key={NULL}>Select player to kill</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(vampire.player) }</div>
      </div>
    )]);
  }

  const waitForVampire = vampire && !props.vampireChoice && !props.vampireSpawnChoice ? 'Must wait for vampire' : undefined;
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
          value={props.bedmakerChoices[0]}
          onChange={(e) => props.setBedmakerChoices([
            selectPlayer(e),
            props.bedmakerChoices[1],
          ])}
        >
          <option value={''} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.bedmakerChoices[1]}
          onChange={(e) => props.setBedmakerChoices([
            props.bedmakerChoices[0],
            selectPlayer(e),
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
          (!props.bedmakerChoices[0] || !props.bedmakerChoices[1]) ? undefined :
          (countAbility(props.bedmakerChoices[0]) + countAbility(props.bedmakerChoices[1])) + ' player(s) used their ability tonight'
        }
      </div>
    )]);
  }

  const getResultingDeaths = (): ReactElement => {
    const deadPlayers = [];
    if (props.executedToday) {
      deadPlayers.push(props.executedToday)
    }
    if (props.assassinChoice) {
      deadPlayers.push(props.assassinChoice);
    }
    let villainKill: PlayerUndef = undefined;
    if (props.madMagicianChoice && !heroStoppedVillain(madMagician?.player)) {
      villainKill = props.madMagicianChoice;
    }
    if (props.grimReaperChoice && !heroStoppedVillain(grimReaper?.player)) {
      villainKill = props.grimReaperChoice;
    }
    if (props.vampireChoice && !heroStoppedVillain(vampire?.player)) {
      villainKill = props.vampireChoice;
    }
    if (
      !isTempDrunk(bard?.player) &&
      charUndef(props.bardChoices[0])?.isGood && 
      charUndef(props.bardChoices[1])?.isGood && 
      props.bardChoices.find(c => c === villainKill)
    ) {
      villainKill = undefined;
    }
    if (!isTempDrunk(cleric?.player) && props.clericChoice === villainKill) {
      villainKill = undefined;
    }
    if (villainKill) {
      deadPlayers.push(villainKill);
    }
    return (
      <div>
        {deadPlayers.map((player, index) => {
          const character = charUndef(player);
          if (!character) {
            console.error('no character for player: ' + player);
          }
          return (
            <div key={index}>
              <CharacterRecord killOnly character={character as Character} update={(ch) => props.updateCharacter(ch)} />
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
            value={props.executedToday}
            onChange={(e) => props.setExecutedToday(selectPlayer(e))}
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
                  backgroundColor: ch.isDrunk(trs) ? '#dd99dd' : isTempDrunk(ch.player) ? '#ddbbdd' : undefined,
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
