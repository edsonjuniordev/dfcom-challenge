export type ListEventsResponse = {
  events: {
    id: string;
    name: string;
    price: number;
    totalCapacity: number;
    availableCapacity: number;
    createdAt: string;
    updatedAt: string;
  }[]
}