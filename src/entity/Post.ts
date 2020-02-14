import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ database: "devDatabase" })
export class Post {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string;
    
    @Column()
    text: string;

}
