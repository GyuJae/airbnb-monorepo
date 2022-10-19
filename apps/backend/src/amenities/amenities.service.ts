import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAmenityInput,
  CreateAmenityOutput,
} from './dtos/create-amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createAmenity({
    name,
    description,
  }: CreateAmenityInput): Promise<CreateAmenityOutput> {
    try {
      const existAmenity = await this.prisma.amenity.findUnique({
        where: {
          name,
        },
      });
      if (existAmenity) {
        return {
          ok: false,
          error: 'Already Exists this amenity',
          amenity: existAmenity,
        };
      }

      const amenity = await this.prisma.amenity.create({
        data: {
          name,
          description,
        },
      });
      return {
        ok: true,
        amenity,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.meesage,
      };
    }
  }
}
