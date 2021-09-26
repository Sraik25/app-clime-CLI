import { readFileSync, writeFileSync, existsSync } from 'fs';
import axios from 'axios';

export interface IFormatPlace {
  id: string;
  name: string;
  lng: number;
  lat: number;
}

export interface IFormatClim {
  desc: string;
  min: string;
  max: string;
  temp: string;
}

class Search {
  record: Array<string> = [];
  dbPath: string = './db/database.json';

  constructor() {
    // TODO: leer DB si existe
    this.readDB();
  }

  get historyCapitalize() {
    return this.record.map((place) => {
      let word = place.split(' ');

      word.map((wr) => wr[0].toUpperCase() + wr.substr(1));

      return word.join(' ');
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'es',
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPEN_WEATHER_KEY,
      units: 'metric',
      lang: 'es',
    };
  }

  async city(place = ''): Promise<IFormatPlace[]> {
    // Petición http

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?`,
        params: this.paramsMapbox,
      });

      const response = await instance.get('');

      return response.data.features.map((ft: any) => {
        return {
          id: ft.id,
          name: ft.place_name,
          lng: ft.center[0],
          lat: ft.center[1],
        };
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async climePlace(lat: number, lon: number): Promise<IFormatClim | undefined> {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          ...this.paramsOpenWeather,
          lat,
          lon,
        },
      });

      const response = await instance.get('');
      if (response) {
        const { weather, main } = response.data;

        return {
          desc: weather[0].description,
          min: main?.temp_min,
          max: main?.temp_max,
          temp: main?.temp,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        desc: '',
        min: '',
        max: '',
        temp: '',
      };
    }
  }

  addHistory(place = '') {
    if (this.record.includes(place.toLocaleLowerCase())) return;

    this.record = this.record.splice(0, 5);

    this.record.unshift(place.toLocaleLowerCase());

    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.record,
    };

    writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!existsSync(this.dbPath)) return;

    const info = readFileSync(this.dbPath, { encoding: 'utf-8' });

    const data = JSON.parse(info);

    this.record = data.history;
  }
}

export default Search;
