import {Model ,DataTypes} from 'https://deno.land/x/denodb/mod.ts';
class Osoba extends Model {
  static table = 'osoba';

  static timestamps = false;

  static fields = {
    idosoba: {
      primaryKey: true,
      autoIncrement: true,
    },
    imie: DataTypes.STRING,
    nazwisko: DataTypes.STRING,
    pesel: DataTypes.STRING,
    telefon: DataTypes.STRING,
  };
  idosoba!:number
  imie!:string;
  nazwisko!:string;
  pesel!:string;
  telefon!:string;
  static Magazyn_sor(){
    return this.hasMany(Magazyn_sor)
  }
}
class Magazyn_sor extends Model {
  static table = 'magazyn_sor';

  static timestamps = false;

  static fields = {
    idmagazyn_sor: {
      primaryKey: true,
      autoIncrement: true,
    },
    powierzchnia: DataTypes.FLOAT,
    lokalizacja_gps_msor: DataTypes.STRING,
  };
  idmagazyn_sor!:number
  powierzchnia!:string;
  lokalizacja_gps_msor!:string;
  nazwa_magazyn_sor!:string;
  static Osoba(){
    return this.hasOne(Osoba)
  }
}




  export{Osoba,Magazyn_sor}