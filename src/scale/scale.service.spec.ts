import { Test, TestingModule } from "@nestjs/testing";
import { ScaleService } from "@/scale/scale.service";
import { ScaleConsumer } from "./scale.consumer";
import { MikroOrmModule, getRepositoryToken } from "@mikro-orm/nestjs";
import { ScaleJob } from "@/scale/scale.entity";
import { BullModule } from "@nestjs/bull";
import config from "@/mikro-orm.config";

describe("ScaleService", () => {
    let service: ScaleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MikroOrmModule.forRoot({
                    ...config,
                    connect: false,
                    dbName: "test"
                }),
                BullModule.registerQueue({
                    name: "scale-queue",
                }),
            ],
            providers: [
                ScaleService,
                ScaleConsumer,
                {
                    provide: getRepositoryToken(ScaleJob),
                    useFactory: jest.fn(() => ({
                        findOneOrFail: jest.fn(() => ({
                            guid: "test",
                            output: "test",
                            pending: true
                        }))
                    }))
                }
            ],
        }).compile();

        service = module.get<ScaleService>(ScaleService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should get a complete job", async () => {
        const expected = {
            id: "test",
            status: "pending"
        };
        const jobData = await service.getJob("test");
        expect(jobData).toStrictEqual(expected);
    });
});
