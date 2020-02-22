import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository, Repository, getConnection, Connection } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";
import { UserRole } from "../entity/UserRole";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { login, password } = req.body;
    if (!(login && password)) {
      res.status(400).send({ msg: "Login faild!" });
    }

    //Get user from database
    const userRepository = getConnection("mysqlDatabase").getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { login } });
    } catch (error) {
      res.status(401).send({ msg: "Login faild!" });
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send({ msg: "Login faild!" });
      return;
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign({ 
                  userId: user.id, 
                  username: user.userName 
                },
                config.jwtSecret,
                { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send({
      success: true,
      token: token,
      expiredIn: "1h"
    });
  };

  static register = async (req: Request, res: Response) => {
      
    if(!req.body) {
      res.status(400).json("bad Request");
      return;
    }
    //Get parameters from the body
    let { firstName, lastName, email, userName, password, role } = req.body;
    let user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.userName = userName;
    user.password = password;
    user.role = role;

    //validate the sent role
    const roleRepository = getConnection("mysqlDatabase").getRepository(UserRole);
    const sentRole = await roleRepository.findOne({ where: { id: role } });
    
    if(sentRole != undefined) {

      try {
        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getConnection("mysqlDatabase").getRepository(User);
        try {
          await userRepository.save(user);
        } catch (e) {
          res.status(409).send({
            success: false,
            error: e
          });
          return;
        }
      } catch (error) {
        res.status(400).json(error);
        return;
      }
      //If all ok, send 201 response
      res.status(201).send("User created successfully!");

    } else {
      res.status(404).send({
        success: false,
        error: "User Role Not Found"
      });
      return;
    }
      
  }

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getConnection("mysqlDatabase").getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;