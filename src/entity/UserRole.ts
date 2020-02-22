import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne} from "typeorm";
import { IsUppercase } from "class-validator";
import { User } from "./User";

// export type UserRoleTypes = "Admin" | "Editor" | "Ghost";

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({
        type: "set",
        enum: ["ADMIN", "EDITOR", "GHOST"],
        default: `EDITOR`
    })
    @OneToMany(type => User, user => user.id)
    @IsUppercase()
    name: string;
    
}
