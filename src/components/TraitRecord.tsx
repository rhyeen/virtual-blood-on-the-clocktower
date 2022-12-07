import { FunctionComponent, ReactElement } from 'react';
import { Trait } from '../entities/characters';

interface Props {
  trait: Trait;
  update: (trait: Trait) => void;
}

export const TraitRecord: FunctionComponent<Props> = (props): ReactElement => {
  const tr = props.trait;

  return (
    <div style={{
      display: 'flex',
      columnGap: '10px',
    }}>
      <div style={{
        width: '20px',
        textAlign: 'center',
      }}>{tr.randomNumber}</div>
      <div style={{
        width: '150px',
      }}>{tr.role}</div>
      <div style={{
        width: '150px',
      }}><input value={tr.player ?? ''} onChange={(e) => {
        const c = tr.copy();
        c.player = e.target.value;
        props.update(c);
      }} /></div>
    </div>
  );
}
