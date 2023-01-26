import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemDataSource} from '../datasources';
import {Data, DataRelations} from '../models';

export class DataRepository extends DefaultCrudRepository<
  Data,
  typeof Data.prototype.id,
  DataRelations
> {
  constructor(
    @inject('datasources.mem') dataSource: MemDataSource,
  ) {
    super(Data, dataSource);
  }
}
