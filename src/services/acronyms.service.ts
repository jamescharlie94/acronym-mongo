import { CreateAcronymDto } from '@dtos/acronyms.dto';
import { HttpException } from '@exceptions/HttpException';
import { Acronym } from '@interfaces/acronyms.interface';
import acronymModel from '@models/acronyms.model';
import { isEmpty } from '@utils/util';

class AcronymService {
  public acronyms = acronymModel;

  public async findAllAcronym(params: any): Promise<Acronym[]> {
    const { from = 0, limit = 10, search = '' } = params;
    const acronyms: Acronym[] = await this.acronyms
      .find({ $or: [{ definition: { $regex: search } }, { acronym: { $regex: search } }] })
      .skip(from)
      .limit(limit);
    return acronyms;
  }

  public async createAcronym(acronymData: CreateAcronymDto): Promise<Acronym> {
    if (isEmpty(acronymData)) throw new HttpException(400, 'acronymData is empty');

    const createAcronymData = new acronymModel(acronymData);
    await createAcronymData.save();

    return createAcronymData;
  }

  public async updateAcronym(acronym: string, acronymData: CreateAcronymDto): Promise<Acronym> {
    if (isEmpty(acronymData)) throw new HttpException(400, 'acronymData is empty');

    const findAcronym = await this.acronyms.findOneAndUpdate(
      { acronym },
      { $set: { definition: acronymData.definition } },
      { returnDocument: 'after' },
    );

    if (findAcronym === null) {
      throw new HttpException(409, "Acronym doesn't exist");
    }

    return findAcronym;
  }

  public async deleteAcronym(acronym: string): Promise<Acronym> {
    const deleteAcronymData = await this.acronyms.remove({ acronym });

    if (deleteAcronymData.deletedCount === 0) {
      throw new HttpException(409, "Acronym doesn't exist");
    }

    return deleteAcronymData;
  }
}

export default AcronymService;
