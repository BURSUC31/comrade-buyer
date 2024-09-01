import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { typeOrmConfig } from "src/config/typeorm.config";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { RawBodyMiddleware } from "./raw-body.middleware";

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, ConfigModule.forRoot({
        isGlobal: true, // Makes the configuration available globally
    })],
    providers: [PaymentsService],
    controllers: [PaymentsController]

})
export class PaymentsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RawBodyMiddleware)
            .forRoutes({ path: 'payments/webhook', method: RequestMethod.POST });
    }
}