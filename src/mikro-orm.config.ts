import * as DotEnv from "dotenv";
import { PostgreSqlDriver, defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

if (process.env.NODE_ENV !== "test") {
    const EnvFilePath: string = `${process.cwd()}/.env`;
    DotEnv.config({ path: EnvFilePath });
}

export default defineConfig({
    entities: ["dist/src/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    driver: PostgreSqlDriver,
    dbName: process.env.NODE_ENV === "test" ? "" : process.env.POSTGRES_DB,
    user: process.env.NODE_ENV === "test" ? "" : process.env.POSTGRES_USER,
    password: process.env.NODE_ENV === "test" ? "" : process.env.POSTGRES_PASSWORD,
    host: process.env.NODE_ENV === "test" ? "" : process.env.POSTGRES_HOST,
    port: +(process.env.NODE_ENV === "test" ? "" : process.env.POSTGRES_PORT),
    extensions: [Migrator],
    migrations: {
        tableName: "mikro_orm_migrations",
        path: "dist/src/migrations",
        pathTs: "src/migrations",
        transactional: true,
        allOrNothing: true,
        emit: "ts",
        snapshot: false
    }
});
