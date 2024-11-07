import puppeteer from 'puppeteer';

export async function fetchTvCine() {
  const response = await fetch(
    'https://api-tvcine.com/content/passatempos?timezone=Europe/Lisbon'
  );
  const data = await response.json();

  return data;
}

export async function fetchRTP() {
  const browser = await puppeteer.launch({
    headless: false, // a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    defaultViewport: null, // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  });

  const page = await browser.newPage();
  
  await page.goto('https://cinemax.rtp.pt/passatempos/', {
    waitUntil: 'domcontentloaded',
  });


  const movies = await page.evaluate(() => {

    const contestListElement = document.querySelector('.listagem').children[0].children;
    
    const contestList = Array.from(contestListElement).map((contest) => {      
      // Get url
      const imageElement = contest.querySelector('.imagem').querySelector("a");
      const url = imageElement.getAttribute("href");

      // Get title
      const title = imageElement.getAttribute("title");

      // Get image
      const imageInnerElement = imageElement.querySelector(".img-fluid");
      const imageUrl = imageInnerElement.getAttribute("src");

      // Get date 
      const date = contest.querySelector(".text-orange").innerText;

      return { title, url, imageUrl, date };
    });
    return contestList;

  })
  .catch((err) => console.error(err))
  .finally(() => browser?.close());

  console.log(movies);
  await browser.close();

  return movies;
}


export async function fetchSapoMag() {
  const browser = await puppeteer.launch({
    headless: false, // a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    defaultViewport: null, // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  });

  const page = await browser.newPage();
  
  await page.goto('https://tv.sapo.pt/passatempos', {
    waitUntil: 'domcontentloaded',
  });

  const movies = await page.evaluate(() => {
    const contestListElement = document.querySelectorAll('.article');

    const contestList = Array.from(contestListElement).map((contest) => {
      // Get title
      const titleSpan = contest.querySelector('.title');
      const text = titleSpan.innerText;

      // Get url
      const urlElement = titleSpan.querySelector('a');
      const url = "https://tv.sapo.pt" + urlElement.getAttribute("href");

      // Get image
      const pictureElement = contest.querySelector("picture");
      const imageUrl = "https:" + pictureElement.getAttribute("data-original-src");

      // Get date 
      const dateSpan = contest.querySelector('.date');
      const daySpan = dateSpan.querySelector('.day').innerText;
      const monthSpan = dateSpan.querySelector('.month').innerText;
      const yearSpan = dateSpan.querySelector('.year').innerText;
      const date = daySpan + "-" + monthSpan + "-" + yearSpan;

      return { text, date, url, imageUrl };
    });
    return contestList;

  })
  .catch((err) => console.error(err))
  .finally(() => browser?.close());

  console.log(movies);
  await browser.close();

  return movies;
};


export async function fetchData() {
  var data = [];

  const tvCineData = await fetchTvCine();
  tvCineData.forEach((passatempo) => {
    var obj = {};
    obj.title = passatempo.titulo;
    obj.type = 'Movie';
    obj.url = 'https://www.tvcine.pt/passatempos/' + passatempo.id;
    obj.img = passatempo.imagemCapa.url;
    obj.state = (passatempo.estado == "activo") ? true : false;
    obj.published = normalizeDate(passatempo.dataInicio, "tvcine");
    obj.finished = normalizeDate(passatempo.dataFim, "tvcine");
    data.push(obj);
  });
  console.log(tvCineData);


  const sapoMagData = await fetchSapoMag();
  sapoMagData.forEach((passatempo) => {
    var obj = {};
    obj.title = passatempo.text;
    obj.type = "Movie";
    obj.url = passatempo.url;
    obj.img = passatempo.imageUrl;
    obj.state = true;
    obj.published = normalizeDate(passatempo.date, "sapomag");
    obj.finished = "?";
    data.push(obj);
  });
  console.log(sapoMagData);

  const rtpData = await fetchRTP();
  rtpData.forEach((passatempo) => {
    var obj = {};
    obj.title = passatempo.title;
    obj.type = "Movie";
    obj.url = passatempo.url;
    obj.img = passatempo.imageUrl;
    obj.state = getState(passatempo.title, "rtp");
    obj.published = normalizeDate(passatempo.date, "rtp");
    obj.finished = "?";
    data.push(obj);
  });
  console.log(rtpData);

  data.sort(function(a,b){
    return b.published - a.published;
  });

  data.map((obj) => {
    obj.published = obj.published.toISOString();
    obj.finished = (obj.finished == "?") ? "-" : obj.finished.toISOString();
  });

  return data;
}

function getState(title, source) {
  switch(source) {
    case "rtp":
      return title.substring(0,11) != "[Terminado]";
      break;
    default:
      return false;
  }
}

function getMonth(month) {
    switch(month.toLowerCase().substring(0,3)) {
      case 'jan':
        return "0";
      case "fev":
        return "1";
      case "mar":
        return "2";
      case "abr":
        return "3";
      case "mai":
        return "4";
      case "jun":
        return "5";
      case "jul":
        return "6";
      case "ago":
        return "7"
      case "set":
        return "8";
      case "out":
        return "9";
      case "nov":
        return "10";
      case "dez":
        return "11";
    }
}

function normalizeDate(date, source) {
  var dateNormalized;
  switch (source) {
    case 'tvcine':
      dateNormalized = new Date(date);
      break;      
    case 'sapomag':
      const splitted1 = date.split("-");
      // Sets localtime as UTC
      dateNormalized = new Date(Date.UTC(splitted1[2], getMonth(splitted1[1]), splitted1[0]));
      break;
    case 'rtp':
      const splitted2 = date.split(" ");
      const time = splitted2[3].split(":");
      dateNormalized = new Date(Date.UTC(splitted2[2], getMonth(splitted2[1]), splitted2[0], time[0], time[1], "0"));
      break;
    default:
      dateNormalized = new Date(Date.UTC("1970", "1", "1"));
  }
  if(dateNormalized == undefined) {
    dateNormalized = new Date(Date.UTC("1970", "1", "1"));
  }
  return dateNormalized;
}
