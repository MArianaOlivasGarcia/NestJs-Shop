import { PartialType } from '@nestjs/mapped-types';
import { CreateCraftsmanDto } from './create-craftsman.dto';

export class UpdateCraftsmanDto extends PartialType(CreateCraftsmanDto) {}
