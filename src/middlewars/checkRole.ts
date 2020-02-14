import { Request, Response, NextFunction } from "express";
import { getRepository, getConnection } from "typeorm";

import { User } from "../entity/User";
import { UserRole } from "../entity/UserRole";

const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    //Get the user ID from previous midleware
    const userId = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = await getConnection("mysqlDatabase").getRepository(User);
    const roleRepository = await getConnection("mysqlDatabase").getRepository(UserRole);
    let user: User;
    let userRole: UserRole;
    try {
      user = await userRepository.findOneOrFail(userId);     
      userRole = await roleRepository.findOne(user.role);
      

    } catch (error) {
      res.status(401).send(error);

    }

      //Check if Array of authorized roles includes the user's role
    if (roles.indexOf(`${userRole.name}`, 0) > -1) 
      next();
    else 
      res.status(401).send();
  };
};

export default checkRole;