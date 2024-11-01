import Grid from './Grid.js';

export default function Content(props) {
  return (
    <div>
      <Grid data={props.data} />
    </div>
  );
}
