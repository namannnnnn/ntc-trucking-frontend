export type Trip = {
    driver: Driver;
    origin: string;
    destination: string;
    date: Date;
  };
  
export type Driver = {
    name: string;
    email:string;
}