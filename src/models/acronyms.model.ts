import { model, Schema, Document } from 'mongoose';
import { Acronym } from '@interfaces/acronyms.interface';

const acronymSchema: Schema = new Schema({
  acronym: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
});

const acronymModel = model<Acronym & Document>('Acronym', acronymSchema);

export default acronymModel;
