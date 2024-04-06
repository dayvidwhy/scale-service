import { Controller, Post, Get, Res, Query } from "@nestjs/common";
import { ScaleService } from "@/scale/scale.service";
import { Response } from "express";
import { ScaleExceptionFilter } from "@/scale/scale-exception.filter";
import { UseFilters } from "@nestjs/common";

@Controller("scale")
@UseFilters(new ScaleExceptionFilter())
export class ScaleController {
    constructor(private readonly scaleService: ScaleService) {}

    @Post("queue-job")
    async queueJob(
        @Res() res: Response,
    ): Promise<any> {
        const queueInfo = await this.scaleService.queueJob();
        res.setHeader("Content-Type", "application/json");
        res.send(queueInfo);
    }

    @Get("get-job")
    async getJob(
        @Res() res: Response,
        @Query("id") id: string
    ): Promise<any> {
        const scaleJob = await this.scaleService.getJob(id);
        res.setHeader("Content-Type", "application/json");
        res.send(scaleJob);
    }
    
}
