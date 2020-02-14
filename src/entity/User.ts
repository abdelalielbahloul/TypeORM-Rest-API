import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    OneToOne
  } from "typeorm";
  import { Length, IsNotEmpty, IsEmpty } from "class-validator";
  import * as bcrypt from "bcryptjs";
import { UserRole } from "./UserRole";
  
  @Entity()
  @Unique(["username"])
  export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column()
    @Length(4, 20)
    username: string;
  
    @Column()
    @Length(4, 100)
    password: string;
    
    @OneToOne(type => UserRole)
    @JoinColumn()
    role: UserRole;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
  }