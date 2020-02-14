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
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getConnection("mysqlDatabase").getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign({ 
                  userId: user.id, 
                  username: user.username 
                },
                config.jwtSecret,
                { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send({
      "success": true,
      "token": token,
      "expiredIn": "1h"
    });
  };

  static register = async (req: Request, res: Response) => {
      
    let { username, password, roleId } = req.body;
    const roleRepository = await getConnection("mysqlDatabase").getRepository(UserRole);
    const userRole = await roleRepository.findOne(roleId);
    if (userRole == null) {
      res.status(404).send({
        "message": "Role not found"
      })
      res.end();
      return;
    }

    if (!req.body) {
      res.status(505).send("BadRequest")
      res.end();
    }
    let newUser = new User();

    newUser.username = username;
    newUser.password = password;
    newUser.hashPassword();
    newUser.role = userRole;
    const userRepository = getConnection("mysqlDatabase").getRepository(User);
    try {
      await userRepository
      .save(newUser)
      .then(row => {
          res.status(200).send({
            "success": true,
            "message": "Registered successfuly!"
          })
      })
      .catch(err => {
        res.status(401).send({
          "error": err.errmsg
        })

      })
      
    } catch (error) {
      console.error(error);
      
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