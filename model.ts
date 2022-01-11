import {Model ,DataTypes} from 'https://deno.land/x/denodb/mod.ts';
class Rodzaj extends Model {
  static table = 'rodzaj';

  static timestamps = false;

  static fields = {
      id_rodzaj: {
      primaryKey: true,
      autoIncrement: true,
    },
    nazwa_rodzaj: DataTypes.STRING,
  };
  id_rodzaj!:number
  nazwa_rodzaj!:string;
  static projekt(){
    return this.hasMany(Projekt)
  }
}
  class Status extends Model {
    static table = 'status';
  
    static timestamps = false;
  
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
  
    static timestamps = false;
  
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
  class Stawszproj extends Model {
    static table = 'stawszproj';
  
    static timestamps = false;
  
    static fields = {
      count:DataTypes.decimal(2),
      min:DataTypes.decimal(2),
      max:DataTypes.decimal(2),
      avg:DataTypes.decimal(2),
      sum:DataTypes.decimal(2),
      nazwa_rodzaj: DataTypes.STRING,
    };
   
  }
  class Statstykiprojektrodzaj extends Model {
    static table = 'statstykiprojektrodzaj';
  
    static timestamps = false;
  
    static fields = {
      nazwa_rodzaj: DataTypes.STRING,
      count:DataTypes.BIG_INTEGER,
    };
   
  }
  class Statstykiprojektstatus extends Model {
    static table = 'statstykiprojektstatus';
  
    static timestamps = false;
  
    static fields = {
      nazwa_status: DataTypes.STRING,
      count:DataTypes.BIG_INTEGER,
    };
   
  }
  export{Rodzaj,Status,Projekt,Stawszproj,Statstykiprojektrodzaj,Statstykiprojektstatus}