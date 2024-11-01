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
    obj.state = passatempo.estado;
    obj.published = passatempo.dataInicio;
    obj.finished = passatempo.dataFim;
    data.push(obj);
  });

  const sapoMagData = await fetchSapoMag();
  sapoMagData.forEach((passatempo) => {
    var obj = {};
    obj.title = passatempo.text;
    obj.type = "Movie";
    obj.url = passatempo.url;
    obj.img = passatempo.imageUrl;
    obj.state = "A decorrer";
    obj.published = passatempo.date;
    obj.finished = "?";
    data.push(obj);
  });


  const rtpData = await fetchRTP();
  rtpData.forEach((passatempo) => {
    var obj = {};
    obj.title = passatempo.title;
    obj.type = "Movie";
    obj.url = passatempo.url;
    obj.img = passatempo.imageUrl;
    obj.state = "A decorrer";
    obj.published = passatempo.date;
    obj.finished = "?";
    data.push(obj);
  });
  console.log(fetchRTP());

  return data;
}
