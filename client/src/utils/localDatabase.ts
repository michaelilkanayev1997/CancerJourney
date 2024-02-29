import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("folders.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS folders (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, fileUri TEXT NOT NULL)`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
};

export const insertFile = (file) => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO folders (title, fileUri) VALUES (?, ?)`,
        [file.title, file.fileUri],
        (_, result) => {
          console.log(result);
          resolve(result);
        },
        (_, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });

  return promise;
};

export const fetchFiles = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Drop the existing table
      tx.executeSql(
        `SELECT * FROM folders`,
        [],
        (_, result) => {
          const files = [];

          for (const dp of result.rows._array) {
            files.push({ title: dp.title, fileUri: dp.fileUri });
          }
          console.log(files);
          resolve(files);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
};

export const dropTable = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Drop the existing table
      tx.executeSql(
        `DROP TABLE IF EXISTS folders`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
};
