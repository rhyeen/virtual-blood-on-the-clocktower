import { ChangeEvent, FunctionComponent, ReactElement } from 'react';
import { Character, Trait } from '../entities/characters';
import { shuffleArray } from '../utils/shuffle';

type PlayerUndef = string | undefined;
type CharUndef = Character | undefined;

const NULL = '_NULL';

interface Props {
  characters: Character[];
  traits: Trait[];
  gossipmongerChoices: [PlayerUndef, PlayerUndef];
  setGossipmongerChoices: (players: [PlayerUndef, PlayerUndef]) => void;
  investigatorChoice: PlayerUndef;
  setInvestigatorChoice: (player: PlayerUndef) => void;
  medicineDoctorChoices: [PlayerUndef, PlayerUndef];
  setMedicineDoctorChoices: (players: [PlayerUndef, PlayerUndef]) => void;
  grandParentChoice: PlayerUndef;
  setGrandParentChoice: (player: PlayerUndef) => void;
  townguardChoices: [PlayerUndef, PlayerUndef];
  setTownguardChoices: (players: [PlayerUndef, PlayerUndef]) => void;
  fortuneTellerChoice: PlayerUndef;
  setFortuneTellerChoice: (player: PlayerUndef) => void;
}

export const StartGameScreen: FunctionComponent<Props> = (props): ReactElement => {
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
  const villain = chs.find(c => c.type === 'villain' && c.player);
  const unusedGood = chs.filter(c => !c.player && c.sharedWithVillainIfUnused);

  if (unusedGood.length !== 3) {
    return <div>Must share at least three Townsfolk with Villain</div>;
  }

  if (minion && villain) {
    prompts.push([minion, `
      You are a Minion.
      You are on the evil team.
      ${villain.player} is your Villain and they are the ${villain.role}.
      They know who you are and you should plan together secretly.
    `, undefined]);

    prompts.push([villain, `
      You are the Villain.
      You are on the evil team.
      ${minion.player} is your Minion and they are the ${minion.role}.
      They know who you are and you should plan together secretly.

      Here are some Townsfolk roles that no one else has:
      ${unusedGood.map(c => c.role).join(', ')}.
      I suggest you choose one and do your best to blend in as that role and provide a different one to your Minion for the same purpose.
      You will not be given that role's abilities so choose wisely as some will be easier to disprove than others.
    `, undefined]);
  } else if (villain) {
    prompts.push([villain, `
      You are the Villain.
      You are on the evil team and you have no teammates.

      Here are some Townsfolk roles that no one else has:
      ${unusedGood.map(c => c.role).join(', ')}
      I suggest you choose one and do your best to blend in as that role and provide a different one to your Minion for the same purpose.
      You will not be given that role's abilities so choose wisely as some will be easier to disprove than others.
    `, undefined]);
  }

  const gravekeeper = chs.find(c => c.role === 'Gravekeeper' && c.player);
  if (gravekeeper) {
    prompts.push([gravekeeper, `
      You are the Gravekeeper.
      Each night, I will tell you the role of the characters that were 
      executed (aka, voted by the group for death) the previous day.
    `, undefined]);
  }

  const gossipmonger = chs.find(c => c.role === 'Gossipmonger' && c.player);
  if (gossipmonger) {
    let response: string | undefined = undefined;
    if (props.gossipmongerChoices[0] && props.gossipmongerChoices[1]) {
      const choice0IsEvil = chs.find(c => c.player === props.gossipmongerChoices[0])?.registersAsEvil(trs);
      const choice1IsEvil = chs.find(c => c.player === props.gossipmongerChoices[1])?.registersAsEvil(trs);
      if (choice0IsEvil && choice1IsEvil) {
        response = 'Both are evil';
      } else if (!choice0IsEvil && !choice1IsEvil) {
        response = 'Neither are evil';
      } else {
        response = 'One is evil';
      }
    }
    prompts.push([gossipmonger, `
      You are the Gossipmonger.
      Respond with the name of 2 players (other than yourself);
      you will learn if neither, one, or both of them are evil.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.gossipmongerChoices[0]}
          onChange={(e) => props.setGossipmongerChoices([
            selectPlayer(e),
            props.gossipmongerChoices[1],
          ])}
        >
          <option value={''} key="_NULL">Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.gossipmongerChoices[1]}
          onChange={(e) => props.setGossipmongerChoices([
            props.gossipmongerChoices[0],
            selectPlayer(e),
          ])}
        >
          <option value={''} key="_NULL">Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        {response}
      </div>
    )]);
  }

  const investigator = chs.find(c => c.role === 'Investigator' && c.player);
  if (investigator) {
    if (!minion) {
      return <div>Cannot have an investigator without a minion.</div>;
    }
    const registersAsMinion = [
      minion,
      chs.find(c => c.player === props.investigatorChoice) ?? undefined,
    ];
    shuffleArray(registersAsMinion);
    prompts.push([investigator, props.investigatorChoice ? `
      You are the Investigator.
      You know that either ${registersAsMinion[0]} or ${registersAsMinion[1]} is the ${minion?.role} Minion.
    ` : 'Gamemaster: Select a player to appear to be the minion', (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.investigatorChoice}
          onChange={(e) => props.setInvestigatorChoice(selectPlayer(e))}
        >
          <option value={''} key="_NULL">Registers as Minion</option>
          {playerCharacters.map(c => <option value={c.player} key={c.player}>{`${c.player} (${c.role})`}</option>)}
        </select>
      </div>
    )]);
  }

  const bedmaker = chs.find(c => c.role === 'Bed Maker' && c.player);
  if (bedmaker) {
    prompts.push([bedmaker, `
      You are the Bedmaker.
      Each night, I'll ask you to choose 2 players.
      You learn how many (either "neither", "one", or "both")
      used their abilities that night.
    `, undefined]);
  }

  const medicineDoctor = chs.find(c => c.role === 'Medicine Doctor' && c.player);
  if (medicineDoctor) {
    const registersAsRole = [
      chs.find(c => c.player === props.medicineDoctorChoices[0]) ?? undefined,
      chs.find(c => c.player === props.medicineDoctorChoices[1]) ?? undefined,
    ];
    shuffleArray(registersAsRole);
    prompts.push([medicineDoctor, (props.medicineDoctorChoices[0] && props.medicineDoctorChoices[1]) ? `
      You are the Medicine Doctor.
      You know that either ${registersAsRole[0]} or ${registersAsRole[1]} is the ${charUndef(props.medicineDoctorChoices[0])?.role} Townsfolk.
    ` : 'Gamemaster: Select a Townsfolk and another player to appear as that Townsfolk', (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.medicineDoctorChoices[0]}
          onChange={(e) => props.setMedicineDoctorChoices([
            selectPlayer(e),
            props.medicineDoctorChoices[1],
          ])}
        >
          <option value={''} key="_NULL">Target Townsfolk</option>
          {playerCharacters.filter(c => c.isGood).map(c => <option value={c.player} key={c.player}>{`${c.player} (${c.role})`}</option>)}
        </select>
        <select
          value={props.medicineDoctorChoices[1]}
          onChange={(e) => props.setMedicineDoctorChoices([
            props.medicineDoctorChoices[0],
            selectPlayer(e),
          ])}
        >
          <option value={''} key="_NULL">Registers as Townsfolk</option>
          {playerCharacters.map(c => <option value={c.player} key={c.player}>{`${c.player} (${c.role})`}</option>)}
        </select>
      </div>
    )]);
  }

  const hero = chs.find(c => c.role === 'Hero' && c.player);
  if (hero) {
    prompts.push([hero, `
      You are the Hero.
      Each night, I'll ask you to choose a player.
      If they are the Villain, they learn that you are the Hero
      but they cannot kill anyone that night.
      This effect only applies once.
    `, undefined]);
  }

  const grandParent = chs.find(c => c.role === 'Grandparent' && c.player);
  if (grandParent) {
    prompts.push([grandParent, props.grandParentChoice ? `
      You are the Grandparent.
      Your grandchild is ${props.grandParentChoice} and is the ${charUndef(props.grandParentChoice)?.role} Townsfolk.
      If the Villain kills your grandchild, you die too.
    ` : 'Gamemaster: Select a player to be the grandchild', (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.grandParentChoice}
          onChange={(e) => props.setGrandParentChoice(selectPlayer(e))}
        >
          <option value={''} key="_NULL">Select Grandchild</option>
          {playerCharacters.filter(c => c.isGood).map(c => <option value={c.player} key={c.player}>{`${c.player} (${c.role})`}</option>)}
        </select>
      </div>
    )]);
  }

  const oracle = chs.find(c => c.role === 'Oracle' && c.player);
  if (oracle) {
    prompts.push([oracle, `
      You are the Oracle.
      Once per game, at any time, you may privately ask me any yes/no question.
      I will answer truthfully.
    `, undefined]);
  }

  const dreamer = chs.find(c => c.role === 'Dreamer' && c.player);
  if (dreamer) {
    prompts.push([dreamer, `
      You are the Dreamer.
      Each night, I will tell you how many dead players are evil.
    `, undefined]);
  }

  const townguard = chs.find(c => c.role === 'Townguard' && c.player);
  if (townguard) {
    prompts.push([townguard, `
      You are the Townguard.
      Respond with the name of 2 players (other than yourself).
      Only if both of them are good, they cannot die at night until you do.
      You do not know if they are good or evil.
    `, (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.townguardChoices[0]}
          onChange={(e) => props.setTownguardChoices([
            selectPlayer(e),
            props.townguardChoices[1],
          ])}
        >
          <option value={''} key="_NULL">Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
        <select
          value={props.townguardChoices[1]}
          onChange={(e) => props.setTownguardChoices([
            props.townguardChoices[0],
            selectPlayer(e),
          ])}
        >
          <option value={''} key="_NULL">Select Player</option>
          {players.map(p => <option value={p} key={p}>{p}</option>)}
        </select>
      </div>
    )]);
  }

  const fortuneTeller = chs.find(c => c.role === 'Fortune Teller' && c.player);
  if (fortuneTeller) {
    prompts.push([fortuneTeller, props.fortuneTellerChoice ? `
    You are the Fortune Teller.
    Each night, I'll ask you to choose 2 players and you learn if either is the Villain.
    Note that 1 other player registers as a Villain that is not actually the Villain.
    ` : 'Gamemaster: Select a player to register as a Villain', (
      <div style={{
        display: 'flex',
        columnGap: '5px',
      }}>
        <select
          value={props.fortuneTellerChoice}
          onChange={(e) => props.setFortuneTellerChoice(selectPlayer(e))}
        >
          <option value={''} key="_NULL">Select Grandchild</option>
          {playerCharacters.filter(c => c.type !== 'villain').map(c => <option value={c.player} key={c.player}>{`${c.player} (${c.role})`}</option>)}
        </select>
      </div>
    )]);
  }

  const ravenkeeper = chs.find(c => c.role === 'Ravenkeeper' && c.player);
  if (ravenkeeper) {
    prompts.push([ravenkeeper, `
      You are the Ravenkeeper.
      If you die at night, I will let you know and 
      you will choose a player to learn of their role.
    `, undefined]);
  }

  const saint = trs.find(t => t.role === 'Saint' && t.player);
  if (saint) {
    prompts.push([saint, `
      You have the Saint trait.
      If you are executed (aka, voted by the group for death),
      the good team loses.
    `, undefined]);
  }

  const recluse = trs.find(t => t.role === 'Recluse' && t.player);
  if (recluse) {
    prompts.push([recluse, `
      You have the Recluse trait.
      You may register as evil, but not the Villain.
    `, undefined]);
  }

  const lucky = trs.find(t => t.role === 'Lucky' && t.player);
  if (lucky) {
    prompts.push([lucky, `
      You have the Lucky trait.
      The first time you die at night, you don't.
    `, undefined]);
  }

  const poisoner = chs.find(c => c.role === 'Poisoner' && c.player);
  if (poisoner) {
    prompts.push([poisoner, `
      You are the Poisoner.
      Each night, I'll ask you to choose a player.
      Their ability malfunctions (aka doesn't do what they think it does, such as giving false answers)
      until the start of the next night.
    `, undefined]);
  }

  const spy = chs.find(c => c.role === 'Spy' && c.player);
  if (spy) {
    prompts.push([spy, `
      You are the Spy.
      Each night, I'll ask you to choose a player.
      I will tell you their role and traits (if they have any).
    `, undefined]);
  }

  const assassin = chs.find(c => c.role === 'Assassin' && c.player);
  if (assassin) {
    prompts.push([assassin, `
      You are the Assassin.
      At the very beginning of any one night you choose, you may choose a player.
      That player dies tonight, even if they normally wouldn't.
      You can only use this ability once.
    `, undefined]);
  }

  const madMagician = chs.find(c => c.role === 'Mad Magician' && c.player);
  if (madMagician) {
    if (!minion) {
      return <div>Mad Magician requires a minion.</div>
    }
    prompts.push([madMagician, `
      You are the Mad Magician.
      Each night, I'll ask you to choose a player.
      That player dies.
      You may choose yourself; if you do, your Minion, ${minion.player}, will become the Mad Magician,
      replacing their current role.
    `, undefined]);
  }

  const grimReaper = chs.find(c => c.role === 'Grim Reaper' && c.player);
  if (grimReaper) {
    if (!minion) {
      return <div>Grim Reaper requires a minion.</div>
    }
    prompts.push([grimReaper, `
      You are the Grim Reaper.
      Each night, if no one died that day, I'll ask you to choose a player.
      That player dies.
      You may choose yourself.
      The first time you die, you are secretly not dead, 
      meaning you still act like you're dead during the day, 
      but you can keep killing players at night.
    `, undefined]);
  }

  const vampire = chs.find(c => c.role === 'Vampire' && c.player);
  if (vampire) {
    if (minion) {
      return <div>Vampire cannot start with a minion.</div>
    }
    prompts.push([vampire, `
      You are the Vampire.  You do not start with any Minions, but you can gain them.  When you do, and you'll know you do base on your ability, I advise you to secretly plan with your new Minion(s).
      Right now, choose a player.  If that player is executed (aka, voted by the group for death) the next day, they become a Vampire Spawn at the start of the next night.
      At the beginning of each night, I will ask you to repeat this process and I will ask you to choose a different player to kill."
    `, undefined]);
  }

  const cleric = chs.find(c => c.role === 'Cleric' && c.player);
  if (cleric) {
    prompts.push([cleric, `
      You are the Cleric.
      Each night, I will ask you to choose a player other than yourself.
      They cannot be killed by the Villain that night.
    `, undefined]);
  }

  const bard = chs.find(c => c.role === 'Bard' && c.player);
  if (bard) {
    prompts.push([bard, `
      You are the Bard.
      Each night, I will ask you to choose 2 players other than yourself.
      They cannot die that night if they are both good, but I will secretly select one of the two
      to be Drunk until dawn if they are a Townsfolk.
    `, undefined]);
  }

  const slayer = chs.find(c => c.role === 'Slayer' && c.player);
  if (slayer) {
    prompts.push([slayer, `
      You are the Slayer.
      Once per game, during the day, publicly choose a player.
      If they are the Villain, they die.
      If they are not the Villain, I won't say anything.
    `, undefined]);
  }

  const mastermind = chs.find(c => c.role === 'Mastermind' && c.player);
  if (mastermind) {
    prompts.push([mastermind, `
      You are the Mastermind, and you are on the evil team.
      If the Villain if executed (aka, voted by the group for death), 
      I will continue the game as if nothing happened.
      The Villain will not be able to use their powers the next night though.
      If a player is choose to execute someone the next day, the evil team wins.
    `, undefined]);
  }

  const evilTwin = chs.find(c => c.role === 'Evil Twin' && c.player);
  if (evilTwin) {
    prompts.push([evilTwin, `
      You are the Evil Twin, and you are on the evil team.
      When the first Minion is killed, the next night, you become that Minion
      with the same role.
    `, undefined]);
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '25px',
      }}>
        { prompts.map((prompt, index) => {
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
                <div>{prompt[0].player}</div>
                <div>|</div>
                <div>{prompt[0].role}:</div>
              </div>
              <div style={{
                backgroundColor: prompt[0].isDrunk(trs) ? '#dd99dd' : undefined,
                padding: '5px',
              }}>{prompt[1]}</div>
              {prompt[2]}
            </div>
          );
        }) }
      </div>
    </div>
  );
}
