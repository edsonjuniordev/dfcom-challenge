# Refatoração e melhoria

## Problemas encontrados no código original

Além das questões de legibilidade no código, o principal problema identificado que afetava tanto a performance quanto a inconsistência dos dados foi o uso inadequado de transações no MongoDB. Embora as transações sejam úteis para garantir a atomicidade em operações que envolvem múltiplos documentos, o código utilizava essa abordagem de forma desnecessária para operações simples em documentos únicos. Isso não só introduzia uma sobrecarga desnecessária, mas também complicava a lógica sem proporcionar benefícios claros, resultando em um impacto negatico no desempenho geral da aplicação.

## Código Refatorado

```typescript
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

  async createProduct(createProductDto: CreateProductDto): Promise<string> {
    const { title, description, price, category } = createProductDto;

    if (!title || !price) {
      throw new BadRequestException('title and price are required');
    }

    try {
      const newProduct = new this.productModel({
        title,
        description,
        price,
        category,
      });

      const result = await newProduct.save();

      return result._id as string;
    } catch (error) {
      throw new InternalServerErrorException("failed to create product");
    }
  }

  async getProducts(filters?: any): Promise<Product[]> {

    const query = this.buildQuery(filters);

    const products = await query.select('title description price category').exec();

    return products;
  }

  private buildQuery(filters?: any) {
    const { category, minPrice, maxPrice } = filters;

    const query = this.productModel.find();

    if (category) {
      query.where('category').equals(category);
    }

    if (minPrice !== undefined) {
      query.where('price').gte(minPrice);
    }

    if (maxPrice !== undefined) {
      query.where('price').lte(maxPrice);
    }

    return query;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.findProductById(productId);

    return product;
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto): Promise<void> {
    try {
      const product = await this.findProductById(productId);

      if (!product) {
        throw new NotFoundException(`product ${productId} not found while updating product`);
      }

      await this.productModel.updateOne({
        _id: productId,
        updateProductDto
      });
    } catch (error) {
      throw new InternalServerErrorException("failed to update product");
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const product = await this.findProductById(productId);

      if (!product) {
        throw new NotFoundException(`product ${productId} not found while deleting product`);
      }

      await this.productModel.deleteOne({ _id: productId }).exec();
    } catch (error) {
      throw new InternalServerErrorException('failed to delete product');
    }
  }

  private async findProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);

    return product;
  }
}
```

## O que foi refatorado

- Remoção das transações
- Mudança na query de Produtos
- Melhoria no tratamento de erros (cada método possui um erro mais claro do que/onde aconteceu)
- Simplificação na lógica de atualização
- Organização geral da legibilidade do código

## Sugestões de melhoria

- Antes de iniciar a refatoração, é uma boa prática desenvolver testes unitários para validar a execução de cada método. Isso permite comparar o comportamento do código antes e depois da refatoração, garantindo que as alterações não introduzam novos problemas e que a funcionalidade original seja preservada.
- Implementar a injeção de dependências utilizando contratos abstratos, e adotar padrões de design como DAO (Data Access Object) ou Repository para interagir com o banco de dados.
- Como o framework utilizado é o NestJS, usar o recurso class-validator em uma camada acima, removendo assim a responsabilidade de validação de dados do Service.
- Colocar o bloco de try/catch em uma camada superior para utilizar o mapeamento de exceções, proporcionando um controle mais centralizado e eficaz sobre as exceções da aplicação.