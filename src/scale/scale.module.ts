import { Module } from "@nestjs/common";
import { ScaleService } from "@/scale/scale.service";
import { ScaleController } from "@/scale/scale.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ScaleJob } from "@/scale/scale.entity";
import { ScaleConsumer } from "@/scale/scale.consumer";
import { BullModule } from "@nestjs/bull";

@Module({
    imports: [
        MikroOrmModule.forFeature([ScaleJob]),
        BullModule.registerQueue({
            name: "scale-queue",
        }),
    ],
    providers: [ScaleService, ScaleConsumer],
    controllers: [ScaleController]
})
export class ScaleModule {}
