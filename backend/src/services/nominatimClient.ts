import axios from 'axios';
const NOMINATIM_USER_AGENT = 'FreteExpress/1.0 (contact@freteexpress.com)';

const nominatimClient = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  headers: {
    'User-Agent': NOMINATIM_USER_AGENT,
  },
});

export type NominatimReverseResult = {
  display_name: string;
  address: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    state?: string;
    country?: string;
  };
};

export const getAddressFromCoords = async (lat: number, lon: number) => {
  try {
    const response = await nominatimClient.get<NominatimReverseResult>('/reverse', {
      params: {
        lat: lat,
        lon: lon,
        format: 'jsonv2', // JSON limpinho
        addressdetails: 1, // Detalhes do endereço
        zoom: 18, // Zoom na rua
      },
    });

    if (response.data && response.data.display_name) {
      return response.data;
    } else {
      throw new Error('Resposta do Nominatim malformada.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro na API Nominatim: ${error.response?.status}`, error.message);
    } else {
      console.error('Erro desconhecido no reverse-geocode:', error);
    }
    throw new Error('Falha ao obter endereço do serviço de mapas.');
  }
};
