import 'reflect-metadata';
import { AppRouter } from '../../AppRouter';
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKeys';
import { RequestHandler, Request, Response, NextFunction } from 'express';

function bodyValidators(keys: string): RequestHandler{
  return function (req: Request, res: Response, next: NextFunction){
    if(!req.body){
      res.status(422).send('Invalid request');
    }

    for(let key of keys){
      if(!req.body[key]){
        res.status(422).send('Invalid request');
        return;
      }
    }

    next();
  }
}

export function controller(routePrefix: string){
  return function(target: Function){
    const router = AppRouter.getInstance();
    console.log('The Router ', router);
    for(let key in target.prototype){
      console.log('The target Prototype', target.prototype);
      const routeHandler = target.prototype[key];
      console.log('route Handler', routeHandler);
      const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
      console.log('The path ', path);
      const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);
      console.log('The Router ', method);
      const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype,key) || [];
      console.log('The Middlewares', middlewares);
      if(path){
        router[method](`${routePrefix}${path}`, ...middlewares, routeHandler);
      }
    }
  }
}