import { Test, TestingModule } from "@nestjs/testing";
import { ScaleController } from "@/scale/scale.controller";
import { ScaleService } from "@/scale/scale.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ScaleJob } from "@/scale/scale.entity";
import { BullModule } from "@nestjs/bull";
import config from "@/mikro-orm.config";
import { Response } from "express";

describe("ScaleController", () => {
    let scaleController: ScaleController;
    let scaleService: ScaleService;

    beforeEach(async () => {
        
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MikroOrmModule.forRoot({
                    ...config,
                    connect: false,
                    dbName: "test"
                }),
                MikroOrmModule.forFeature([ScaleJob]),
                BullModule.registerQueue({
                    name: "scale-queue",
                }),
            ],
            controllers: [ScaleController],
            providers: [ScaleService],
        }).compile();

        scaleController = module.get<ScaleController>(ScaleController);
        scaleService = module.get<ScaleService>(ScaleService);
    });

    it("should be defined", () => {
        expect(scaleController).toBeDefined();
    });

    it("should return job queue data", async () => {
        // Mock the response object given to the controller
        const mockResponse = {
            send: jest.fn(),
            setHeader: jest.fn(),
        } as unknown as Response;

        const expected = { queued: true, id: "123" };

        // Set job to respond with expected value
        jest.spyOn(scaleService, "queueJob").mockResolvedValue(expected);

        // Trigger the controller method
        await scaleController.queueJob(mockResponse);
        
        // Validate that the controller called the service
        expect(scaleService.queueJob).toHaveBeenCalled();

        // Validate the response was sent from the controller
        expect(mockResponse.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
        expect(mockResponse.send).toHaveBeenCalledWith(expected);
    });

    it("should get a job", async () => {
        // Mock the response object given to the controller
        const mockResponse = {
            send: jest.fn(),
            setHeader: jest.fn(),
        } as unknown as Response;

        const expected = {
            id: "123",
            status: "complete"
        };

        // Set getJob to respond with expected value
        jest.spyOn(scaleService, "getJob").mockResolvedValue(expected);

        // Trigger the controller method
        await scaleController.getJob(mockResponse, "123");

        // Validate that the controller called the service
        expect(scaleService.getJob).toHaveBeenCalledWith("123");

        // Validate the response was sent from the controller
        expect(mockResponse.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
        expect(mockResponse.send).toHaveBeenCalledWith(expected);
    });
});
