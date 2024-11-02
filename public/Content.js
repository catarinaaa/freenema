import Grid from './Grid.js';

export default function Content(props) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center m-20 gap-8 font-poppins">
        <h1 className="text-7xl">Freenema</h1>
        <h2 className="text-2xl text-slate-500">Encontra os últimos passatempos de cinema!</h2>
      </div>
      <Grid data={props.data} />
    </div>
  );
}
