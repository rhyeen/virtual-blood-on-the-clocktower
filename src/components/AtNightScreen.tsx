import React, { ChangeEvent, FunctionComponent, ReactElement } from 'react';
import { Character, Trait } from '../entities/characters';
import { CharacterRecord } from './CharacterRecord';

type PlayerUndef = string | undefined;
type CharUndef = Character | undefined;

const NULL = '_NULL';

interface Props {
  characters: Character[];
  traits: Trait[];
  grandParentChoice: PlayerUndef;
  fortuneTellerRegisterChoice: PlayerUndef;
  townguardChoices: [PlayerUndef, PlayerUndef];
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
  const prompts: [Character | Trait, string | ReactElement, ReactElement | undefined][] = [];
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
  const villain = chs.find(c => c.type === 'villain' && c.player);

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

  const evilTwin = chs.find(c => c.role === 'Evil Twin' && c.player);
  if (evilTwin && !evilTwin.killed && minion?.killed) {
    prompts.push([evilTwin, (
      <span>
        <b>Storyteller, send to Villain: </b>{`
        ${evilTwin.player} is the Evil Twin and 
        is taking on the role of your ${minion.role} Minion since they are dead.
        `}
        <br /><br />
        <b>Storyteller, send to Evil Twin: </b>{`
        The Minion is dead!  The Villain, ${villain?.player}, 
        now knows that you are the Evil Twin
        and you will now have the same powers as the ${minion.role} Minion.
        `}
      </span>
    ), undefined]);
  }

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
          value={props.poisonerChoice ?? NULL}
          onChange={(e) => props.setPoisonerChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
      </div>
    )]);
  }

  const waitForPoisoner = poisoner && !poisoner.killed && !props.poisonerChoice ? 'Storyteller: Must wait for poisoner' : undefined;

  const spy = chs.find(c => c.role === 'Spy' && c.player);
  if (spy && !spy.killed) {
    const getTraitsText = () => {
      const traits = trs.filter(t => t.player === props.spyChoice);
      if (!traits.length) {
        return '';
      }
      return ' and has the trait(s): ' + traits.map(t => t.role).join(', ');
    };
    prompts.push([spy, `
      Respond with the name of a player (other than yourself).
      You will learn their role.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.spyChoice ?? NULL}
          onChange={(e) => props.setSpyChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {props.spyChoice && 
          <div>{`${props.spyChoice} is the ${charUndef(props.spyChoice)?.role}${getTraitsText()}`}</div>
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
          value={props.assassinChoice ?? NULL}
          onChange={(e) => props.setAssassinChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
          {/* NOTE: we just set it to the assassin because it's conveniant */}
          <option value={assassin.player} key={assassin.player}>Storyteller: Skip</option>
        </select>
      </div>
    )]);
  }

  const waitForAssassin = assassin && !assassin.killed && !props.assassinChoice ? 'Storyteller: Must wait for assassin' : undefined;

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
          value={props.bardChoices[0] ?? NULL}
          onChange={(e) => props.setBardChoices([
            selectPlayer(e),
            props.bardChoices[1],
          ])}
        >
          <option value={NULL} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.bardChoices[1] ?? NULL}
          onChange={(e) => props.setBardChoices([
            props.bardChoices[0],
            selectPlayer(e),
          ])}
        >
          <option value={NULL} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {!props.bardChoices[0] || !props.bardChoices[1] ?
          <div>Storyteller: Wait for bard to choose</div>
        :
          <select
            value={props.drunkFromBardChoice ?? NULL}
            onChange={(e) => props.setDrunkFromBardChoice(selectPlayer(e))}
          >
            <option value={NULL} key={NULL}>Storyteller: Drunk Player</option>
            {props.bardChoices.filter(p => charUndef(p)?.isGood).map(p => <option value={p} key={p}>{`${p} (${charUndef(p)?.role})`}</option>)}
            {/* NOTE: we just set it to the bard because it's conveniant */}
            <option value={bard.player} key={bard.player}>Storyteller: No drunk</option>
          </select>
        }
      </div>
    )]);
  }

  const waitForBard = (
    bard && 
    !bard.killed &&
    (!props.bardChoices[0] || !props.bardChoices[1] || !props.drunkFromBardChoice) ?
    'Storyteller: Must wait for bard' : undefined
  );

  const waitForDrunks = waitForBard || waitForPoisoner;

  const gravekeeper = chs.find(c => c.role === 'Gravekeeper' && c.player);
  if (gravekeeper && props.executedToday && !gravekeeper.killed) {
    prompts.push([gravekeeper, waitForDrunks ? waitForDrunks : `
      ${props.executedToday}, who was executed today, was the ${charUndef(props.executedToday)?.role}.
    `, undefined]);
  }

  const fortuneTeller = chs.find(c => c.role === 'Fortune Teller' && c.player);
  if (fortuneTeller && !fortuneTeller.killed) {
    const registersAsVillain = (player: string): boolean => {
      return player === villain?.player || player === props.fortuneTellerRegisterChoice;
    };
    prompts.push([fortuneTeller, `
      Respond with the name of 2 players (other than yourself) that you want to 
      see if they register as the Villain or not.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.fortuneTellerChoices[0] ?? NULL}
          onChange={(e) => props.setFortuneTellerChoices([
            selectPlayer(e),
            props.fortuneTellerChoices[1],
          ])}
        >
          <option value={NULL} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.fortuneTellerChoices[1] ?? NULL}
          onChange={(e) => props.setFortuneTellerChoices([
            props.fortuneTellerChoices[0],
            selectPlayer(e),
          ])}
        >
          <option value={NULL} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ 
          waitForDrunks ? waitForDrunks :
          !props.fortuneTellerChoices[0] || !props.fortuneTellerChoices[1] ? undefined :
          registersAsVillain(props.fortuneTellerChoices[0]) || registersAsVillain(props.fortuneTellerChoices[1]) ? 'At least one of these players register as a Villain' : 
          'Neither of these players register as a Villain'
        }</div>
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
          value={props.heroChoice ?? NULL}
          onChange={(e) => props.setHeroChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForDrunks ? waitForDrunks : '' }</div>
      </div>
    )]);
  }

  const waitForHero = hero && !hero.killed && !props.heroChoice ? 'Storyteller: Must wait for hero' : undefined;

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
          value={props.clericChoice ?? NULL}
          onChange={(e) => props.setClericChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForDrunks ? waitForDrunks : '' }</div>
      </div>
    )]);
  }

  const waitForCleric = cleric && !cleric.killed && !props.clericChoice ? 'Storyteller: Must wait for cleric' : undefined;
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
          value={props.madMagicianChoice ?? NULL}
          onChange={(e) => props.setMadMagicianChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(madMagician.player) }</div>
      </div>
    )]);
  }

  const waitForMadMagician = madMagician && !props.madMagicianChoice ? 'Storyteller: Must wait for mad magician' : undefined;

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
          value={props.grimReaperChoice ?? NULL}
          onChange={(e) => props.setGrimReaperChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
          {/* NOTE: we just set it to the grimReaper because it's conveniant */}
          <option value={grimReaper.player} key={grimReaper.player}>Storyteller: Skip</option>
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(grimReaper.player) }</div>
      </div>
    )]);
  }

  const waitForGrimReaper = grimReaper && !props.grimReaperChoice ? 'Storyteller: Must wait for grim reaper' : undefined;

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
          value={props.vampireSpawnChoice ?? NULL}
          onChange={(e) => props.setVampireSpawnChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player to spawn</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.vampireChoice ?? NULL}
          onChange={(e) => props.setVampireChoice(selectPlayer(e))}
        >
          <option value={NULL} key={NULL}>Select player to kill</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <div>{ waitForHero ? waitForHero : heroStoppedVillain(vampire.player) }</div>
      </div>
    )]);
  }

  const waitForVampire = vampire && !props.vampireChoice && !props.vampireSpawnChoice ? 'Storyteller: Must wait for vampire' : undefined;
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
          value={props.bedmakerChoices[0] ?? NULL}
          onChange={(e) => props.setBedmakerChoices([
            selectPlayer(e),
            props.bedmakerChoices[1],
          ])}
        >
          <option value={NULL} key={NULL}>Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.bedmakerChoices[1] ?? NULL}
          onChange={(e) => props.setBedmakerChoices([
            props.bedmakerChoices[0],
            selectPlayer(e),
          ])}
        >
          <option value={NULL} key={NULL}>Select Player</option>
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
    const deadPlayers: [player: string, note: string][] = [];
    if (props.executedToday) {
      deadPlayers.push([props.executedToday, 'Executed Today'])
    }
    if (props.assassinChoice && assassin?.player !== props.assassinChoice) {
      deadPlayers.push([props.assassinChoice, 'Assassinated']);
    }
    let villainKill: [player: string, note: string] | undefined = undefined;
    if (props.madMagicianChoice && !heroStoppedVillain(madMagician?.player)) {
      villainKill = [props.madMagicianChoice, 'Killed by Villain'];
    }
    if (
      props.grimReaperChoice && 
      !heroStoppedVillain(grimReaper?.player) && 
      props.grimReaperChoice !== grimReaper?.player
    ) {
      villainKill = [props.grimReaperChoice, 'Killed by Villain'];
    }
    if (
      props.vampireChoice &&
      !heroStoppedVillain(vampire?.player) &&
      props.vampireChoice !== vampire?.player
    ) {
      villainKill = [props.vampireChoice, 'Killed by Villain'];
    }
    if (
      villainKill &&
      !isTempDrunk(bard?.player) &&
      charUndef(props.bardChoices[0])?.isGood && 
      charUndef(props.bardChoices[1])?.isGood && 
      props.bardChoices.find(p => villainKill && p === villainKill[0])
    ) {
      villainKill[1] = 'NO KILL!  Villain stopped by Bard';
    }
    if (
      villainKill &&
      !isTempDrunk(cleric?.player) && 
      props.clericChoice === villainKill[0]
    ) {
      villainKill[1] = 'NO KILL!  Villain stopped by Cleric';
    }
    const townguard = chs.find(c => c.role === 'Townguard');
    if (
      villainKill &&
      !isTempDrunk(townguard?.player) &&
      charUndef(props.townguardChoices[0])?.isGood &&
      charUndef(props.townguardChoices[1])?.isGood &&
      props.townguardChoices.find(p => villainKill && p === villainKill[0])
    ) {
      villainKill[1] = 'NO KILL!  Villain stopped by Townguard';
    }
    if (villainKill) {
      deadPlayers.push(villainKill);
      if (villainKill[0] === props.grandParentChoice && !villainKill[1].startsWith('NO KILL!')) {
        const grandparentPlayer = chs.find(c => c.role === 'Grandparent')?.player;
        if (grandparentPlayer) {
          deadPlayers.push([grandparentPlayer, 'Villain killed grandchild']);
        } else {
          console.error('grandchild killed but could not find grandparent');
        }
      }
    }
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '4px',
      }}>
        {deadPlayers.map((playerNote, index) => {
          const ch = charUndef(playerNote[0]);
          if (!ch) {
            console.error('no character for player: ' + playerNote[0]);
          }
          return (
            <div key={index}>
              <CharacterRecord note={playerNote[1]} killOnly character={ch as Character} update={(ch) => props.updateCharacter(ch)} />
              {playerNote[0] === chs.find(c => c.role === 'Ravenkeeper')?.player &&
                <div style={{
                  backgroundColor: ch?.isDrunk(trs) ? '#dd99dd' : isTempDrunk(ch?.player) ? '#ddbbdd' : undefined,
                  padding: '5px',
                }}>You were killed tonight!  As the Ravenkeeper, you need to name a player to learn their role.</div>
              }
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
            value={props.executedToday ?? NULL}
            onChange={(e) => props.setExecutedToday(selectPlayer(e))}
          >
            <option value={NULL} key={NULL}>Executed Today</option>
            {playerCharacters.map(c => <option value={c.player} key={c.player}>{`${c.player} (${c.role})`}</option>)}
          </select>
          <button onClick={reset}>Reset</button>
        </div>
        {trs.find(t => t.player === props.executedToday && t.role === 'Saint') &&
          <h3 style={{ color: '#ff6666' }}>Game over!  The Saint was executed!</h3>
        }
        {villain?.player === props.executedToday && chs.find(c => c.role === 'Mastermind' && c.player && !c.killed) &&
          <h3 style={{ color: '#ff6666' }}>Game isn't over yet!  One last day for the Matermind to conquer!</h3>
        }
        {villain?.player === props.executedToday && !chs.find(c => c.role === 'Mastermind' && c.player && !c.killed) &&
          <h3 style={{ color: '#ff6666' }}>Game over!  The Villain was executed!</h3>
        }
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '25px',
        }}>
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
