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
  static Ezor(){
    return this.hasMany(Ezor)
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
  static Ezor(){
    return this.hasMany(Ezor)
  }
}

class Pole extends Model {
  static table = 'Pole';

  static timestamps = false;

  static fields = {
    idpole: {
      primaryKey: true,
      autoIncrement: true,
    },
    numer_pola: DataTypes.STRING,
    powierzchnia: DataTypes.FLOAT,
  };
  idpole!:number
  numer_pola!:string;
  powierzchnia!:number;
  static Ezor(){
    return this.hasMany(Ezor)
  }
}

class Przyczyna extends Model {
  static table = 'przyczyna';

  static timestamps = false;

  static fields = {
    idprzyczyna: {
      primaryKey: true,
      autoIncrement: true,
    },
    przyczyna_wartosc: DataTypes.STRING,
  };
  idprzyczyna!:number
  przyczyna_wartosc!:string;
  static Ezor(){
    return this.hasMany(Ezor)
  }
}
class Warunki_atmosferyczne extends Model {
  static table = 'warunki_atmosferyczne';

  static timestamps = false;

  static fields = {
    idwarunki_atmosferyczne: {
      primaryKey: true,
      autoIncrement: true,
    },
    wartosc_w_a: DataTypes.STRING,
  };
  idwarunki_atmosferyczne!:number
  wartosc_w_a!:string;
  static Ezor(){
    return this.hasMany(Ezor)
  }
}

class Srodek extends Model {
  static table = 'srodek';

  static timestamps = false;

  static fields = {
    idsrodek: {
      primaryKey: true,
      autoIncrement: true,
    },
    nazwa_srodek: DataTypes.STRING,
    opis: DataTypes.STRING,
  };
  idsrodek!:number
  nazwa_srodek!:string;
  opis!:string;
  static Ezor(){
    return this.hasMany(Ezor)
  }
}
class Ezor extends Model {
  static table = 'ezor';

  static timestamps = false;

  static fields = {
    idezor: {
      primaryKey: true,
      autoIncrement: true,
    },
    dawka: DataTypes.FLOAT,
    procent_pola_zabieg: DataTypes.FLOAT,
    data_zabiegu: DataTypes.DATE,
    uwagi: DataTypes.STRING,
  };
  idezor!:number
  dawka!:number;
  procent_pola_zabieg!:number;
  data_zabiegu!:Date;
  uwagi!:string;
  static Przyczyna(){
    return this.hasOne(Przyczyna)
  }
  static Warunki_atmosferyczne(){
    return this.hasOne(Warunki_atmosferyczne)
  }
  static Pole(){
    return this.hasOne(Pole)
  }
  static Srodek(){
    return this.hasOne(Srodek)
  }
  static Osoba(){
    return this.hasOne(Osoba)
  }
  static Magazyn_sor(){
    return this.hasOne(Magazyn_sor)
  }
}



  export{Osoba,Magazyn_sor,Pole,Przyczyna,Warunki_atmosferyczne,Srodek,Ezor}