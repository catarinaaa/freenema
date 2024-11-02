import React from 'react';

export default function Card({ key, data }) {
  return (
    <li key={key}>
    <div key={key} className="border rounded-md p-4 flex-col flex gap-4">
      <img src={data.img} />
      <div className="flex gap-4 text-teal-900 uppercase font-bold">
        <div className="text-xs bg-teal-200  p-1 w-[55px] text-center">
          {data.type}
        </div>
        <p> { new Date(data.published).toLocaleDateString() } </p>
      </div>

      <h2 className="text-l font-bold">{data.title}</h2>
      <p className="text-xs">TERMINA A { (data.finished == "-") ? "-" : new Date(data.finished).toLocaleDateString() }</p>
      <button className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        { (data.state == true) ? "Participar" : "Ver vencedores" }
      </button>
    </div>
    </li>
  );
}
