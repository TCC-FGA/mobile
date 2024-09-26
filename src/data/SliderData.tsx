import { ImageSourcePropType } from 'react-native';

export type ImageSliderType = {
  title: string;
  image: string | ImageSourcePropType;
  description: string;
};

export const ImageSlider = [
  {
    title: 'Organize seus imóveis com facilidade',
    image: 'https://storage.googleapis.com/e-aluguel/aluguelapp/Slide_1.png',
    description:
      'Com nosso app, você gerencia todas as suas propriedades em um só lugar. Acompanhe o status de aluguéis, vagas disponíveis e muito mais.',
  },
  {
    title: 'Controle total dos seus aluguéis',
    image: 'https://storage.googleapis.com/e-aluguel/aluguelapp/Slide_2.png',
    description:
      'Adicione, edite e mantenha o controle das casas alugadas e disponíveis. Tudo de forma rápida e segura, direto do seu celular.',
  },
  {
    title: 'Eficiência no gerenciamento',
    image: 'https://storage.googleapis.com/e-aluguel/aluguelapp/Slide_3.png',
    description:
      'Nossa ferramenta foi criada para facilitar sua rotina, permitindo que você foque no crescimento do seu negócio.',
  },
];
