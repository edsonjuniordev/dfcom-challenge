import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SinginResponse } from "./dtos/signin.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  @Post('signin')
  public async signin(): Promise<SinginResponse> {
    const token = await this.jwtService.signAsync({ userId: process.env.DEFAULT_USER_ID })

    return { token };
  }
}