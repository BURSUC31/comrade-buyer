// config.interface.ts
export interface ServerConfig {
    port: number;
    origin: string
}

export interface JwtConfig {
    expiresIn: string;
    secret: string;

}

export interface DbConfig {
    port: number;
    type: "postgres";
    username: string;
    password: string;
    host: string;
    synchronize: boolean;
    database: string
}

