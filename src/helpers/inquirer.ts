import { prompt, QuestionCollection } from 'inquirer';
import 'colors';
import { IFormatPlace } from '../models/search';

const menuOptions: QuestionCollection = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué desea hacer?',
    choices: [
      {
        value: 1,
        name: `${'1.'.green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${'2.'.green} Historial`,
      },
      {
        value: 3,
        name: `${'0.'.green} Salir`,
      },
    ],
  },
];

const inquirerMenu = async (): Promise<number> => {
  console.log('==========================='.green);
  console.log(' Seleccione una opción'.green);
  console.log('==========================='.green);

  const { option } = await prompt(menuOptions);

  return option;
};

const pause = async () => {
  const question: QuestionCollection = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'enter'.green} para continuar`,
    },
  ];

  await prompt(question);
};

const readInput = async (message: string) => {
  const question: QuestionCollection = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value: any[]) {
        if (value.length === 0) {
          return 'Por favor ingrese un valor';
        }

        return true;
      },
    },
  ];

  const { desc } = await prompt(question);

  return desc;
};

const listOfPlaces = async (places: Array<IFormatPlace>): Promise<string> => {
  const choices = places.map((place, index) => {
    const idx = `${index + 1}.`.green;

    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: '0',
    name: `${'0.'.green} Cancelar`,
  });

  const questions: QuestionCollection = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione lugar:',
      choices,
    },
  ];

  const { id } = await prompt(questions);
  return id;
};

export { inquirerMenu, listOfPlaces, pause, readInput };
