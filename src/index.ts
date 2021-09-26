import dotenv from 'dotenv';
import {
  inquirerMenu,
  listOfPlaces,
  pause,
  readInput,
} from './helpers/inquirer';
import Search from './models/search';

dotenv.config();

const main = async () => {
  const search = new Search();

  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // mostrar mensaje
        const termine = await readInput('Ciudad: ');

        // buscar lugares
        const places = await search.city(termine);
        const id = await listOfPlaces(places);

        if (id === '0') continue;

        const placeSelected = places.find((place) => place.id === id);

        search.addHistory(placeSelected?.name);

        let climePlace;
        if (placeSelected) {
          climePlace = await search.climePlace(
            placeSelected.lat,
            placeSelected.lng
          );
        }

        console.log(places);
        // Seleccionar el lugar

        // Clima

        // Mostrar Resultados

        console.log('\nInformación de la ciudad\n'.green);
        console.log('Ciudad: ', placeSelected?.name.green);
        console.log('Latitud: ', placeSelected?.lat);
        console.log('Longitud: ', placeSelected?.lng);
        console.log('Temperatura: ', climePlace?.desc);
        console.log('Mínima: ', climePlace?.min);
        console.log('Máxima: ', climePlace?.max);
        console.log('Como esta el clima: ', climePlace?.temp.green);
        console.log('\n');
        break;

      case 2:
        search.record.forEach((place, i) => {
          const idx = `${i + 1}.`.green;

          console.log(`${idx} ${place}`);
        });
        break;
    }

    opt !== 0 && (await pause());
  } while (opt !== 0);
};

main();
