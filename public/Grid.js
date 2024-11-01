import { useState } from 'react';
import Card from './Card';

export default function Grid({ data }) {
  const [passatempos, setPassatempo] = useState([
    {
      id: 1,
      title: 'Amesterdao',
      type: 'Movie',
      published: '2022-11-05',
      finished: '2022-11-07',
      img: 'url',
      url: 'https://google.com',
    },
    {
      id: 2,
      title: 'Wakanda',
      type: 'Movie',
      published: '2022-11-05',
      finished: '2022-11-07',
      img: 'url',
      url: 'https://google.com',
    },
  ]);
  return (
    <div className="grid gap-4 mx-40 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {data.map((passatempo) => (
        <ul><Card key={passatempo.id} data={passatempo} /></ul>
      ))}
    </div>
  );
}
