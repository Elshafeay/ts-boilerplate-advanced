import DBManager, { dbManagerInstance } from '../../../config/DBManager';
import { Tables } from '../../../admin/mysql/schemas.enums';

export class CommonRepository {
  queryBuilder: DBManager;

  constructor(){
    this.queryBuilder = dbManagerInstance;
  }

  public async dbTruncate(){
    const tablesNames = Object.values(Tables);
    tablesNames.forEach(async (tableName) => {
      await this.queryBuilder.mysql(tableName).truncate();
    });
  }
}

export default new CommonRepository();