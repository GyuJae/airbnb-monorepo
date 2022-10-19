import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory({
    name,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          name,
        },
      });
      if (category) {
        return {
          ok: false,
          error: 'Already exists this category',
          category,
        };
      }
      const createdCategory = await this.prisma.category.create({
        data: {
          name,
        },
      });
      return {
        ok: true,
        category: createdCategory,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
