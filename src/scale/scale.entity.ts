import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class ScaleJob {
    @PrimaryKey({ hidden: true })
        id!: number;

    @Property()
        guid!: string;
    
    @Property()
        pending!: boolean;

    @Property()
        type!: string;
}
