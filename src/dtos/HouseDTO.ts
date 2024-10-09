export type HouseDTO = {
  id: number;
  property_id: number;
  photo: string | null;
  nickname: string;
  room_count: number;
  bathrooms: number;
  furnished: boolean | null;
  status: 'alugada' | 'vaga' | 'reforma';
};
