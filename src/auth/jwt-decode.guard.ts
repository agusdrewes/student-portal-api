import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtDecodeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Falta el header Authorization');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      // ⚠️ No verificamos firma, solo decodificamos el token
      const decoded = jwt.decode(token);

      if (!decoded || typeof decoded === 'string') {
        throw new UnauthorizedException('Token inválido');
      }

      // Validamos expiración
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        throw new UnauthorizedException('Token expirado');
      }

      // Guardamos los datos del usuario para usarlos luego
      request['user'] = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
