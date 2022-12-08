import { FunctionComponent, ReactElement } from 'react';
import { Character } from '../entities/characters';

interface Props {
  character: Character;
  update: (character: Character) => void;
  killOnly?: boolean;
  note?: string;
}

export const CharacterRecord: FunctionComponent<Props> = (props): ReactElement => {
  const ch = props.character;

  let backgroundColor = '#ff0000';
  switch (ch.type) {
    case 'townsfolk':
      backgroundColor = '#bbffbb';
      break;
    case 'minion':
      backgroundColor = '#ffbb77';
      break;
    case 'villain':
      backgroundColor = '#ff8888';
      break;
    case 'outsiderGood':
      backgroundColor = '#d6ffd6';
      break;
    case 'outsiderEvil':
      backgroundColor = '#ffdd99';
      break;
  }

  return (
    <div style={{
      display: 'flex',
      columnGap: '10px',
      backgroundColor,
      padding: '5px',
    }}>
      {!props.killOnly && <div style={{
        width: '20px',
        textAlign: 'center',
      }}>{ch.randomNumber}</div>}
      <div style={{
        width: '150px',
      }}>{ch.role}</div>
      <div style={{
        width: '150px',
      }}><input value={ch.player ?? ''} onChange={(e) => {
        const c = ch.copy();
        c.player = e.target.value;
        c.sharedWithVillainIfUnused = false;
        props.update(c);
      }} disabled={props.killOnly} /></div>
      <label><input type="checkbox" onChange={() => {
        const c = ch.copy();
        c.killed = !c.killed;
        props.update(c);
      }} checked={ch.killed} /> Killed</label>
      {!props.killOnly && <label><input type="checkbox" onChange={() => {
        const c = ch.copy();
        c.finalVoteUsed = !c.finalVoteUsed;
        props.update(c);
      }} checked={ch.finalVoteUsed} disabled={!ch.killed} /> Final Vote</label>}
      {!props.killOnly && <label>
        <input
          type="checkbox"
          onChange={() => {
            const c = ch.copy();
            c.sharedWithVillainIfUnused = !c.sharedWithVillainIfUnused;
            props.update(c);
          }}
          checked={ch.sharedWithVillainIfUnused}
          disabled={!!(ch.player || ch.isEvil)}
        /> Share Unused
      </label>}
      <div style={{ fontSize: '11px',  alignSelf: 'center' }}><i>{props.note}</i></div>
    </div>
  );
}
