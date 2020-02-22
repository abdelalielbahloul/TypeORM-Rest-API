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
  import { Length, IsNotEmpty, IsEmpty, IsEmail, IsInt } from "class-validator";
  import * as bcrypt from "bcryptjs";
import { UserRole } from "./UserRole";
  
  @Entity()
  @Unique("unique keys",["userName", "email"])
  export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column()
    @IsNotEmpty()
    @Length(4, 60)
    firstName: string;

    @Column()
    @IsNotEmpty()
    @Length(4, 60)
    lastName: string;

    @Column()
    @IsNotEmpty()
    @Length(4, 60)
    userName: string;

    @Column()
    @IsEmail()
    @Length(4, 255)
    email: string;
  
    @Column()
    @Length(4, 255)
    password: string;
    
    @OneToOne(type => UserRole, role => role.id)
    @JoinColumn()
    @IsInt()
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