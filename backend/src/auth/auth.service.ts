import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            accessToken,
            refreshToken,
            user,
        };
    }

    async register(email: string, pass: string, name: string) {
        const hashedPassword = await bcrypt.hash(pass, 10);
        try {
            const user = await this.usersService.createUser({
                email,
                password: hashedPassword,
                name,
            });
            return this.login(user);
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async seedAdmin() {
        const email = 'admin@example.com';
        const password = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await this.prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    name: 'Admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            return user;
        } catch (e) {
            return { error: e.message };
        }
    }
}
