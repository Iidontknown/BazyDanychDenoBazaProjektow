import {Model ,DataTypes} from 'https://deno.land/x/denodb/mod.ts';
class Rodzaj extends Model {
    static table = 'rodzaj';
  
    static timestamps = true;
  
    static fields = {
        id_rodzaj: {
        primaryKey: true,
        autoIncrement: true,
      },
      nazwa_rodzaj: DataTypes.STRING,
      
    };
    static projekt(){
      return this.hasMany(Projekt)
    }
  }
  class Status extends Model {
    static table = 'status';
  
    static timestamps = true;
  
    static fields = {
        id_status: {
        primaryKey: true,
        autoIncrement: true,
      },
      nazwa_status: DataTypes.STRING,
      
    };
    static projekt(){
      return this.hasMany(Projekt)
    }
  }
  class Projekt extends Model {
    static table = 'projekt';
  
    static timestamps = true;
  
    static fields = {
      idprojekt: {
        primaryKey: true,
        autoIncrement: true,
      },
      nr_projekt: DataTypes.STRING,
      temat_projekt: DataTypes.STRING,
      data_rozpoczecia: DataTypes.DATE,
      data_zakonczenia: DataTypes.DATE,
      kwota: DataTypes.DECIMAL,
      uwagi: DataTypes.STRING,
      
    };
    static rodzaj(){
      return this.hasOne(Rodzaj)
    }
    static status(){
      return this.hasOne(Status)
    }
  }
  export{Rodzaj,Status,Projekt}